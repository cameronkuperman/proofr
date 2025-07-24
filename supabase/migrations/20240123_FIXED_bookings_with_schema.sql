-- =====================================================
-- FIXED BOOKINGS MIGRATION WITH SCHEMA UPDATES
-- All column names verified against actual schema
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: CREATE SAVED_CONSULTANTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS saved_consultants (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    consultant_id UUID NOT NULL REFERENCES consultants(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, consultant_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_consultants_student_id ON saved_consultants(student_id);
CREATE INDEX IF NOT EXISTS idx_saved_consultants_consultant_id ON saved_consultants(consultant_id);
CREATE INDEX IF NOT EXISTS idx_saved_consultants_saved_at ON saved_consultants(saved_at DESC);

-- Enable RLS
ALTER TABLE saved_consultants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Students can view their own saved consultants" ON saved_consultants
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can save consultants" ON saved_consultants
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can unsave consultants" ON saved_consultants
    FOR DELETE USING (auth.uid() = student_id);

-- =====================================================
-- STEP 2: POPULATE BOOKINGS DATA
-- =====================================================

DO $$ 
DECLARE
    student1 uuid;
    student2 uuid;
    student3 uuid;
    student4 uuid;
    student5 uuid;
BEGIN
    -- Get actual student IDs
    SELECT id INTO student1 FROM students WHERE id = '338feabe-39f2-492a-93e4-ee746bf727b7'; -- ibm@gmail.com
    SELECT id INTO student2 FROM students WHERE id = 'e4bf552b-5275-40f9-a598-3793d8a1f4e9'; -- icecam000001@gmail.com
    
    -- Get more students dynamically
    SELECT id INTO student3 FROM students WHERE id != ALL(ARRAY[student1, student2]) ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO student4 FROM students WHERE id != ALL(ARRAY[student1, student2, student3]) ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO student5 FROM students WHERE id != ALL(ARRAY[student1, student2, student3, student4]) ORDER BY created_at DESC LIMIT 1;

    -- =====================================================
    -- ACTIVE BOOKINGS
    -- =====================================================
    
    -- Tomorrow: Essay Review
    IF student1 IS NOT NULL THEN
        INSERT INTO bookings (
            student_id, consultant_id, service_id, scheduled_at, status,
            base_price, final_price, prompt_text, requirements_text, 
            meeting_link, is_group_session
        )
        SELECT 
            student1,
            '639b801b-e0cd-4231-9139-0eda9cb7e39a'::uuid,
            '8eaf2101-be9f-43f9-be26-01e563ea1cf2'::uuid,
            NOW() + INTERVAL '1 day' + TIME '14:00:00',
            'confirmed'::booking_status,
            80.00, 80.00,
            'Review my Common App essay about robotics leadership',
            'Focus on narrative arc and showing leadership growth',
            'https://zoom.us/j/123456789',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = '8eaf2101-be9f-43f9-be26-01e563ea1cf2')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- In 3 days: Interview Prep
    IF student2 IS NOT NULL THEN
        INSERT INTO bookings (
            student_id, consultant_id, service_id, scheduled_at, status,
            base_price, final_price, prompt_text, requirements_text,
            meeting_link, is_group_session
        )
        SELECT 
            student2,
            'f47ac10b-58cc-4372-a567-0e02b2c3d486'::uuid,
            'ca2cb7ac-d4ae-4af4-b4f0-34cd1ebc9b68'::uuid,
            NOW() + INTERVAL '3 days' + TIME '16:00:00',
            'confirmed'::booking_status,
            100.00, 100.00,
            'Cornell Engineering interview preparation',
            'Focus on research projects and technical skills',
            'https://zoom.us/j/987654321',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = 'ca2cb7ac-d4ae-4af4-b4f0-34cd1ebc9b68')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- Next week: Strategy Session
    IF student3 IS NOT NULL THEN
        INSERT INTO bookings (
            student_id, consultant_id, service_id, scheduled_at, status,
            base_price, final_price, prompt_text, requirements_text,
            meeting_link, is_group_session
        )
        SELECT 
            student3,
            'f47ac10b-58cc-4372-a567-0e02b2c3d485'::uuid,
            'f05194aa-06a1-4118-ba87-1480a9dd9d7e'::uuid,
            NOW() + INTERVAL '7 days' + TIME '15:00:00',
            'confirmed'::booking_status,
            150.00, 150.00,
            'Help me build college list for pre-med track',
            'GPA: 3.9, SAT: 1520, interested in BS/MD programs',
            'https://meet.google.com/xyz-abcd-efg',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = 'f05194aa-06a1-4118-ba87-1480a9dd9d7e')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- In Progress: Essay Review
    IF student4 IS NOT NULL THEN
        INSERT INTO bookings (
            student_id, consultant_id, service_id, scheduled_at, status,
            base_price, final_price, essay_text, requirements_text,
            promised_delivery_at, is_group_session
        )
        SELECT 
            student4,
            'f47ac10b-58cc-4372-a567-0e02b2c3d487'::uuid,
            'c34d9a8a-aace-4f6b-8dac-af0db4cff88f'::uuid,
            NOW() - INTERVAL '2 hours',
            'in_progress'::booking_status,
            80.00, 80.00,
            'My journey with mental health began when I was fifteen. What started as occasional anxiety about grades evolved into something more serious. I found myself unable to sleep, constantly worried about disappointing my parents who had sacrificed everything to give me opportunities they never had. The breaking point came during junior year when I had a panic attack during the SAT. That moment forced me to confront what I had been avoiding - I needed help. Seeking therapy was the hardest decision I ever made, but it transformed my life. Through counseling, I learned that vulnerability is not weakness but strength. I started a mental health awareness club at school, creating a safe space for students to share their struggles. We brought in speakers, organized stress-relief activities, and most importantly, normalized conversations about mental health. What began as my personal struggle became a mission to help others. At Brown, I want to continue advocating for mental health resources and studying psychology to better understand how we can support student wellbeing.',
            'Brown supplemental about personal growth - review for authenticity and vulnerability balance',
            NOW() + INTERVAL '2 days',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = 'c34d9a8a-aace-4f6b-8dac-af0db4cff88f')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- Pending: Awaiting Confirmation
    IF student5 IS NOT NULL THEN
        INSERT INTO bookings (
            student_id, consultant_id, service_id, scheduled_at, status,
            base_price, final_price, prompt_text, requirements_text, is_group_session
        )
        SELECT 
            student5,
            '639b801b-e0cd-4231-9139-0eda9cb7e39a'::uuid,
            '54db6db8-cb59-4c54-9916-3b9909653e54'::uuid,
            NOW() + INTERVAL '5 days' + TIME '18:00:00',
            'pending'::booking_status,
            150.00, 150.00,
            'Full Common App review before deadline',
            'Need comprehensive review of all 10 essays, activities list, and additional info section',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = '54db6db8-cb59-4c54-9916-3b9909653e54')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- =====================================================
    -- COMPLETED BOOKINGS - RATED
    -- =====================================================
    
    -- 5-star review from last week
    IF student1 IS NOT NULL THEN
        INSERT INTO bookings (
            student_id, consultant_id, service_id, scheduled_at, status,
            base_price, final_price, rating, review_text, reviewed_at,
            completed_at, is_group_session
        )
        SELECT 
            student1,
            '639b801b-e0cd-4231-9139-0eda9cb7e39a'::uuid,
            '8eaf2101-be9f-43f9-be26-01e563ea1cf2'::uuid,
            NOW() - INTERVAL '7 days',
            'completed'::booking_status,
            80.00, 80.00,
            5,
            'Priya was absolutely phenomenal! She didn''t just edit my essay - she helped me find my authentic voice. Her insights about what Harvard admissions officers look for were invaluable. She pointed out places where I was being too generic and helped me add specific details that made my story come alive. The essay went from good to exceptional. Highly recommend!',
            NOW() - INTERVAL '5 days',
            NOW() - INTERVAL '7 days',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = '8eaf2101-be9f-43f9-be26-01e563ea1cf2')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- 5-star interview prep
    IF student2 IS NOT NULL THEN
        INSERT INTO bookings (
            student_id, consultant_id, service_id, scheduled_at, status,
            base_price, final_price, rating, review_text, reviewed_at,
            completed_at, is_group_session
        )
        SELECT 
            student2,
            'f47ac10b-58cc-4372-a567-0e02b2c3d486'::uuid,
            'ca2cb7ac-d4ae-4af4-b4f0-34cd1ebc9b68'::uuid,
            NOW() - INTERVAL '14 days',
            'completed'::booking_status,
            100.00, 100.00,
            5,
            'Noah was incredible! The mock interview was exactly like my real Cornell interview. He asked challenging questions and gave me detailed feedback on my responses. His tips about discussing technical projects were spot on. I felt so prepared and confident. Update: I GOT IN! Thank you Noah!',
            NOW() - INTERVAL '10 days',
            NOW() - INTERVAL '14 days',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = 'ca2cb7ac-d4ae-4af4-b4f0-34cd1ebc9b68')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- 4-star strategy session
    IF student3 IS NOT NULL THEN
        INSERT INTO bookings (
            student_id, consultant_id, service_id, scheduled_at, status,
            base_price, final_price, rating, review_text, reviewed_at,
            completed_at, is_group_session
        )
        SELECT 
            student3,
            'f47ac10b-58cc-4372-a567-0e02b2c3d485'::uuid,
            'f05194aa-06a1-4118-ba87-1480a9dd9d7e'::uuid,
            NOW() - INTERVAL '21 days',
            'completed'::booking_status,
            150.00, 150.00,
            4,
            'Very helpful session with Olivia. She helped me create a balanced college list with reaches, matches, and safeties. I especially appreciated her insights about pre-med programs and which schools have good medical school placement rates. Only minor issue was we ran a bit over time, but she didn''t charge extra which was nice.',
            NOW() - INTERVAL '19 days',
            NOW() - INTERVAL '21 days',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = 'f05194aa-06a1-4118-ba87-1480a9dd9d7e')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- =====================================================
    -- COMPLETED BOOKINGS - UNRATED (Shows rating prompt)
    -- =====================================================
    
    -- Recent essay review - needs rating
    IF student1 IS NOT NULL THEN
        INSERT INTO bookings (
            student_id, consultant_id, service_id, scheduled_at, status,
            base_price, final_price, completed_at, is_group_session
        )
        SELECT 
            student1,
            'f47ac10b-58cc-4372-a567-0e02b2c3d487'::uuid,
            'c34d9a8a-aace-4f6b-8dac-af0db4cff88f'::uuid,
            NOW() - INTERVAL '3 days',
            'completed'::booking_status,
            80.00, 80.00,
            NOW() - INTERVAL '2 days',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = 'c34d9a8a-aace-4f6b-8dac-af0db4cff88f')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- Interview prep - needs rating  
    IF student2 IS NOT NULL THEN
        INSERT INTO bookings (
            student_id, consultant_id, service_id, scheduled_at, status,
            base_price, final_price, completed_at, is_group_session
        )
        SELECT 
            student2,
            'f47ac10b-58cc-4372-a567-0e02b2c3d485'::uuid,
            'f05194aa-06a1-4118-ba87-1480a9dd9d7e'::uuid,
            NOW() - INTERVAL '4 days',
            'completed'::booking_status,
            150.00, 150.00,
            NOW() - INTERVAL '4 days',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = 'f05194aa-06a1-4118-ba87-1480a9dd9d7e')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- =====================================================
    -- SAVED CONSULTANTS
    -- =====================================================
    
    -- Student 1 saved their favorite consultants
    IF student1 IS NOT NULL THEN
        INSERT INTO saved_consultants (student_id, consultant_id, saved_at)
        VALUES
            (student1, '639b801b-e0cd-4231-9139-0eda9cb7e39a', NOW() - INTERVAL '10 days'),
            (student1, 'f47ac10b-58cc-4372-a567-0e02b2c3d487', NOW() - INTERVAL '8 days'),
            (student1, 'f47ac10b-58cc-4372-a567-0e02b2c3d486', NOW() - INTERVAL '5 days'),
            (student1, 'f47ac10b-58cc-4372-a567-0e02b2c3d485', NOW() - INTERVAL '3 days')
        ON CONFLICT (student_id, consultant_id) DO NOTHING;
    END IF;

    -- Student 2 saved consultants
    IF student2 IS NOT NULL THEN
        INSERT INTO saved_consultants (student_id, consultant_id, saved_at)
        VALUES
            (student2, 'f47ac10b-58cc-4372-a567-0e02b2c3d485', NOW() - INTERVAL '15 days'),
            (student2, '639b801b-e0cd-4231-9139-0eda9cb7e39a', NOW() - INTERVAL '12 days')
        ON CONFLICT (student_id, consultant_id) DO NOTHING;
    END IF;

    -- Other students saved consultants
    IF student3 IS NOT NULL THEN
        INSERT INTO saved_consultants (student_id, consultant_id, saved_at)
        VALUES
            (student3, '639b801b-e0cd-4231-9139-0eda9cb7e39a', NOW() - INTERVAL '20 days')
        ON CONFLICT (student_id, consultant_id) DO NOTHING;
    END IF;

    -- =====================================================
    -- WAITLISTS (using correct column: created_at)
    -- =====================================================
    
    IF student3 IS NOT NULL THEN
        INSERT INTO consultant_waitlist (consultant_id, student_id, position, expires_at, notified, created_at)
        VALUES
            ('639b801b-e0cd-4231-9139-0eda9cb7e39a', student3, 1, NOW() + INTERVAL '25 days', false, NOW() - INTERVAL '5 days')
        ON CONFLICT DO NOTHING;
    END IF;

    IF student4 IS NOT NULL THEN
        INSERT INTO consultant_waitlist (consultant_id, student_id, position, expires_at, notified, created_at)
        VALUES
            ('639b801b-e0cd-4231-9139-0eda9cb7e39a', student4, 2, NOW() + INTERVAL '27 days', false, NOW() - INTERVAL '3 days'),
            ('f47ac10b-58cc-4372-a567-0e02b2c3d486', student4, 1, NOW() + INTERVAL '28 days', false, NOW() - INTERVAL '2 days')
        ON CONFLICT DO NOTHING;
    END IF;

