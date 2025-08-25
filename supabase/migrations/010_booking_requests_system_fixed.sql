-- Migration 010: Booking Requests System (Fixed Version)
-- Description: Creates tables for pre-payment booking request workflow with trigger-based columns
-- Author: Proofr Team
-- Date: 2025-01-23

-- Create enum for booking request status
CREATE TYPE booking_request_status AS ENUM (
  'draft',
  'pending_review',
  'in_discussion',
  'accepted',
  'rejected',
  'paid',
  'expired',
  'cancelled'
);

-- Main booking requests table
CREATE TABLE public.booking_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  consultant_id UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  
  -- Request details
  purpose_of_service TEXT NOT NULL,
  additional_requirements TEXT,
  deadline_date DATE,
  urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high', 'urgent')),
  
  -- Status tracking
  status booking_request_status DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- Consultant response
  consultant_notes TEXT,
  rejection_reason TEXT,
  estimated_delivery_time TEXT,
  
  -- Pricing (set by consultant upon acceptance)
  quoted_price NUMERIC(10,2),
  selected_tier TEXT,
  
  -- Link to final booking once paid
  booking_id UUID REFERENCES public.bookings(id),
  
  -- Auto-save support
  last_saved_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure proper status transitions
  CONSTRAINT valid_submission CHECK (
    (status != 'draft' AND submitted_at IS NOT NULL) OR
    (status = 'draft')
  ),
  CONSTRAINT valid_acceptance CHECK (
    (status = 'accepted' AND accepted_at IS NOT NULL) OR
    (status != 'accepted')
  ),
  CONSTRAINT valid_rejection CHECK (
    (status = 'rejected' AND rejected_at IS NOT NULL AND rejection_reason IS NOT NULL) OR
    (status != 'rejected')
  )
);

-- Table for text inputs (pasted content)
CREATE TABLE public.booking_text_inputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES public.booking_requests(id) ON DELETE CASCADE,
  
  -- Content details
  input_type TEXT NOT NULL CHECK (input_type IN ('essay', 'prompt', 'notes', 'other')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER, -- Will be calculated by trigger
  
  -- Order for multiple inputs
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to calculate word count
CREATE OR REPLACE FUNCTION calculate_word_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count := array_length(string_to_array(NEW.content, ' '), 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update word count
CREATE TRIGGER update_word_count
  BEFORE INSERT OR UPDATE OF content ON public.booking_text_inputs
  FOR EACH ROW
  EXECUTE FUNCTION calculate_word_count();

-- Table for file uploads
CREATE TABLE public.booking_file_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES public.booking_requests(id) ON DELETE CASCADE,
  
  -- File details
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL CHECK (file_size <= 262144000), -- 250MB limit
  storage_path TEXT NOT NULL, -- Supabase Storage path
  
  -- Upload tracking
  upload_status TEXT DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploading', 'completed', 'failed')),
  upload_progress INTEGER DEFAULT 0 CHECK (upload_progress >= 0 AND upload_progress <= 100),
  uploaded_at TIMESTAMPTZ,
  
  -- Auto-deletion tracking
  scheduled_deletion_date DATE, -- Will be calculated by trigger
  deletion_notified BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  
  -- Metadata
  description TEXT,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to calculate scheduled deletion date
CREATE OR REPLACE FUNCTION calculate_deletion_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.scheduled_deletion_date := (NEW.created_at + INTERVAL '30 days')::DATE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set deletion date
CREATE TRIGGER set_deletion_date
  BEFORE INSERT ON public.booking_file_uploads
  FOR EACH ROW
  EXECUTE FUNCTION calculate_deletion_date();

-- Table for Google Doc links
CREATE TABLE public.booking_doc_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES public.booking_requests(id) ON DELETE CASCADE,
  
  -- Link details
  doc_url TEXT NOT NULL,
  doc_title TEXT,
  doc_type TEXT CHECK (doc_type IN ('google_doc', 'google_sheet', 'google_slide', 'other')),
  
  -- Access verification
  is_accessible BOOLEAN DEFAULT true,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  description TEXT,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Validate Google Doc URLs
  CONSTRAINT valid_doc_url CHECK (
    doc_url LIKE 'https://docs.google.com/%' OR
    doc_url LIKE 'https://drive.google.com/%'
  )
);

-- Table for request messages (chat between student and consultant)
CREATE TABLE public.booking_request_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES public.booking_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id),
  
  -- Message content
  message TEXT NOT NULL,
  
  -- Read tracking
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Message metadata
  is_system_message BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_booking_requests_student ON public.booking_requests(student_id);
