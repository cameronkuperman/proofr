-- =====================================================
-- DASHBOARD SETUP MIGRATION - FIXED VERSION
-- =====================================================
-- This migration properly handles existing schema and creates
-- all necessary tables for the consultant dashboard
-- =====================================================

BEGIN;

-- =====================================================
-- PART 1: CREATE MISSING TABLES ONLY
-- =====================================================

-- Create saved_consultants table if it doesn't exist
CREATE TABLE IF NOT EXISTS saved_consultants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    consultant_id UUID NOT NULL REFERENCES consultants(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, consultant_id)
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    consultant_id UUID NOT NULL REFERENCES consultants(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    
    -- Message counts and status
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_preview TEXT,
    student_unread_count INTEGER DEFAULT 0,
    consultant_unread_count INTEGER DEFAULT 0,
    
    -- Conversation state
    is_archived BOOLEAN DEFAULT FALSE,
    archived_by UUID REFERENCES users(id),
    archived_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message content
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    
    -- Read status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Edit history
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes only if they don't exist
DO $$
BEGIN
    -- Conversations indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_conversations_student_id') THEN
        CREATE INDEX idx_conversations_student_id ON conversations(student_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_conversations_consultant_id') THEN
        CREATE INDEX idx_conversations_consultant_id ON conversations(consultant_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_conversations_last_message_at') THEN
        CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_conversations_archived') THEN
        CREATE INDEX idx_conversations_archived ON conversations(is_archived) WHERE NOT is_archived;
    END IF;
    
    -- Messages indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_conversation_id') THEN
        CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_created_at') THEN
        CREATE INDEX idx_messages_created_at ON messages(created_at);
    END IF;
    
    -- Saved consultants indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_saved_consultants_student_id') THEN
        CREATE INDEX idx_saved_consultants_student_id ON saved_consultants(student_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_saved_consultants_consultant_id') THEN
        CREATE INDEX idx_saved_consultants_consultant_id ON saved_consultants(consultant_id);
    END IF;
END $$;

-- Add unique constraint to prevent duplicate conversations
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_conversations_unique_participants') THEN
        CREATE UNIQUE INDEX idx_conversations_unique_participants 
            ON conversations(student_id, consultant_id) 
            WHERE booking_id IS NULL;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_consultants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DO $$
BEGIN
    -- Conversations policies
    DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
    DROP POLICY IF EXISTS "Students can create conversations" ON conversations;
    DROP POLICY IF EXISTS "Users can update their conversations" ON conversations;
    
    -- Messages policies
    DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
    DROP POLICY IF EXISTS "Users can send messages in their conversations" ON messages;
    
    -- Saved consultants policies
    DROP POLICY IF EXISTS "Students can manage their saved consultants" ON saved_consultants;
    DROP POLICY IF EXISTS "Users can view saved consultant counts" ON saved_consultants;
END $$;

-- Create RLS policies
CREATE POLICY "Users can view their conversations" ON conversations
    FOR SELECT USING (auth.uid() IN (student_id, consultant_id));

CREATE POLICY "Students can create conversations" ON conversations
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update their conversations" ON conversations
    FOR UPDATE USING (auth.uid() IN (student_id, consultant_id));

CREATE POLICY "Users can view messages in their conversations" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations
            WHERE conversations.id = messages.conversation_id
            AND auth.uid() IN (conversations.student_id, conversations.consultant_id)
        )
    );

CREATE POLICY "Users can send messages in their conversations" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM conversations
            WHERE conversations.id = messages.conversation_id
            AND auth.uid() IN (conversations.student_id, conversations.consultant_id)
        )
    );

CREATE POLICY "Students can manage their saved consultants" ON saved_consultants
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Users can view saved consultant counts" ON saved_consultants
    FOR SELECT USING (auth.uid() IN (student_id, consultant_id));

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET updated_at = NOW() 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger to ensure it exists
DROP TRIGGER IF EXISTS update_conversation_on_message ON messages;
CREATE TRIGGER update_conversation_on_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