END $$;

-- =====================================================
-- GROUP SESSIONS
-- =====================================================

-- Enable group sessions for essay review services
UPDATE services 
SET allows_group_sessions = true, max_group_size = 6
WHERE id IN (
    SELECT id FROM services
    WHERE consultant_id = '639b801b-e0cd-4231-9139-0eda9cb7e39a'
    AND title ILIKE '%essay%'
    AND allows_group_sessions = false
    LIMIT 1
);

-- Create a group essay workshop
INSERT INTO bookings (
    student_id, consultant_id, service_id, scheduled_at, status,
    base_price, final_price, is_group_session, max_participants,
    current_participants, prompt_text, meeting_link
)
SELECT 
    '338feabe-39f2-492a-93e4-ee746bf727b7'::uuid,
    s.consultant_id,
    s.id,
    NOW() + INTERVAL '2 days' + TIME '17:00:00',
    'confirmed'::booking_status,
    40.00, 40.00,
    true,
    COALESCE(s.max_group_size, 6),
    0,
    'Group Essay Workshop: Crafting Your Personal Statement - Learn from Harvard insider tips!',
    'https://zoom.us/j/555666777'
FROM services s
WHERE s.allows_group_sessions = true
    AND s.consultant_id = '639b801b-e0cd-4231-9139-0eda9cb7e39a'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Add participants to group session (using correct column: joined_at)
