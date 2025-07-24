-- Migration: Create messaging system with comprehensive mock data
-- Description: Creates conversations and messages tables with realistic data for Proofr platform

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

-- Create indexes for performance
CREATE INDEX idx_conversations_student_id ON conversations(student_id);
CREATE INDEX idx_conversations_consultant_id ON conversations(consultant_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);
CREATE INDEX idx_conversations_archived ON conversations(is_archived) WHERE NOT is_archived;
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Add unique constraint to prevent duplicate conversations
CREATE UNIQUE INDEX idx_conversations_unique_participants 
    ON conversations(student_id, consultant_id) 
    WHERE booking_id IS NULL;

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversations
CREATE POLICY "Users can view their conversations" ON conversations
    FOR SELECT USING (auth.uid() IN (student_id, consultant_id));

CREATE POLICY "Students can create conversations" ON conversations
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update their conversations" ON conversations
    FOR UPDATE USING (auth.uid() IN (student_id, consultant_id));

-- RLS policies for messages
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

-- Create trigger to update conversation updated_at
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET updated_at = NOW() 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

-- Populate conversations from existing bookings
INSERT INTO conversations (student_id, consultant_id, booking_id, created_at)
SELECT DISTINCT 
    b.student_id,
    b.consultant_id,
    b.id as booking_id,
    b.created_at + interval '5 minutes'
FROM bookings b
WHERE b.status IN ('pending', 'confirmed', 'in_progress', 'completed')
ON CONFLICT DO NOTHING;

-- Create additional conversations for active consultants without bookings (inquiries)
INSERT INTO conversations (student_id, consultant_id, created_at)
SELECT 
    s.id as student_id,
    c.id as consultant_id,
    NOW() - interval '1 day' * floor(random() * 30)
FROM (
    SELECT id FROM students ORDER BY RANDOM() LIMIT 20
) s
CROSS JOIN (
    SELECT id FROM consultants WHERE is_available = true ORDER BY RANDOM() LIMIT 5
) c
WHERE NOT EXISTS (
    SELECT 1 FROM conversations 
    WHERE student_id = s.id AND consultant_id = c.id
)
LIMIT 15;

-- First, populate missing student data for more realistic conversations
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
WHERE preferred_colleges IS NULL;

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
WHERE interests IS NULL;

-- Populate messages with realistic college admissions conversations
DO $$
DECLARE
    conv RECORD;
    msg_count INTEGER;
    msg_num INTEGER;
    sender_id UUID;
    message_content TEXT;
    msg_time TIMESTAMPTZ;