-- =====================================================
-- PART 2: FIX AND POPULATE STUDENT DATA
-- =====================================================

-- Update students with preferred colleges if missing
UPDATE students 
SET preferred_colleges = 
    CASE floor(random() * 10)::int
        WHEN 0 THEN ARRAY['Harvard', 'Yale', 'Princeton']
        WHEN 1 THEN ARRAY['Stanford', 'MIT', 'Berkeley']
        WHEN 2 THEN ARRAY['Columbia', 'NYU', 'Cornell']
        WHEN 3 THEN ARRAY['UCLA', 'USC', 'UCSD']
        WHEN 4 THEN ARRAY['Duke', 'UNC Chapel Hill', 'Wake Forest']
        WHEN 5 THEN ARRAY['Northwestern', 'UChicago', 'UIUC']
        WHEN 6 THEN ARRAY['Brown', 'RISD', 'Northeastern']
        WHEN 7 THEN ARRAY['Georgetown', 'GWU', 'American']
        WHEN 8 THEN ARRAY['UPenn', 'Drexel', 'Temple']
        ELSE ARRAY['Michigan', 'Michigan State', 'Wayne State']
    END
WHERE preferred_colleges IS NULL OR array_length(preferred_colleges, 1) = 0
   OR preferred_colleges IS NULL;

-- Update students with interests if missing
UPDATE students 
SET interests = 
    CASE floor(random() * 8)::int
        WHEN 0 THEN ARRAY['CS', 'STEM', 'Technology']
        WHEN 1 THEN ARRAY['Business', 'Economics', 'Finance']
        WHEN 2 THEN ARRAY['Pre-med', 'Biology', 'Healthcare']
        WHEN 3 THEN ARRAY['Engineering', 'STEM', 'Robotics']
        WHEN 4 THEN ARRAY['Arts', 'Design', 'Creative Writing']
        WHEN 5 THEN ARRAY['Political Science', 'Law', 'Government']
        WHEN 6 THEN ARRAY['Psychology', 'Sociology', 'Education']
        ELSE ARRAY['Environmental Science', 'Sustainability', 'Climate']
    END
WHERE interests IS NULL OR array_length(interests, 1) = 0
   OR interests IS NULL;

-- Update student schools if missing
UPDATE students
SET current_school = 
    CASE floor(random() * 10)::int
        WHEN 0 THEN 'Phillips Exeter Academy'
        WHEN 1 THEN 'Thomas Jefferson High School'
        WHEN 2 THEN 'Stuyvesant High School'
        WHEN 3 THEN 'Bronx Science'
        WHEN 4 THEN 'Phillips Academy Andover'
        WHEN 5 THEN 'Lakeside School'
        WHEN 6 THEN 'Harvard-Westlake School'
        WHEN 7 THEN 'The Harker School'
        WHEN 8 THEN 'Montgomery Blair High School'
        ELSE 'Local High School'
    END
WHERE current_school IS NULL OR current_school = '';

-- Update student names if missing
UPDATE students
SET name = 'Student ' || LEFT(id::text, 8)
WHERE name IS NULL OR name = '';

-- =====================================================
-- PART 3: CREATE REALISTIC BOOKINGS WITH CORRECT SCHEMA
-- =====================================================