INSERT INTO group_session_participants (booking_id, student_id, joined_at)
SELECT 
    b.id,
    s.id,
    CASE 
        WHEN ROW_NUMBER() OVER () = 1 THEN NOW()
        WHEN ROW_NUMBER() OVER () = 2 THEN NOW() - INTERVAL '2 days'
        ELSE NOW() - INTERVAL '1 day'
    END
FROM bookings b
CROSS JOIN (
    SELECT id FROM students 
    WHERE id IN (
        '338feabe-39f2-492a-93e4-ee746bf727b7',
        'e4bf552b-5275-40f9-a598-3793d8a1f4e9'
    )
    UNION
    (SELECT id FROM students 
    WHERE id NOT IN (
        '338feabe-39f2-492a-93e4-ee746bf727b7',
        'e4bf552b-5275-40f9-a598-3793d8a1f4e9'
    )
    ORDER BY created_at DESC 
    LIMIT 1)
) s
WHERE b.is_group_session = true
    AND b.scheduled_at > NOW()
ON CONFLICT (booking_id, student_id) DO NOTHING;

-- Update participant counts
UPDATE bookings b
SET current_participants = (
    SELECT COUNT(*) FROM group_session_participants WHERE booking_id = b.id
)
WHERE b.is_group_session = true;

COMMIT;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Summary for main student
SELECT 
    'Summary for ibm@gmail.com' as title,
    COUNT(*) FILTER (WHERE status IN ('confirmed', 'in_progress', 'pending')) as active_bookings,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_bookings,
    COUNT(*) FILTER (WHERE status = 'completed' AND rating IS NULL) as needs_rating,
    SUM(credits_earned) FILTER (WHERE status = 'completed') as total_credits
FROM bookings 
WHERE student_id = '338feabe-39f2-492a-93e4-ee746bf727b7';

-- Show saved consultants
SELECT 
    'Saved Consultants' as section,
    c.name,
    c.current_college,
    c.rating,
    sc.saved_at::date as saved_date
FROM saved_consultants sc
JOIN consultants c ON sc.consultant_id = c.id
WHERE sc.student_id = '338feabe-39f2-492a-93e4-ee746bf727b7'
ORDER BY sc.saved_at DESC;