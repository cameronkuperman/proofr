-- =====================================================
-- FINAL WORKING BOOKINGS MIGRATION
-- Only uses tables that actually exist
-- =====================================================

BEGIN;

-- =====================================================
-- BOOKINGS DATA
-- =====================================================
DO $$ 
DECLARE
    student1 uuid;
    student2 uuid;
    student3 uuid;
    student4 uuid;
    student5 uuid;
BEGIN
    -- Get actual student IDs that exist
    SELECT id INTO student1 FROM students WHERE id = '338feabe-39f2-492a-93e4-ee746bf727b7'; -- ibm@gmail.com
    SELECT id INTO student2 FROM students WHERE id = 'e4bf552b-5275-40f9-a598-3793d8a1f4e9'; -- icecam000001@gmail.com
    
    -- Get more students if they exist
    SELECT id INTO student3 FROM students WHERE id != ALL(ARRAY[student1, student2]) ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO student4 FROM students WHERE id != ALL(ARRAY[student1, student2, student3]) ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO student5 FROM students WHERE id != ALL(ARRAY[student1, student2, student3, student4]) ORDER BY created_at DESC LIMIT 1;

    -- =====================================================
    -- ACTIVE BOOKINGS (Upcoming, In Progress, Pending)
    -- =====================================================
    
    -- Tomorrow: Essay Review with Priya
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
            NOW() + INTERVAL '1 day 14 hours',
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
            NOW() + INTERVAL '3 days 16 hours',
            'confirmed'::booking_status,
            100.00, 100.00,
            'Cornell Engineering interview preparation',
            'Focus on research projects and technical skills',
            'https://zoom.us/j/987654321',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = 'ca2cb7ac-d4ae-4af4-b4f0-34cd1ebc9b68')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- In Progress: Essay Review
    IF student3 IS NOT NULL THEN
        INSERT INTO bookings (
            student_id, consultant_id, service_id, scheduled_at, status,
            base_price, final_price, essay_text, requirements_text,
            promised_delivery_at, is_group_session
        )
        SELECT 
            student3,
            'f47ac10b-58cc-4372-a567-0e02b2c3d487'::uuid,
            'c34d9a8a-aace-4f6b-8dac-af0db4cff88f'::uuid,
            NOW() - INTERVAL '2 hours',
            'in_progress'::booking_status,
            80.00, 80.00,
            'My essay about overcoming challenges in starting a nonprofit that helps underprivileged students access STEM education...',
            'Brown supplemental - review for authenticity and impact',
            NOW() + INTERVAL '2 days',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = 'c34d9a8a-aace-4f6b-8dac-af0db4cff88f')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- Pending: Awaiting Confirmation
    IF student4 IS NOT NULL THEN
        INSERT INTO bookings (
            student_id, consultant_id, service_id, scheduled_at, status,
            base_price, final_price, prompt_text, requirements_text, is_group_session
        )
        SELECT 
            student4,
            '639b801b-e0cd-4231-9139-0eda9cb7e39a'::uuid,
            '54db6db8-cb59-4c54-9916-3b9909653e54'::uuid,
            NOW() + INTERVAL '5 days 18 hours',
            'pending'::booking_status,
            150.00, 150.00,
            'Full Common App review before deadline',
            'Complete review of all essays and activities',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = '54db6db8-cb59-4c54-9916-3b9909653e54')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- =====================================================
    -- COMPLETED BOOKINGS - RATED (Shows in history)
    -- =====================================================
    
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
            'Priya was amazing! Her feedback completely transformed my essay. She helped me find my authentic voice.',
            NOW() - INTERVAL '5 days',
            NOW() - INTERVAL '7 days',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = '8eaf2101-be9f-43f9-be26-01e563ea1cf2')
        ON CONFLICT (id) DO NOTHING;
    END IF;

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
            'Noah was incredible! The mock interview perfectly prepared me. I got into Cornell!',
            NOW() - INTERVAL '12 days',
            NOW() - INTERVAL '14 days',
            false
        WHERE EXISTS (SELECT 1 FROM services WHERE id = 'ca2cb7ac-d4ae-4af4-b4f0-34cd1ebc9b68')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- =====================================================
    -- COMPLETED BOOKINGS - UNRATED (Triggers rating prompt)
    -- =====================================================
    
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
    -- WAITLISTS (if table exists and students exist)
    -- =====================================================
    
    IF student3 IS NOT NULL THEN
        INSERT INTO consultant_waitlist (consultant_id, student_id, position, joined_at, expires_at, notified)
        VALUES
            ('639b801b-e0cd-4231-9139-0eda9cb7e39a', student3, 1, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', false)
        ON CONFLICT DO NOTHING;
    END IF;

    IF student4 IS NOT NULL THEN
        INSERT INTO consultant_waitlist (consultant_id, student_id, position, joined_at, expires_at, notified)
        VALUES
            ('639b801b-e0cd-4231-9139-0eda9cb7e39a', student4, 2, NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days', false)
        ON CONFLICT DO NOTHING;
    END IF;

END $$;

-- =====================================================
-- GROUP SESSIONS (Handle separately)
-- =====================================================

-- Enable group sessions for Priya's essay service
UPDATE services 
SET allows_group_sessions = true, max_group_size = 6
WHERE id IN (
    SELECT id FROM services
    WHERE consultant_id = '639b801b-e0cd-4231-9139-0eda9cb7e39a'
    AND (title ILIKE '%essay%' OR title ILIKE '%review%')
    AND allows_group_sessions = false
    LIMIT 1
);

-- Create a group session
INSERT INTO bookings (
    student_id, consultant_id, service_id, scheduled_at, status,
    base_price, final_price, is_group_session, max_participants,
    current_participants, prompt_text, meeting_link
)
SELECT 
    '338feabe-39f2-492a-93e4-ee746bf727b7'::uuid,
    s.consultant_id,
    s.id,
    NOW() + INTERVAL '2 days 17 hours',
    'confirmed'::booking_status,
    40.00, 40.00,
    true,
    COALESCE(s.max_group_size, 6),
    0,
    'Group Essay Workshop: Crafting Your Personal Statement',
    'https://zoom.us/j/555666777'
FROM services s
WHERE s.allows_group_sessions = true
    AND s.consultant_id = '639b801b-e0cd-4231-9139-0eda9cb7e39a'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Add participants to the group session
INSERT INTO group_session_participants (booking_id, student_id, joined_at)
SELECT 
    b.id,
    s.id,
    CASE 
        WHEN s.id = '338feabe-39f2-492a-93e4-ee746bf727b7' THEN NOW()
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
    SELECT id FROM students 
    WHERE id NOT IN (
        '338feabe-39f2-492a-93e4-ee746bf727b7',
        'e4bf552b-5275-40f9-a598-3793d8a1f4e9'
    )
    ORDER BY created_at DESC 
    LIMIT 1
) s
WHERE b.is_group_session = true
    AND b.scheduled_at > NOW()
    AND b.prompt_text LIKE '%Group Essay Workshop%'
ON CONFLICT (booking_id, student_id) DO NOTHING;

-- Update participant count
UPDATE bookings b
SET current_participants = (
    SELECT COUNT(*) FROM group_session_participants WHERE booking_id = b.id
)
WHERE b.is_group_session = true;

COMMIT;

-- =====================================================
-- VERIFY RESULTS
-- =====================================================

-- Show what we created for the main student
SELECT 
    b.status,
    CASE 
        WHEN b.scheduled_at > NOW() THEN 'In ' || date_trunc('day', b.scheduled_at - NOW())::text
        ELSE date_trunc('day', NOW() - b.scheduled_at)::text || ' ago'
    END as when_text,
    c.name as consultant,
    s.title as service,
    b.final_price,
    b.credits_earned,
    b.is_group_session,
    CASE 
        WHEN b.status = 'completed' AND b.rating IS NULL THEN 'Needs Rating!'
        WHEN b.rating IS NOT NULL THEN b.rating || ' stars'
        ELSE ''
    END as rating_status
FROM bookings b
JOIN consultants c ON b.consultant_id = c.id
JOIN services s ON b.service_id = s.id
WHERE b.student_id = '338feabe-39f2-492a-93e4-ee746bf727b7'
ORDER BY 
    CASE b.status 
        WHEN 'in_progress' THEN 1
        WHEN 'confirmed' THEN 2
        WHEN 'pending' THEN 3
        WHEN 'completed' THEN 4
    END,
    b.scheduled_at DESC;

-- Count unrated sessions
SELECT 
    'You have ' || COUNT(*) || ' unrated sessions' as message
FROM bookings 
WHERE status = 'completed' 
    AND rating IS NULL
    AND student_id IN (
        SELECT id FROM students ORDER BY created_at DESC LIMIT 5
    );