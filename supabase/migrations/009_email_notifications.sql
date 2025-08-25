-- Migration 009: Email Notifications System
-- Description: Creates tables for email preferences, notification logs, and related functions
-- Author: Proofr Team
-- Date: 2025-01-20

-- Enable required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Email preferences table
CREATE TABLE IF NOT EXISTS public.email_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Student notification preferences
  booking_confirmations BOOLEAN DEFAULT true,
  booking_status_updates BOOLEAN DEFAULT true,
  service_completions BOOLEAN DEFAULT true,
  new_messages BOOLEAN DEFAULT true,
  waitlist_updates BOOLEAN DEFAULT true,
  credits_earned BOOLEAN DEFAULT true,
  
  -- Consultant notification preferences  
  new_booking_requests BOOLEAN DEFAULT true,
  payment_updates BOOLEAN DEFAULT true,
  profile_updates BOOLEAN DEFAULT true,
  review_notifications BOOLEAN DEFAULT true,
  
  -- General preferences
  marketing_emails BOOLEAN DEFAULT false,
  weekly_digest BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email notification log for tracking and retry logic
CREATE TABLE IF NOT EXISTS public.email_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  email_address TEXT NOT NULL,
  email_type VARCHAR(50) NOT NULL,
  
  -- Email content
  subject TEXT NOT NULL,
  template_id VARCHAR(100),
  template_data JSONB,
  
  -- Related entities
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  
  -- Status tracking
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'bounced')),
  brevo_message_id TEXT,
  
  -- Engagement tracking
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  
  -- Error handling
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  next_retry_at TIMESTAMPTZ,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for tracking email template versions
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  subject_template TEXT NOT NULL,
  html_template TEXT,
  text_template TEXT,
  variables JSONB, -- List of required variables
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_email_preferences_user ON public.email_preferences(user_id);
CREATE INDEX idx_email_notifications_user ON public.email_notifications(user_id);
CREATE INDEX idx_email_notifications_status ON public.email_notifications(status);
CREATE INDEX idx_email_notifications_retry ON public.email_notifications(status, next_retry_at) 
  WHERE status IN ('pending', 'failed') AND retry_count < max_retries;
CREATE INDEX idx_email_notifications_booking ON public.email_notifications(booking_id);
CREATE INDEX idx_email_templates_active ON public.email_templates(template_id) WHERE is_active = true;

-- Function to auto-create email preferences for new users
CREATE OR REPLACE FUNCTION create_email_preferences_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.email_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create preferences on user creation
CREATE TRIGGER create_email_preferences_on_user_insert
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION create_email_preferences_for_user();

-- Function to update email_notifications updated_at
CREATE OR REPLACE FUNCTION update_email_notification_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_email_notifications_updated_at
BEFORE UPDATE ON public.email_notifications
FOR EACH ROW
EXECUTE FUNCTION update_email_notification_updated_at();