CREATE INDEX idx_booking_requests_consultant ON public.booking_requests(consultant_id);
CREATE INDEX idx_booking_requests_service ON public.booking_requests(service_id);
CREATE INDEX idx_booking_requests_status ON public.booking_requests(status);
CREATE INDEX idx_booking_requests_created ON public.booking_requests(created_at DESC);

CREATE INDEX idx_booking_text_inputs_request ON public.booking_text_inputs(request_id);
CREATE INDEX idx_booking_file_uploads_request ON public.booking_file_uploads(request_id);
CREATE INDEX idx_booking_file_uploads_deletion ON public.booking_file_uploads(scheduled_deletion_date);
CREATE INDEX idx_booking_doc_links_request ON public.booking_doc_links(request_id);
CREATE INDEX idx_booking_request_messages_request ON public.booking_request_messages(request_id);
CREATE INDEX idx_booking_request_messages_sender ON public.booking_request_messages(sender_id);

-- Apply updated_at triggers
CREATE TRIGGER update_booking_requests_updated_at BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_text_inputs_updated_at BEFORE UPDATE ON public.booking_text_inputs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_file_uploads_updated_at BEFORE UPDATE ON public.booking_file_uploads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_doc_links_updated_at BEFORE UPDATE ON public.booking_doc_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-update last_saved_at for drafts
CREATE OR REPLACE FUNCTION update_request_last_saved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'draft' THEN
    NEW.last_saved_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_request_last_saved_trigger
  BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_request_last_saved();

-- Function to handle request expiration (72 hours after consultant acceptance without payment)
CREATE OR REPLACE FUNCTION set_request_expiration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    NEW.expires_at = NOW() + INTERVAL '72 hours';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_request_expiration_trigger
  BEFORE UPDATE OF status ON public.booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_request_expiration();

-- Function to create system message when status changes
CREATE OR REPLACE FUNCTION create_status_change_message()
RETURNS TRIGGER AS $$
DECLARE
  message_text TEXT;
BEGIN
  -- Generate appropriate message based on status change
  IF NEW.status = 'pending_review' AND OLD.status = 'draft' THEN
    message_text := 'Request submitted for review';
  ELSIF NEW.status = 'in_discussion' AND OLD.status = 'pending_review' THEN
    message_text := 'Consultant has started reviewing your request';
  ELSIF NEW.status = 'accepted' THEN
    message_text := 'Request accepted! Please proceed with payment within 72 hours.';
  ELSIF NEW.status = 'rejected' THEN
    message_text := 'Request declined. Reason: ' || COALESCE(NEW.rejection_reason, 'Not specified');
  ELSIF NEW.status = 'paid' THEN
    message_text := 'Payment received! Your consultant will begin working on your request.';
  ELSE
    RETURN NEW; -- No message for other status changes
  END IF;
  
  -- Insert system message
  INSERT INTO public.booking_request_messages (
    request_id,
    sender_id,
    message,
    is_system_message
  ) VALUES (
    NEW.id,
    NEW.consultant_id, -- System messages attributed to consultant
    message_text,
    true
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_status_message_trigger
  AFTER UPDATE OF status ON public.booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION create_status_change_message();

-- RLS Policies
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_text_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_doc_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_request_messages ENABLE ROW LEVEL SECURITY;

-- Students can view and modify their own requests
CREATE POLICY "Students can view own requests" ON public.booking_requests
  FOR SELECT USING (auth.uid()::uuid = student_id);

CREATE POLICY "Students can create requests" ON public.booking_requests
  FOR INSERT WITH CHECK (auth.uid()::uuid = student_id);

CREATE POLICY "Students can update own draft requests" ON public.booking_requests
  FOR UPDATE USING (auth.uid()::uuid = student_id AND status = 'draft');

-- Consultants can view requests sent to them
CREATE POLICY "Consultants can view their requests" ON public.booking_requests
  FOR SELECT USING (auth.uid()::uuid = consultant_id);

CREATE POLICY "Consultants can update request status" ON public.booking_requests
  FOR UPDATE USING (auth.uid()::uuid = consultant_id);

-- Similar policies for related tables
CREATE POLICY "Users can view request inputs" ON public.booking_text_inputs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.booking_requests br
      WHERE br.id = request_id
      AND (auth.uid()::uuid = br.student_id OR auth.uid()::uuid = br.consultant_id)
    )
  );