-- Create bookings using the correct services table structure
WITH consultant_services AS (
    SELECT 
        c.id as consultant_id,
        s.id as service_id,
        c.name as consultant_name,
        s.title as service_title,
        s.prices[1] as base_price, -- Get first price from array
        s.service_type,
        row_number() OVER (PARTITION BY c.id ORDER BY s.prices[1] DESC) as service_rank
    FROM consultants c
    JOIN services s ON s.consultant_id = c.id
    WHERE c.is_available = true
      AND s.is_active = true
      AND array_length(s.prices, 1) > 0
)
INSERT INTO bookings (
    student_id,
    consultant_id,
    service_id,
    status,
    base_price,
    final_price,
    scheduled_at,
    prompt_text,
    requirements_text,
    created_at,
    completed_at,
    is_group_session,
    price_tier
)
SELECT 
    students.id,
    cs.consultant_id,
    cs.service_id,
    booking_status.status,
    cs.base_price,
    cs.base_price * (1 + (CASE WHEN random() < 0.2 THEN 0.5 ELSE 0 END)), -- 20% rush orders
    CASE 
        WHEN booking_status.status = 'completed' THEN NOW() - INTERVAL '1 day' * (floor(random() * 30)::int + 1)
        WHEN booking_status.status = 'in_progress' THEN NOW() - INTERVAL '1 hour' * floor(random() * 48)::int
        WHEN booking_status.status = 'confirmed' THEN NOW() + INTERVAL '1 day' * floor(random() * 7)::int
        ELSE NOW() + INTERVAL '1 day' * (floor(random() * 14)::int + 7)
    END,
    CASE floor(random() * 5)::int
        WHEN 0 THEN 'Help with Common App essay - need to stand out for ' || COALESCE(students.preferred_colleges[1], 'top schools')
        WHEN 1 THEN 'Review my supplemental essays for ' || COALESCE(students.preferred_colleges[1], 'top schools')
        WHEN 2 THEN 'Interview prep for ' || cs.consultant_name || '''s alma mater'
        WHEN 3 THEN 'Need strategy for balancing reach/match/safety schools'
        ELSE 'Essay review focusing on ' || COALESCE(students.interests[1], 'my strengths')
    END,
    CASE floor(random() * 4)::int
        WHEN 0 THEN 'Deadline in 2 weeks. Focus on clarity and impact.'
        WHEN 1 THEN 'Need help showing "spike" in ' || COALESCE(students.interests[1], 'STEM')
        WHEN 2 THEN '650 words max. Currently at 800.'
        ELSE 'First generation student, need help navigating process'
    END,
    NOW() - INTERVAL '1 day' * floor(random() * 60)::int,
    CASE 
        WHEN booking_status.status = 'completed' THEN NOW() - INTERVAL '1 day' * (floor(random() * 30)::int + 1) + INTERVAL '1 hour'
        ELSE NULL
    END,
    false,
    'standard'
FROM 
    (SELECT id, preferred_colleges, interests FROM students WHERE id IS NOT NULL ORDER BY random() LIMIT 30) students,
    consultant_services cs,
    (VALUES 
        ('completed'::booking_status), 
        ('completed'::booking_status),
        ('completed'::booking_status),
        ('in_progress'::booking_status),
        ('confirmed'::booking_status),
        ('pending'::booking_status)
    ) booking_status(status)
WHERE cs.service_rank <= 2
  AND cs.base_price IS NOT NULL
ORDER BY random()
LIMIT 120
ON CONFLICT (id) DO NOTHING;

-- completed_at is now set during INSERT for completed bookings

-- Add ratings to completed bookings
UPDATE bookings
SET 
    rating = CASE 
        WHEN random() < 0.7 THEN 5
        WHEN random() < 0.9 THEN 4
        ELSE 3
    END,
    review_text = CASE floor(random() * 10)::int
        WHEN 0 THEN 'Amazing experience! Got into my dream school!'
        WHEN 1 THEN 'Very helpful feedback. My essay is so much stronger now.'
        WHEN 2 THEN 'Great insights into what admissions officers look for.'
        WHEN 3 THEN 'The mock interview really boosted my confidence.'
        WHEN 4 THEN 'Worth every penny. Highly recommend!'
        WHEN 5 THEN 'Excellent strategic advice for building my college list.'
        WHEN 6 THEN 'Helped me find my authentic voice in my essays.'
        WHEN 7 THEN 'Quick turnaround and thorough feedback.'
        WHEN 8 THEN 'Really understands the admissions process.'
        ELSE 'Professional and knowledgeable. Great experience.'
    END,
    reviewed_at = completed_at + INTERVAL '1 day' * floor(random() * 3)::int
WHERE status = 'completed' 
    AND rating IS NULL
    AND random() < 0.8; -- 80% of completed bookings have ratings

-- =====================================================
-- PART 4: CREATE SAVED CONSULTANTS
-- =====================================================

INSERT INTO saved_consultants (student_id, consultant_id, saved_at)
SELECT DISTINCT
    s.id as student_id,
    c.id as consultant_id,
    NOW() - INTERVAL '1 day' * floor(random() * 30)::int
FROM 
    (SELECT id FROM students ORDER BY random() LIMIT 40) s
    CROSS JOIN
    (SELECT id FROM consultants WHERE is_available = true ORDER BY random() LIMIT 5) c
WHERE random() < 0.3
ON CONFLICT (student_id, consultant_id) DO NOTHING;

-- =====================================================
-- PART 5: CREATE CONVERSATIONS FROM BOOKINGS
-- =====================================================

-- Create conversations for all non-cancelled bookings
INSERT INTO conversations (student_id, consultant_id, booking_id, created_at)
SELECT DISTINCT 
    b.student_id,
    b.consultant_id,
    b.id as booking_id,
    b.created_at + INTERVAL '5 minutes'
FROM bookings b
WHERE b.status != 'cancelled'
  AND b.student_id IS NOT NULL
  AND b.consultant_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create additional inquiry conversations (no booking yet)
INSERT INTO conversations (student_id, consultant_id, created_at)
SELECT 
    s.id as student_id,
    c.id as consultant_id,
    NOW() - INTERVAL '1 day' * floor(random() * 30)::int
FROM 
    (SELECT id FROM students ORDER BY RANDOM() LIMIT 25) s
    CROSS JOIN 
    (SELECT id FROM consultants WHERE is_available = true ORDER BY RANDOM() LIMIT 3) c
WHERE NOT EXISTS (
    SELECT 1 FROM conversations 
    WHERE student_id = s.id AND consultant_id = c.id
)
AND random() < 0.4
ON CONFLICT DO NOTHING;

-- =====================================================
-- PART 6: POPULATE MESSAGES
-- =====================================================

DO $$
DECLARE
    conv RECORD;
    msg_count INTEGER;
    msg_num INTEGER;
    sender_id UUID;
    message_content TEXT;
    msg_time TIMESTAMPTZ;
    student_name TEXT;
    consultant_name TEXT;
BEGIN
    FOR conv IN 
        SELECT 
            c.id, 
            c.student_id,
            c.consultant_id,
            c.booking_id,
            c.created_at,
            b.service_id, 
            b.status as booking_status,
            s.name as student_name, 
            s.preferred_colleges, 
            s.interests, 
            s.current_school,
            con.name as consultant_name, 
            con.current_college
        FROM conversations c
        JOIN students s ON c.student_id = s.id
        JOIN consultants con ON c.consultant_id = con.id
        LEFT JOIN bookings b ON c.booking_id = b.id
        WHERE NOT EXISTS (
            SELECT 1 FROM messages WHERE conversation_id = c.id
        )
        LIMIT 150 -- Process first 150 conversations
    LOOP
        -- Set names with fallbacks
        student_name := COALESCE(conv.student_name, 'Student');
        consultant_name := COALESCE(conv.consultant_name, 'Consultant');
        
        -- Determine number of messages based on booking status
        IF conv.booking_id IS NOT NULL THEN
            msg_count := CASE conv.booking_status
                WHEN 'completed' THEN 8 + floor(random() * 7)::int
                WHEN 'in_progress' THEN 5 + floor(random() * 5)::int
                WHEN 'confirmed' THEN 3 + floor(random() * 3)::int
                ELSE 2 + floor(random() * 2)::int
            END;
        ELSE
            msg_count := 2 + floor(random() * 3)::int; -- Inquiry conversations
        END IF;
        
        msg_time := conv.created_at;
        
        FOR msg_num IN 1..msg_count LOOP
            -- Alternate between student and consultant
            IF msg_num % 2 = 1 THEN
                sender_id := conv.student_id;
                
                -- Generate realistic student messages
                message_content := CASE msg_num
                    WHEN 1 THEN
                        CASE 
                            WHEN conv.booking_id IS NOT NULL THEN
                                CASE floor(random() * 8)::int
                                    WHEN 0 THEN 'Hi ' || consultant_name || '! I just booked a session with you. I''m applying to ' || 
                                               COALESCE(conv.preferred_colleges[1], 'several competitive schools') || ' and could really use your help!'
                                    WHEN 1 THEN 'Hello! I''m a student at ' || COALESCE(conv.current_school, 'my high school') || ' working on my college apps. Looking forward to our session!'
                                    WHEN 2 THEN 'Hi there! I need help with my essays. The deadlines are coming up fast!'
                                    WHEN 3 THEN 'Hey ' || consultant_name || '! I saw you went to ' || COALESCE(conv.current_college, 'a great school') || 
                                               '. That''s one of my top choices!'
                                    WHEN 4 THEN 'Hello! I''m struggling with the "Why Us" essays. Hope you can help!'
                                    WHEN 5 THEN 'Hi! I''m interested in ' || COALESCE(conv.interests[1], 'STEM') || 
                                               ' and need help showcasing that in my application.'
                                    WHEN 6 THEN 'Hello! First-gen student here. The whole process feels overwhelming.'
                                    ELSE 'Hi! Just placed my order. Should I send my essays now or wait for our session?'
                                END
                            ELSE
                                CASE floor(random() * 5)::int
                                    WHEN 0 THEN 'Hi ' || consultant_name || '! I saw your profile and I''m impressed by your experience. Do you have any slots available this week?'
                                    WHEN 1 THEN 'Hello! I''m applying to ' || COALESCE(conv.current_college, 'top schools') || ' ED. Do you offer strategy sessions?'
                                    WHEN 2 THEN 'Hey! What''s your typical turnaround time for essay reviews?'
                                    WHEN 3 THEN 'Hi! Do you help with both Common App and supplemental essays?'
                                    ELSE 'Hello! Can you help with ' || COALESCE(conv.interests[1], 'STEM') || ' focused applications?'
                                END
                        END
                    WHEN 3 THEN
                        CASE floor(random() * 8)::int
                            WHEN 0 THEN 'I''ve shared my essay draft via Google Docs. Let me know if you need anything else!'
                            WHEN 1 THEN 'Just sent over my activities list and resume for context.'
                            WHEN 2 THEN 'Quick question - should I mention my SAT scores in the essay?'
                            WHEN 3 THEN 'Is 650 words too long? I''m having trouble cutting it down.'
                            WHEN 4 THEN 'I have two different angles - could you help me choose?'
                            WHEN 5 THEN 'Thanks for the quick response! When can we schedule a call?'
                            WHEN 6 THEN 'I revised based on my teacher''s feedback. Is that okay?'
                            ELSE 'How honest should I be about my struggles in freshman year?'
                        END
                    WHEN 5 THEN
                        CASE floor(random() * 6)::int
                            WHEN 0 THEN 'This feedback is incredible! The structure makes so much more sense now.'
                            WHEN 1 THEN 'I see what you mean about showing vs telling. Working on revisions now.'
                            WHEN 2 THEN 'Your point about specificity really clicked. Adding more details!'
                            WHEN 3 THEN 'The new opening is much stronger. Thank you!'
                            WHEN 4 THEN 'Made all the changes. Could you take another look?'
                            ELSE 'This is exactly what I needed. You really get it!'
                        END
                    ELSE
                        CASE floor(random() * 8)::int
                            WHEN 0 THEN 'One more question about the supplementals...'
                            WHEN 1 THEN 'Do you think I should write about my research experience?'
                            WHEN 2 THEN 'How do I make my activities sound impressive?'
                            WHEN 3 THEN 'Should I explain my B+ in calculus?'
                            WHEN 4 THEN 'Thank you so much! This has been incredibly helpful!'
                            WHEN 5 THEN 'I feel so much more confident now. You''re amazing!'
                            WHEN 6 THEN 'Would you be available for interview prep too?'
                            ELSE 'Just submitted! Fingers crossed!'
                        END
                END;
            ELSE
                sender_id := conv.consultant_id;
                
                -- Generate realistic consultant messages
                message_content := CASE msg_num
                    WHEN 2 THEN
                        CASE 
                            WHEN conv.booking_id IS NOT NULL THEN
                                CASE floor(random() * 6)::int
                                    WHEN 0 THEN 'Hi ' || student_name || '! Great to connect with you. I''m excited to help with your application to ' || 
                                               COALESCE(conv.preferred_colleges[1], 'your target schools') || 
                                               '. I''ll review everything and provide detailed feedback within 48 hours.'
                                    WHEN 1 THEN 'Hello! Thanks for booking a session. I remember the application stress well - let''s work together to make your essays shine. Please share your drafts when ready.'
                                    WHEN 2 THEN 'Hi there! I''d be happy to help with your essays. ' || COALESCE(conv.current_college, 'Top schools') || 
                                               ' are looking for authentic voices. Let''s make sure yours comes through!'
                                    WHEN 3 THEN 'Welcome! I see you''re interested in ' || COALESCE(conv.interests[1], 'your field') || 
                                               '. I can help you craft essays that highlight your passion and experience.'
                                    WHEN 4 THEN 'Hello! "Why Us" essays are my specialty. The key is specific details that show genuine interest. Send over what you have!'
                                    ELSE 'Hi! Yes, please send your essays whenever you''re ready. Include the prompts too!'
                                END
                            ELSE
                                CASE floor(random() * 5)::int
                                    WHEN 0 THEN 'Hi ' || student_name || '! Yes, I have availability this week. Would Thursday at 4pm EST work for you?'
                                    WHEN 1 THEN 'Hello! Absolutely, I specialize in helping students with ' || COALESCE(conv.current_college, 'top school') || 
                                               ' applications. I''d love to share what worked for me and recent clients.'
                                    WHEN 2 THEN 'Hi! My standard turnaround is 48-72 hours, but I offer rush service if needed. What''s your timeline?'
                                    WHEN 3 THEN 'Yes! I review all types of essays. My approach ensures consistency across your entire application.'
                                    ELSE 'Definitely! I''ve helped many students interested in ' || COALESCE(conv.interests[1], 'that field') || 
                                         '. Let''s discuss your specific goals.'
                                END
                        END
                    WHEN 4 THEN
                        CASE floor(random() * 6)::int
                            WHEN 0 THEN 'Perfect! I can see the document. Starting my review now - you''ll have feedback by tomorrow evening.'
                            WHEN 1 THEN 'Great context! Your activities are impressive. Let''s make sure your essay complements them well.'
                            WHEN 2 THEN 'Good question! Save test scores for the designated section unless they''re central to your story.'
                            WHEN 3 THEN '650 is the max for Common App. Let''s work on tightening your narrative. I''ll show you where to cut.'
                            WHEN 4 THEN 'I''d be happy to review both angles! Different approaches often work for different schools.'
                            ELSE 'Let''s schedule a 30-minute call for Thursday. I''ll send a calendar invite.'
                        END
                    WHEN 6 THEN
                        CASE floor(random() * 5)::int
                            WHEN 0 THEN 'I''m glad it''s clicking! Your revisions are much stronger. Just a few more suggestions...'
                            WHEN 1 THEN 'Excellent progress! The specific examples really bring your story to life now.'
                            WHEN 2 THEN 'Much better! Your personality shines through. One note on the conclusion...'
                            WHEN 3 THEN 'This is really coming together! You''ve found your authentic voice.'
                            ELSE 'Of course! I''ll do a final review. You''re almost there!'
                        END
                    ELSE
                        CASE floor(random() * 8)::int
                            WHEN 0 THEN 'For supplementals, remember each should reveal something new about you.'
                            WHEN 1 THEN 'Yes! Research shows intellectual curiosity. Frame it in terms of future goals.'
                            WHEN 2 THEN 'Use active verbs and quantify impact: "Led 20 volunteers" vs "Leadership position"'
                            WHEN 3 THEN 'Only explain if there''s a compelling reason (illness, family situation). Keep it brief and positive.'
                            WHEN 4 THEN 'You''re very welcome! It''s been a pleasure working with you. Best of luck!'
                            WHEN 5 THEN 'Thank you! Remember to submit a day early and download confirmations.'
                            WHEN 6 THEN 'Absolutely! Interview prep is crucial. Let''s book another session.'
                            ELSE 'Wonderful! Keep me posted on your results. Rooting for you!'
                        END
                END;
            END IF;
            
            -- Insert message
            INSERT INTO messages (conversation_id, sender_id, content, is_read, created_at)
            VALUES (
                conv.id,
                sender_id,
                message_content,
                CASE 
                    WHEN msg_num < msg_count - 1 THEN true
                    ELSE random() < 0.7
                END,
                msg_time
            )
            ON CONFLICT DO NOTHING;
            
            -- Increment time for next message
            msg_time := msg_time + (interval '30 minutes' * (1 + random() * 3));
        END LOOP;
    END LOOP;
END $$;

-- =====================================================
-- PART 7: UPDATE CONVERSATION METADATA
-- =====================================================

-- Update conversation last_message info
UPDATE conversations c
SET 
    last_message_at = COALESCE(
        (SELECT MAX(created_at) FROM messages WHERE conversation_id = c.id),
        c.created_at
    ),
    last_message_preview = COALESCE(
        (SELECT content FROM messages 
         WHERE conversation_id = c.id 
         ORDER BY created_at DESC 
         LIMIT 1),
        'No messages yet'
    ),
    student_unread_count = COALESCE(
        (SELECT COUNT(*) FROM messages 
         WHERE conversation_id = c.id 
         AND sender_id = c.consultant_id 
         AND NOT is_read),
        0
    ),
    consultant_unread_count = COALESCE(
        (SELECT COUNT(*) FROM messages 
         WHERE conversation_id = c.id 
         AND sender_id = c.student_id 
         AND NOT is_read),
        0
    );

-- =====================================================
-- PART 8: UPDATE CONSULTANT STATISTICS
-- =====================================================

-- Add response_time_hours column if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'consultants' 
                  AND column_name = 'average_response_time') THEN
        ALTER TABLE consultants ADD COLUMN average_response_time NUMERIC DEFAULT 24;
    END IF;
END $$;

-- Update consultant stats based on real data
UPDATE consultants c
SET 
    total_bookings = COALESCE(
        (SELECT COUNT(*) FROM bookings b WHERE b.consultant_id = c.id),
        0
    ),
    total_earnings = COALESCE(
        (SELECT SUM(final_price * 0.8) -- 80% after platform fee
         FROM bookings b 
         WHERE b.consultant_id = c.id 
         AND b.status = 'completed'),
        0
    ),
    rating = COALESCE(
        (SELECT AVG(rating) 
         FROM bookings 
         WHERE consultant_id = c.id 
         AND rating IS NOT NULL),
        4.5 + random() * 0.5
    ),
    total_reviews = COALESCE(
        (SELECT COUNT(*) 
         FROM bookings b 
         WHERE b.consultant_id = c.id 
         AND b.rating IS NOT NULL),
        0
    );

-- Calculate average response times
WITH response_times AS (
    SELECT 
        c.consultant_id,
        AVG(
            GREATEST(
                EXTRACT(EPOCH FROM (
                    COALESCE(
                        (SELECT MIN(created_at) 
                         FROM messages 
                         WHERE conversation_id = c.id 
                         AND sender_id = c.consultant_id),
                        c.created_at + INTERVAL '1 hour'
                    ) - c.created_at
                )) / 3600,
                0.5
            )
        ) as avg_hours
    FROM conversations c
    GROUP BY c.consultant_id
)
UPDATE consultants c
SET average_response_time = LEAST(COALESCE(rt.avg_hours, 24), 48)
FROM response_times rt
WHERE c.id = rt.consultant_id;

-- Update response_time_hours to match average_response_time
UPDATE consultants
SET response_time_hours = COALESCE(average_response_time, 24)
WHERE response_time_hours IS NULL OR response_time_hours = 0;

-- Set some consultants to vacation mode for realism
UPDATE consultants 
SET vacation_mode = true, is_available = false
WHERE id IN (
    SELECT id FROM consultants 
    WHERE total_bookings > 20
    ORDER BY RANDOM() 
    LIMIT 2
);

-- =====================================================
-- PART 9: ADD MESSAGE ATTACHMENTS
-- =====================================================

-- Add realistic attachments to some messages
UPDATE messages 
SET attachments = 
    CASE floor(random() * 5)::int
        WHEN 0 THEN '[{"name": "CommonApp_Essay_Draft.docx", "size": 45320, "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}]'::jsonb
        WHEN 1 THEN '[{"name": "Activities_List.pdf", "size": 78234, "type": "application/pdf"}]'::jsonb
        WHEN 2 THEN '[{"name": "Resume_2024.pdf", "size": 89234, "type": "application/pdf"}]'::jsonb
        WHEN 3 THEN '[{"name": "Supplemental_Essays.docx", "size": 56789, "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}]'::jsonb
        ELSE '[{"name": "Transcript_Unofficial.pdf", "size": 123456, "type": "application/pdf"}]'::jsonb
    END
WHERE (content LIKE '%shared%' OR content LIKE '%sent%' OR content LIKE '%attached%' OR content LIKE '%Google Docs%')
  AND attachments = '[]'::jsonb
  AND random() < 0.4;

-- =====================================================
-- PART 10: UPDATE USER INTERACTIONS
-- =====================================================

-- Create viewed interactions
INSERT INTO user_interactions (
    student_id,
    consultant_id,
    interaction_type,
    created_at
)
SELECT 
    s.id,
    c.id,
    'viewed'::interaction_type,
    NOW() - INTERVAL '1 day' * floor(random() * 30)::int
FROM students s
CROSS JOIN consultants c
WHERE random() < 0.1
LIMIT 200
ON CONFLICT DO NOTHING;

-- Create booked interactions from actual bookings
INSERT INTO user_interactions (
    student_id,
    consultant_id,
    interaction_type,
    created_at
)
SELECT DISTINCT
    b.student_id,
    b.consultant_id,
    'booked'::interaction_type,
    b.created_at
FROM bookings b
WHERE b.status != 'cancelled'
ON CONFLICT DO NOTHING;

-- Create completed interactions from completed bookings
INSERT INTO user_interactions (
    student_id,
    consultant_id,
    interaction_type,
    created_at
)
SELECT 
    b.student_id,
    b.consultant_id,
    'completed'::interaction_type,
    b.completed_at
FROM bookings b
WHERE b.status = 'completed'
  AND b.completed_at IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create rated interactions from rated bookings
INSERT INTO user_interactions (
    student_id,
    consultant_id,
    interaction_type,
    rating,
    created_at
)
SELECT 
    b.student_id,
    b.consultant_id,
    'rated'::interaction_type,
    b.rating,
    b.reviewed_at
FROM bookings b
WHERE b.rating IS NOT NULL
  AND b.reviewed_at IS NOT NULL
ON CONFLICT DO NOTHING;

-- =====================================================
-- PART 11: GRANT PERMISSIONS
-- =====================================================

GRANT ALL ON conversations TO authenticated;
GRANT ALL ON messages TO authenticated;
GRANT ALL ON saved_consultants TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check consultant dashboard stats
SELECT 
    c.name,
    c.current_college,
    c.total_bookings,
    c.total_earnings,
    c.rating,
    c.response_time_hours,
    COUNT(DISTINCT conv.id) as total_conversations,
    COALESCE(SUM(conv.consultant_unread_count), 0) as unread_messages
FROM consultants c
LEFT JOIN conversations conv ON conv.consultant_id = c.id
WHERE c.is_available = true
GROUP BY c.id
ORDER BY c.total_earnings DESC
LIMIT 10;

-- Check message activity
SELECT 
    DATE(created_at) as date,
    COUNT(*) as messages_sent,
    COUNT(DISTINCT conversation_id) as active_conversations
FROM messages
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Check bookings distribution
SELECT 
    status,
    COUNT(*) as count,
    AVG(final_price) as avg_price
FROM bookings
GROUP BY status
ORDER BY count DESC;