-- Function to queue email notification
CREATE OR REPLACE FUNCTION queue_email_notification(
  p_user_id UUID,
  p_email_type VARCHAR(50),
  p_template_id VARCHAR(100),
  p_template_data JSONB,
  p_booking_id UUID DEFAULT NULL,
  p_message_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
  v_user_record RECORD;
  v_preferences RECORD;
  v_should_send BOOLEAN := false;
BEGIN
  -- Get user details
  SELECT u.id, u.email, u.user_type
  INTO v_user_record
  FROM public.users u
  WHERE u.id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', p_user_id;
  END IF;
  
  -- Check email preferences
  SELECT * INTO v_preferences
  FROM public.email_preferences
  WHERE user_id = p_user_id;
  
  -- Determine if we should send based on email type and preferences
  CASE p_email_type
    WHEN 'booking_confirmation' THEN 
      v_should_send := COALESCE(v_preferences.booking_confirmations, true);
    WHEN 'booking_accepted', 'booking_declined' THEN 
      v_should_send := COALESCE(v_preferences.booking_status_updates, true);
    WHEN 'service_completed' THEN 
      v_should_send := COALESCE(v_preferences.service_completions, true);
    WHEN 'new_message' THEN 
      v_should_send := COALESCE(v_preferences.new_messages, true);
    WHEN 'new_booking_request' THEN 
      v_should_send := COALESCE(v_preferences.new_booking_requests, true);
    WHEN 'payment_update' THEN 
      v_should_send := COALESCE(v_preferences.payment_updates, true);
    WHEN 'profile_update' THEN 
      v_should_send := COALESCE(v_preferences.profile_updates, true);
    ELSE 
      v_should_send := true; -- Default to sending if type unknown
  END CASE;
  
  IF NOT v_should_send THEN
    RETURN NULL; -- User has opted out of this notification type
  END IF;
  
  -- Insert notification record
  INSERT INTO public.email_notifications (
    user_id,
    email_address,
    email_type,
    subject,
    template_id,
    template_data,
    booking_id,
    message_id,
    status
  ) VALUES (
    p_user_id,
    v_user_record.email,
    p_email_type,
    p_email_type, -- Subject will be set by template
    p_template_id,
    p_template_data,
    p_booking_id,
    p_message_id,
    'pending'
  ) RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to handle booking notifications
CREATE OR REPLACE FUNCTION notify_booking_event()
RETURNS TRIGGER AS $$
DECLARE
  v_template_data JSONB;
  v_consultant_record RECORD;
  v_student_record RECORD;
  v_service_record RECORD;
BEGIN
  -- Get related records
  SELECT * INTO v_consultant_record FROM public.consultants WHERE id = NEW.consultant_id;
  SELECT * INTO v_student_record FROM public.students WHERE id = NEW.student_id;
  SELECT * INTO v_service_record FROM public.services WHERE id = NEW.service_id;
  
  -- Build template data
  v_template_data := jsonb_build_object(
    'booking_id', NEW.id,
    'student_name', v_student_record.name,
    'consultant_name', v_consultant_record.name,
    'service_title', v_service_record.title,
    'service_type', v_service_record.service_type,
    'price', NEW.final_price,
    'delivery_date', NEW.promised_delivery_at,
    'status', NEW.status
  );
  
  -- Handle different booking events
  IF TG_OP = 'INSERT' THEN
    -- Notify student of booking confirmation
    PERFORM queue_email_notification(
      NEW.student_id,
      'booking_confirmation',
      'booking_confirmation',
      v_template_data,
      NEW.id
    );
    
    -- Notify consultant of new booking request
    PERFORM queue_email_notification(
      NEW.consultant_id,
      'new_booking_request',
      'new_booking_request',
      v_template_data,
      NEW.id
    );
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Check for status changes
    IF OLD.status != NEW.status THEN
      CASE NEW.status
        WHEN 'confirmed' THEN
          -- Notify student that booking was accepted
          PERFORM queue_email_notification(
            NEW.student_id,
            'booking_accepted',
            'booking_accepted',
            v_template_data,
            NEW.id
          );
          
        WHEN 'cancelled' THEN
          -- Notify both parties of cancellation
          PERFORM queue_email_notification(
            NEW.student_id,
            'booking_declined',
            'booking_declined',
            v_template_data || jsonb_build_object('reason', NEW.cancellation_reason),
            NEW.id
          );
          
        WHEN 'completed' THEN
          -- Notify student of completion
          PERFORM queue_email_notification(
            NEW.student_id,
            'service_completed',
            'service_completed',
            v_template_data || jsonb_build_object('deliverables', NEW.deliverables),
            NEW.id
          );
          
          -- Notify consultant of payment
          PERFORM queue_email_notification(
            NEW.consultant_id,
            'payment_update',
            'payment_received',
            v_template_data || jsonb_build_object('earnings', NEW.final_price * 0.8),
            NEW.id
          );
      END CASE;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for booking events
CREATE TRIGGER notify_on_booking_events
AFTER INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION notify_booking_event();

-- Function to handle message notifications (rate-limited)
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  v_conversation RECORD;
  v_last_notification TIMESTAMPTZ;
  v_recipient_id UUID;
  v_template_data JSONB;
BEGIN
  -- Get conversation details
  SELECT * INTO v_conversation 
  FROM public.conversations 
  WHERE id = NEW.conversation_id;
  
  -- Determine recipient
  IF NEW.sender_id = v_conversation.student_id THEN
    v_recipient_id := v_conversation.consultant_id;
  ELSE
    v_recipient_id := v_conversation.student_id;
  END IF;
  
  -- Check for recent notifications to prevent spam (5 minute cooldown)
  SELECT MAX(created_at) INTO v_last_notification
  FROM public.email_notifications
  WHERE user_id = v_recipient_id
    AND email_type = 'new_message'
    AND created_at > NOW() - INTERVAL '5 minutes';
  
  IF v_last_notification IS NOT NULL THEN
    RETURN NEW; -- Skip notification due to rate limit
  END IF;
  
  -- Build template data
  v_template_data := jsonb_build_object(
    'message_preview', LEFT(NEW.content, 100),
    'sender_name', (
      SELECT COALESCE(s.name, c.name)
      FROM public.users u
      LEFT JOIN public.students s ON s.id = u.id
      LEFT JOIN public.consultants c ON c.id = u.id
      WHERE u.id = NEW.sender_id
    ),
    'conversation_id', NEW.conversation_id
  );
  
  -- Queue notification
  PERFORM queue_email_notification(
    v_recipient_id,
    'new_message',
    'new_message',
    v_template_data,
    NULL,
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for message notifications
CREATE TRIGGER notify_on_new_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION notify_new_message();

-- Function to handle consultant verification updates
CREATE OR REPLACE FUNCTION notify_verification_update()
RETURNS TRIGGER AS $$
DECLARE
  v_template_data JSONB;
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.verification_status != NEW.verification_status THEN
    v_template_data := jsonb_build_object(
      'consultant_name', NEW.name,
      'status', NEW.verification_status,
      'verified_at', NEW.verified_at
    );
    
    PERFORM queue_email_notification(
      NEW.id,
      'profile_update',
      CASE NEW.verification_status
        WHEN 'approved' THEN 'verification_approved'
        WHEN 'rejected' THEN 'verification_rejected'
        ELSE 'verification_pending'
      END,
      v_template_data
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for verification updates
CREATE TRIGGER notify_on_verification_update
AFTER UPDATE ON public.consultants
FOR EACH ROW
WHEN (OLD.verification_status IS DISTINCT FROM NEW.verification_status)
EXECUTE FUNCTION notify_verification_update();

-- Insert default email templates
INSERT INTO public.email_templates (template_id, name, subject_template, description, variables) VALUES
('booking_confirmation', 'Booking Confirmation', 'Your booking with {{consultant_name}} is confirmed!', 'Sent to students when they create a booking', '["student_name", "consultant_name", "service_title", "price", "delivery_date"]'),
('booking_accepted', 'Booking Accepted', '{{consultant_name}} accepted your booking!', 'Sent when consultant accepts a booking', '["student_name", "consultant_name", "service_title"]'),
('booking_declined', 'Booking Declined', 'Update on your booking request', 'Sent when a booking is cancelled', '["student_name", "consultant_name", "service_title", "reason"]'),
('service_completed', 'Service Completed', 'Your service from {{consultant_name}} is ready!', 'Sent when consultant delivers the service', '["student_name", "consultant_name", "service_title", "deliverables"]'),
('new_booking_request', 'New Booking Request', 'New booking from {{student_name}}!', 'Sent to consultants for new bookings', '["student_name", "consultant_name", "service_title", "price"]'),
('payment_received', 'Payment Received', 'You earned ${{earnings}} from {{student_name}}', 'Sent when payment is processed', '["consultant_name", "student_name", "earnings", "service_title"]'),
('new_message', 'New Message', 'New message from {{sender_name}}', 'Sent when user receives a message', '["sender_name", "message_preview"]'),
('verification_approved', 'Verification Approved', 'Welcome to Proofr! You are now verified', 'Sent when consultant is verified', '["consultant_name"]'),
('verification_rejected', 'Verification Update', 'Update on your Proofr verification', 'Sent when verification is rejected', '["consultant_name"]')
ON CONFLICT (template_id) DO NOTHING;

-- Enable RLS for new tables
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_preferences
CREATE POLICY "Users can view their own email preferences" ON public.email_preferences
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own email preferences" ON public.email_preferences
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert email preferences" ON public.email_preferences
  FOR INSERT WITH CHECK (true);

-- RLS Policies for email_notifications  
CREATE POLICY "Users can view their own notifications" ON public.email_notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage all notifications" ON public.email_notifications
  FOR ALL USING (true);

-- RLS Policies for email_templates (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view templates" ON public.email_templates
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create initial preferences for existing users
INSERT INTO public.email_preferences (user_id)
SELECT id FROM public.users
ON CONFLICT (user_id) DO NOTHING;

COMMENT ON TABLE public.email_preferences IS 'User email notification preferences';
COMMENT ON TABLE public.email_notifications IS 'Email notification queue and log';
COMMENT ON TABLE public.email_templates IS 'Email template definitions';