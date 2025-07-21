-- Create saved_consultants table for students to save/bookmark consultants
CREATE TABLE IF NOT EXISTS saved_consultants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  consultant_id UUID NOT NULL REFERENCES consultants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a student can only save a consultant once
  UNIQUE(student_id, consultant_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_consultants_student_id ON saved_consultants(student_id);
CREATE INDEX IF NOT EXISTS idx_saved_consultants_consultant_id ON saved_consultants(consultant_id);

-- Enable RLS
ALTER TABLE saved_consultants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Students can view their own saved consultants
CREATE POLICY "Students can view own saved consultants" ON saved_consultants
  FOR SELECT
  USING (auth.uid() = student_id);

-- Students can save consultants
CREATE POLICY "Students can save consultants" ON saved_consultants
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Students can remove saved consultants
CREATE POLICY "Students can remove own saved consultants" ON saved_consultants
  FOR DELETE
  USING (auth.uid() = student_id);

-- Create conversations table if it doesn't exist (for messages)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  consultant_id UUID NOT NULL REFERENCES consultants(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  student_unread_count INTEGER DEFAULT 0,
  consultant_unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure only one conversation per student-consultant pair
  UNIQUE(student_id, consultant_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_conversations_student_id ON conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_consultant_id ON conversations(consultant_id);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT
  USING (auth.uid() = student_id OR auth.uid() = consultant_id);

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT
  WITH CHECK (auth.uid() = student_id OR auth.uid() = consultant_id);

CREATE POLICY "Users can update their own conversations" ON conversations
  FOR UPDATE
  USING (auth.uid() = student_id OR auth.uid() = consultant_id);