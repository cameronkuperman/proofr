-- Migration 007: Messaging RLS Policies
-- Description: RLS policies for conversations, messages, and favorites
-- Author: Proofr Team
-- Date: 2025-01-03

-- Enable RLS on new tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultant_views ENABLE ROW LEVEL SECURITY;

-- ======================
-- CONVERSATIONS POLICIES
-- ======================

-- Students can view their own conversations
CREATE POLICY "Students can view own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = student_id);

-- Consultants can view their conversations
CREATE POLICY "Consultants can view own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = consultant_id);

-- Students can start conversations
CREATE POLICY "Students can start conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    auth.uid() = student_id 
    AND auth.uid() = started_by
  );

-- Both parties can update conversation (for archiving, marking read)
CREATE POLICY "Users can update own conversations" ON public.conversations
  FOR UPDATE USING (
    auth.uid() = student_id OR auth.uid() = consultant_id
  );

-- ======================
-- MESSAGES POLICIES
-- ======================

-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in own conversations" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.student_id = auth.uid() OR conversations.consultant_id = auth.uid())
    )
  );

-- Users can send messages in their conversations
CREATE POLICY "Users can send messages in own conversations" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = conversation_id
      AND (conversations.student_id = auth.uid() OR conversations.consultant_id = auth.uid())
    )
  );

-- Users can update their own messages (for edits)
CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- ======================
-- SAVED CONSULTANTS POLICIES
-- ======================

-- Students can view their saved consultants
CREATE POLICY "Students can view own saved consultants" ON public.saved_consultants
  FOR SELECT USING (auth.uid() = student_id);

-- Students can save consultants
CREATE POLICY "Students can save consultants" ON public.saved_consultants
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can remove saved consultants
CREATE POLICY "Students can remove saved consultants" ON public.saved_consultants
  FOR DELETE USING (auth.uid() = student_id);

-- Students can update their saved consultants (notes, lists)
CREATE POLICY "Students can update saved consultants" ON public.saved_consultants
  FOR UPDATE USING (auth.uid() = student_id);

-- ======================
-- CONSULTANT VIEWS POLICIES
-- ======================

-- Anyone can record views (including anonymous)
CREATE POLICY "Anyone can record consultant views" ON public.consultant_views
  FOR INSERT WITH CHECK (true);

-- Service role can read views for analytics
CREATE POLICY "Service role can read all views" ON public.consultant_views
  FOR SELECT USING (auth.role() = 'service_role');

-- ======================
-- SERVICE ROLE ACCESS
-- ======================

-- Service role full access to all messaging tables
CREATE POLICY "Service role full access to conversations" ON public.conversations
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to messages" ON public.messages
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to saved consultants" ON public.saved_consultants
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to consultant views" ON public.consultant_views
  FOR ALL USING (auth.role() = 'service_role');