-- Migration 006: Messaging and Favorites
-- Description: Creates tables for conversations, messages, and saved consultants
-- Author: Proofr Team
-- Date: 2025-01-03

-- Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  consultant_id UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  
  -- Track if this is from a paying customer
  has_booking BOOLEAN DEFAULT false,
  last_booking_id UUID REFERENCES public.bookings(id),
  
  -- Conversation metadata
  started_by UUID NOT NULL REFERENCES public.users(id),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_preview TEXT,
  
  -- Unread counts
  student_unread_count INTEGER DEFAULT 0,
  consultant_unread_count INTEGER DEFAULT 0,
  
  -- Status
  is_archived BOOLEAN DEFAULT false,
  archived_by UUID REFERENCES public.users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique conversation per student-consultant pair
  CONSTRAINT unique_conversation UNIQUE (student_id, consultant_id)
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id),
  
  -- Message content
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]', -- [{name, url, type, size}]
  
  -- Read tracking
  read_at TIMESTAMPTZ,
  
  -- Edit history
  edited_at TIMESTAMPTZ,
  edit_history JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved consultants (favorites)
CREATE TABLE public.saved_consultants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  consultant_id UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  
  -- Optional organization
  list_name TEXT DEFAULT 'Favorites',
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate saves
  CONSTRAINT unique_saved UNIQUE (student_id, consultant_id, list_name)
);

-- Consultant views tracking (for recommendations)
CREATE TABLE public.consultant_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  consultant_id UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  
  -- Track context
  referrer TEXT, -- 'search', 'recommendation', 'direct'
  search_query TEXT,
  
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_conversations_student ON public.conversations(student_id);
CREATE INDEX idx_conversations_consultant ON public.conversations(consultant_id);
CREATE INDEX idx_conversations_has_booking ON public.conversations(has_booking);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);

CREATE INDEX idx_saved_consultants_student ON public.saved_consultants(student_id);
CREATE INDEX idx_consultant_views_student ON public.consultant_views(student_id);
CREATE INDEX idx_consultant_views_consultant ON public.consultant_views(consultant_id);

-- Update conversation metadata when message is sent
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET 
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 100),
    has_booking = EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE student_id = conversations.student_id 
      AND consultant_id = conversations.consultant_id
      AND status NOT IN ('cancelled', 'refunded')
    ),
    student_unread_count = CASE 
      WHEN NEW.sender_id = conversations.consultant_id 
      THEN student_unread_count + 1 
      ELSE 0 
    END,
    consultant_unread_count = CASE 
      WHEN NEW.sender_id = conversations.student_id 
      THEN consultant_unread_count + 1 
      ELSE 0 
    END
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_on_message
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();

-- Update conversation when booking is created
CREATE OR REPLACE FUNCTION update_conversation_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET 
    has_booking = true,
    last_booking_id = NEW.id
  WHERE student_id = NEW.student_id 
  AND consultant_id = NEW.consultant_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_on_booking
AFTER INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION update_conversation_on_booking();

-- Comments for documentation
COMMENT ON TABLE public.conversations IS 'Tracks conversations between students and consultants';
COMMENT ON COLUMN public.conversations.has_booking IS 'True if student has ever booked this consultant - used for message priority';
COMMENT ON TABLE public.saved_consultants IS 'Students can save consultants to lists for easy access';
COMMENT ON TABLE public.consultant_views IS 'Tracks which consultants students view for recommendation engine';