CREATE POLICY "Students can manage own inputs" ON public.booking_text_inputs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.booking_requests br
      WHERE br.id = request_id
      AND auth.uid()::uuid = br.student_id
      AND br.status = 'draft'
    )
  );

-- Repeat similar patterns for other tables
CREATE POLICY "Users can view request files" ON public.booking_file_uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.booking_requests br
      WHERE br.id = request_id
      AND (auth.uid()::uuid = br.student_id OR auth.uid()::uuid = br.consultant_id)
    )
  );

CREATE POLICY "Students can manage own files" ON public.booking_file_uploads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.booking_requests br
      WHERE br.id = request_id
      AND auth.uid()::uuid = br.student_id
      AND br.status = 'draft'
    )
  );

CREATE POLICY "Users can view request links" ON public.booking_doc_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.booking_requests br
      WHERE br.id = request_id
      AND (auth.uid()::uuid = br.student_id OR auth.uid()::uuid = br.consultant_id)
    )
  );

CREATE POLICY "Students can manage own links" ON public.booking_doc_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.booking_requests br
      WHERE br.id = request_id
      AND auth.uid()::uuid = br.student_id
      AND br.status = 'draft'
    )
  );

CREATE POLICY "Users can view request messages" ON public.booking_request_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.booking_requests br
      WHERE br.id = request_id
      AND (auth.uid()::uuid = br.student_id OR auth.uid()::uuid = br.consultant_id)
    )
  );

CREATE POLICY "Users can send messages" ON public.booking_request_messages
  FOR INSERT WITH CHECK (
    auth.uid()::uuid = sender_id AND
    EXISTS (
      SELECT 1 FROM public.booking_requests br
      WHERE br.id = request_id
      AND (auth.uid()::uuid = br.student_id OR auth.uid()::uuid = br.consultant_id)
    )
  );

-- Comments for documentation
COMMENT ON TABLE public.booking_requests IS 'Pre-payment booking request workflow';
COMMENT ON TABLE public.booking_text_inputs IS 'Text content pasted directly into booking requests';
COMMENT ON TABLE public.booking_file_uploads IS 'File uploads associated with booking requests';
COMMENT ON TABLE public.booking_doc_links IS 'Google Doc and other document links for booking requests';
COMMENT ON TABLE public.booking_request_messages IS 'Chat messages between student and consultant during request review';

COMMENT ON COLUMN public.booking_requests.status IS 'Request lifecycle: draft → pending_review → in_discussion/accepted/rejected → paid';
COMMENT ON COLUMN public.booking_file_uploads.scheduled_deletion_date IS 'Files auto-delete 30 days after upload';

-- Create storage bucket for file uploads (run this separately in Storage section)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'booking-uploads',
--   'booking-uploads',
--   false,
--   262144000, -- 250MB
--   ARRAY['application/pdf', 'text/plain', 'application/msword', 
--         'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
-- );