BEGIN
    FOR conv IN 
        SELECT c.*, b.service_id, b.status as booking_status, 
               s.name as student_name, s.preferred_colleges, s.interests,
               con.name as consultant_name, con.current_college
        FROM conversations c
        JOIN students s ON c.student_id = s.id
        JOIN consultants con ON c.consultant_id = con.id
        LEFT JOIN bookings b ON c.booking_id = b.id
    LOOP
        -- Determine number of messages based on booking status
        IF conv.booking_id IS NOT NULL THEN
            msg_count := CASE conv.booking_status
                WHEN 'completed' THEN 8 + floor(random() * 12)::int
                WHEN 'in_progress' THEN 5 + floor(random() * 8)::int
                WHEN 'confirmed' THEN 3 + floor(random() * 5)::int
                ELSE 2 + floor(random() * 3)::int
            END;
        ELSE
            msg_count := 2 + floor(random() * 4)::int; -- Inquiry conversations
        END IF;
        
        msg_time := conv.created_at;
        
        FOR msg_num IN 1..msg_count LOOP
            -- Alternate between student and consultant
            IF msg_num % 2 = 1 THEN
                sender_id := conv.student_id;
                
                -- Student messages
                message_content := CASE msg_num
                    WHEN 1 THEN
                        CASE 
                            WHEN conv.booking_id IS NOT NULL THEN
                                CASE floor(random() * 6)::int
                                    WHEN 0 THEN 'Hi ' || conv.consultant_name || '! I just submitted my order for essay review. I''m applying to ' || 
                                               CASE 
                                                   WHEN conv.preferred_colleges IS NOT NULL AND array_length(conv.preferred_colleges, 1) > 0 
                                                   THEN conv.preferred_colleges[1]
                                                   ELSE 'several top schools'
                                               END || ' and could really use your expertise!'
                                    WHEN 1 THEN 'Hello! Thanks for confirming my order. I''m working on my Common App essay about ' || 
                                               CASE 
                                                   WHEN conv.interests IS NOT NULL AND ('CS' = ANY(conv.interests) OR 'Technology' = ANY(conv.interests)) THEN 'my coding journey'
                                                   WHEN conv.interests IS NOT NULL AND 'Engineering' = ANY(conv.interests) THEN 'building my first robot'
                                                   WHEN conv.interests IS NOT NULL AND ('Business' = ANY(conv.interests) OR 'Economics' = ANY(conv.interests)) THEN 'starting my first business'
                                                   WHEN conv.interests IS NOT NULL AND ('Pre-med' = ANY(conv.interests) OR 'Healthcare' = ANY(conv.interests)) THEN 'my hospital volunteering experience'
                                                   WHEN conv.interests IS NOT NULL AND ('Arts' = ANY(conv.interests) OR 'Design' = ANY(conv.interests)) THEN 'my creative journey'
                                                   WHEN conv.interests IS NOT NULL AND ('Political Science' = ANY(conv.interests) OR 'Law' = ANY(conv.interests)) THEN 'my community advocacy work'
                                                   ELSE 'my personal growth story'
                                               END || '. Excited to get your feedback!'
                                    WHEN 2 THEN 'Hi there! I need help polishing my supplemental essays. The deadline is in 2 weeks - do you think we can make it work?'
                                    WHEN 3 THEN 'Hey ' || conv.consultant_name || '! Your profile mentioned you got into ' || conv.current_college || 
                                               ' - that''s my dream school! Can''t wait to work with you.'
                                    WHEN 4 THEN 'Hello! I''ve been struggling with the "Why Us" essay. I have some ideas but need help making them compelling.'
                                    ELSE 'Hi! Just placed my order. Quick question - should I send you all my essays at once or one at a time?'
                                END
                            ELSE
                                CASE floor(random() * 5)::int
                                    WHEN 0 THEN 'Hi ' || conv.consultant_name || '! I saw your profile and I''m really impressed. Are you available for essay reviews this month?'
                                    WHEN 1 THEN 'Hello! I''m applying to ' || conv.current_college || ' ED and noticed you''re a student there. Do you offer application strategy sessions?'
                                    WHEN 2 THEN 'Hey! Quick question - do you review coalition app essays too, or just Common App?'
                                    WHEN 3 THEN 'Hi there! What''s your typical turnaround time for essay reviews? I have some tight deadlines coming up.'
                                    ELSE 'Hello ' || conv.consultant_name || '! Do you have experience with international student applications?'
                                END
                        END
                    WHEN 3 THEN
                        CASE floor(random() * 8)::int
                            WHEN 0 THEN 'I''ve shared the Google Doc with you. The essay is about 650 words - let me know if you need anything else!'
                            WHEN 1 THEN 'Just uploaded my resume and activities list too. Thought it might help give you context.'
                            WHEN 2 THEN 'Quick update - I revised the introduction based on my English teacher''s feedback. Hope that''s okay!'
                            WHEN 3 THEN 'Is it better to focus on one meaningful experience or try to weave in multiple activities?'
                            WHEN 4 THEN 'I''m worried my essay might be too personal. How do I know if I''m oversharing?'
                            WHEN 5 THEN 'Should I mention my lower freshman year grades in the additional info section?'
                            WHEN 6 THEN 'I have two different essay ideas - would you mind if I sent both for you to help me choose?'
                            ELSE 'Thanks for the quick response! When do you think you''ll have time to review?'
                        END
                    WHEN 5 THEN
                        CASE floor(random() * 6)::int
                            WHEN 0 THEN 'Wow, your feedback is incredibly helpful! The point about showing rather than telling really clicked for me.'
                            WHEN 1 THEN 'I see what you mean about the conclusion. I''ll work on making it more forward-looking.'
                            WHEN 2 THEN 'Great catch on the redundancy in paragraph 2. I didn''t notice I was repeating myself!'
                            WHEN 3 THEN 'Your suggestion about the opening hook is perfect. It''s much more engaging now!'
                            WHEN 4 THEN 'I made all the changes you suggested. Could you do a quick final review when you have a chance?'
                            ELSE 'This is exactly the kind of feedback I needed. You really understand what admissions officers look for!'
                        END
                    WHEN 7 THEN
                        CASE floor(random() * 5)::int
                            WHEN 0 THEN 'One more question - for the "Why Major" essay, should I mention specific professors or research opportunities?'
                            WHEN 1 THEN 'I''m also working on my activities descriptions. Any tips for making them stand out in 150 characters?'
                            WHEN 2 THEN 'Do you think I should write about my cultural background, or is that too common?'
                            WHEN 3 THEN 'My counselor suggested adding more "intellectual vitality" - what does that even mean?'
                            ELSE 'For supplements, is it bad if I reuse some content from my main essay?'
                        END
                    ELSE
                        CASE floor(random() * 10)::int
                            WHEN 0 THEN 'Just submitted! Thank you so much for all your help!'
                            WHEN 1 THEN 'I feel so much more confident about my essays now. You''re amazing!'
                            WHEN 2 THEN 'Quick update - I got an interview invitation! Any chance you do interview prep too?'
                            WHEN 3 THEN 'Would you be willing to look at my scholarship essays too? Happy to book another session!'
                            WHEN 4 THEN 'My friend is also applying - can I refer them to you?'
                            WHEN 5 THEN 'The admissions officer actually complimented my essay in the interview! Thank you!'
                            WHEN 6 THEN 'Do you have any last-minute tips for the application submission?'
                            WHEN 7 THEN 'I''m working on my RD applications now. Available for another round?'
                            WHEN 8 THEN 'Your point about authenticity really resonated. I rewrote the whole thing!'
                            ELSE 'This has been so helpful. I''ll definitely leave a great review!'
                        END
                END;
            ELSE
                sender_id := conv.consultant_id;
                
                -- Consultant messages
                message_content := CASE msg_num
                    WHEN 2 THEN
                        CASE 
                            WHEN conv.booking_id IS NOT NULL THEN
                                CASE floor(random() * 6)::int
                                    WHEN 0 THEN 'Hi ' || conv.student_name || '! Thanks for choosing my services. I''m excited to help you with your application to ' || 
                                               CASE 
                                                   WHEN conv.preferred_colleges IS NOT NULL AND array_length(conv.preferred_colleges, 1) > 0 
                                                   THEN conv.preferred_colleges[1]
                                                   ELSE 'your target schools'
                                               END || 
                                               '. I''ll review your essay within the next 24 hours and provide detailed feedback.'
                                    WHEN 1 THEN 'Hello! Great to connect with you. I remember the stress of applications - I''m here to help make it easier. ' ||
                                               'Please share your essay via Google Docs (with comment access) and any specific concerns you have.'
                                    WHEN 2 THEN 'Hi there! Absolutely, we can work with that timeline. I typically provide feedback within 48 hours. ' ||
                                               'For the best results, please include the essay prompt and any relevant background info.'
                                    WHEN 3 THEN 'Thank you! Yes, ' || conv.current_college || ' is an amazing place. I''d be happy to share insights about what they look for. ' ||
                                               'Let''s start with your essays and we can discuss fit as we go.'
                                    WHEN 4 THEN 'Hello! "Why Us" essays are my specialty. The key is showing genuine connection beyond rankings. ' ||
                                               'Send over your draft and research notes, and I''ll help you craft something memorable.'
                                    ELSE 'Hi! Great question - I prefer to see all your essays to ensure consistency in voice and themes. ' ||
                                         'But we can prioritize based on your deadlines. What''s due first?'
                                END
                            ELSE
                                CASE floor(random() * 5)::int
                                    WHEN 0 THEN 'Hi ' || conv.student_name || '! Yes, I''m available and would love to help. ' ||
                                               'I offer comprehensive essay reviews with line-by-line feedback. Would you like to book a session?'
                                    WHEN 1 THEN 'Hello! Absolutely - I helped 3 students get into ' || conv.current_college || ' last year. ' ||
                                               'I offer both essay reviews and strategy sessions. What would be most helpful for you?'
                                    WHEN 2 THEN 'Hi there! Yes, I review all types of applications - Common App, Coalition, UC, and school-specific. ' ||
                                               'My approach adapts to each platform''s requirements.'
                                    WHEN 3 THEN 'Great question! My standard turnaround is 48-72 hours, but I offer rush service for tight deadlines. ' ||
                                               'When do you need the feedback by?'
                                    ELSE 'Hello! Yes, I''ve worked with many international students. I understand the unique challenges ' ||
                                         'and can help highlight your international perspective effectively.'
                                END
                        END
                    WHEN 4 THEN
                        CASE floor(random() * 8)::int
                            WHEN 0 THEN 'Perfect! I can see the document. I''ll start reviewing now and have comprehensive feedback to you by tomorrow evening.'
                            WHEN 1 THEN 'Got it! The resume definitely helps. I can already see some great experiences we can highlight in your essays.'
                            WHEN 2 THEN 'No problem at all! I''ll review the updated version. First impressions: the new intro is much stronger!'
                            WHEN 3 THEN 'Great question! For most essays, depth beats breadth. One meaningful experience, fully explored, usually resonates more.'
                            WHEN 4 THEN 'I understand your concern. The key is vulnerability with purpose - share personal details that illuminate your growth and values.'
                            WHEN 5 THEN 'Yes, if there''s a valid explanation (illness, family circumstances, etc.), the additional info section is perfect for context.'
                            WHEN 6 THEN 'Absolutely! I''d be happy to help you choose. Different ideas often work better for different schools.'
                            ELSE 'I''m actually reviewing it right now! You''ll have my feedback within the promised timeframe.'
                        END
                    WHEN 6 THEN
                        CASE floor(random() * 6)::int
                            WHEN 0 THEN 'I''m so glad it helped! Your revised draft is much stronger. Just a few minor suggestions on the conclusion...'
                            WHEN 1 THEN 'Excellent revision! The new conclusion ties everything together beautifully. One small grammar note in paragraph 3...'
                            WHEN 2 THEN 'Much better flow now! Your voice really shines through. Just watch the word count - you''re at 658.'
                            WHEN 3 THEN 'This is really coming together! The specific examples you added make all the difference.'
                            WHEN 4 THEN 'Of course! I''ll do a final polish review. You''ve made great progress - this is nearly ready to submit.'
                            ELSE 'Thank you! I love seeing essays transform like this. You''ve done the hard work - I just guided you.'
                        END
                    WHEN 8 THEN
                        CASE floor(random() * 5)::int
                            WHEN 0 THEN 'Yes! Mentioning specific professors shows you''ve done research. Just keep it natural, not forced.'
                            WHEN 1 THEN 'Use strong action verbs and quantify impact when possible. "Led 20 volunteers" beats "Leadership role."'
                            WHEN 2 THEN 'Cultural background can be powerful if you show how it shaped your perspective uniquely. Avoid clichés.'
                            WHEN 3 THEN 'Intellectual vitality = genuine curiosity and love of learning. Show how you pursue knowledge beyond grades.'
                            ELSE 'Some overlap is fine, but each essay should reveal different facets of who you are. Aim for 80% unique content.'
                        END
                    ELSE
                        CASE floor(random() * 10)::int
                            WHEN 0 THEN 'Congratulations on submitting! It was a pleasure working with you. Wishing you the best of luck!'
                            WHEN 1 THEN 'Thank you so much! Your hard work really paid off. Keep me posted on your results!'
                            WHEN 2 THEN 'That''s fantastic news! Yes, I do interview prep. Let''s get you ready to shine in person too!'
                            WHEN 3 THEN 'I''d be happy to help with scholarship essays! They require a slightly different approach. Let''s connect!'
                            WHEN 4 THEN 'Absolutely! I always appreciate referrals. Your friend can mention your name when booking.'
                            WHEN 5 THEN 'That''s amazing! So happy to hear the essay made an impression. You earned it!'
                            WHEN 6 THEN 'Triple-check all names/details, submit a day early if possible, and download confirmation PDFs!'
                            WHEN 7 THEN 'Of course! RD essays often benefit from ED experience. Let''s refine your approach!'
                            WHEN 8 THEN 'That''s the spirit! Authenticity always wins. Your genuine voice is your superpower.'
                            ELSE 'I really appreciate that! It''s been wonderful working with you. Best of luck with admissions!'
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
                    WHEN msg_num < msg_count - 2 THEN true
                    ELSE random() < 0.6
                END,
                msg_time
            );
            
            -- Increment time for next message
            msg_time := msg_time + (interval '30 minutes' * (1 + random() * 4));
        END LOOP;
        
        -- Update conversation with last message info
        UPDATE conversations c
        SET 
            last_message_at = (
                SELECT MAX(created_at) FROM messages WHERE conversation_id = conv.id
            ),
            last_message_preview = (
                SELECT content FROM messages 
                WHERE conversation_id = conv.id 
                ORDER BY created_at DESC 
                LIMIT 1
            ),
            student_unread_count = (
                SELECT COUNT(*) FROM messages 
                WHERE conversation_id = conv.id 
                AND sender_id = conv.consultant_id 
                AND NOT is_read
            ),
            consultant_unread_count = (
                SELECT COUNT(*) FROM messages 
                WHERE conversation_id = conv.id 
                AND sender_id = conv.student_id 
                AND NOT is_read
            )
        WHERE c.id = conv.id;
    END LOOP;
END $$;

-- Update consultant statistics based on actual data
UPDATE consultants c
SET 
    total_bookings = (
        SELECT COUNT(*) 
        FROM bookings b 
        WHERE b.consultant_id = c.id
    ),
    total_earnings = (
        SELECT COALESCE(SUM(final_price), 0) 
        FROM bookings b 
        WHERE b.consultant_id = c.id 
        AND b.status = 'completed'
    ),
    rating = CASE 
        WHEN EXISTS (SELECT 1 FROM bookings WHERE consultant_id = c.id AND rating IS NOT NULL)
        THEN (SELECT AVG(rating) FROM bookings WHERE consultant_id = c.id AND rating IS NOT NULL)
        ELSE 4.5 + random() * 0.5
    END,
    total_reviews = (
        SELECT COUNT(*) 
        FROM bookings b 
        WHERE b.consultant_id = c.id 
        AND b.rating IS NOT NULL
    );

-- Add some consultants to vacation mode for realism
UPDATE consultants 
SET vacation_mode = true, is_available = false
WHERE id IN (
    SELECT id FROM consultants 
    ORDER BY RANDOM() 
    LIMIT 2
);

-- Create function to calculate consultant response times
CREATE OR REPLACE FUNCTION calculate_consultant_response_time(consultant_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    avg_response_hours NUMERIC;
BEGIN
    SELECT AVG(EXTRACT(EPOCH FROM (first_response.created_at - conv.created_at)) / 3600)
    INTO avg_response_hours
    FROM conversations conv
    JOIN LATERAL (
        SELECT created_at
        FROM messages
        WHERE conversation_id = conv.id
        AND sender_id = conv.consultant_id
        ORDER BY created_at
        LIMIT 1
    ) first_response ON true
    WHERE conv.consultant_id = $1
    AND conv.created_at >= NOW() - INTERVAL '30 days';
    
    RETURN COALESCE(avg_response_hours, 24);
END;
$$ LANGUAGE plpgsql;

-- Add response_time column to consultants if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'consultants' 
                  AND column_name = 'average_response_time') THEN
        ALTER TABLE consultants ADD COLUMN average_response_time NUMERIC DEFAULT 24;
    END IF;
END $$;

-- Update consultant response times
UPDATE consultants c
SET average_response_time = calculate_consultant_response_time(c.id);

-- Create some sample attachments in messages (essay drafts, etc.)
UPDATE messages 
SET attachments = 
    CASE floor(random() * 4)::int
        WHEN 0 THEN '[{"name": "CommonApp_Essay_Draft_v2.docx", "size": 45320, "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}]'::jsonb
        WHEN 1 THEN '[{"name": "Resume_2024.pdf", "size": 89234, "type": "application/pdf"}]'::jsonb
        WHEN 2 THEN '[{"name": "Activities_List.xlsx", "size": 23421, "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}]'::jsonb
        ELSE '[]'::jsonb
    END
WHERE content LIKE '%shared%' OR content LIKE '%uploaded%' OR content LIKE '%attached%'
AND random() < 0.3;

-- Grant necessary permissions
GRANT ALL ON conversations TO authenticated;
GRANT ALL ON messages TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;