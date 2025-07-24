-- =====================================================
-- PERFECT BOOKINGS DATA MIGRATION FOR PROOFR
-- =====================================================
-- This migration uses REAL IDs from your database
-- Handles all column types correctly
-- Credits are auto-generated (2% of final_price)
-- =====================================================

BEGIN;

-- =====================================================
-- CLEAN UP ANY TEST DATA FIRST (optional - uncomment if needed)
-- =====================================================
-- DELETE FROM group_session_participants WHERE joined_at > NOW() - INTERVAL '30 days';
-- DELETE FROM bookings WHERE prompt_text LIKE '%test data%' OR created_at > NOW() - INTERVAL '30 days';

-- =====================================================
-- PART 1: ACTIVE BOOKINGS (Real consultants, real services)
-- =====================================================

-- Tomorrow: Essay Review with Priya Sharma (Harvard)
INSERT INTO bookings (
  student_id,
  consultant_id,
  service_id,
  scheduled_at,
  status,
  base_price,
  final_price,
  prompt_text,
  requirements_text,
  meeting_link,
  is_group_session
) VALUES (
  '338feabe-39f2-492a-93e4-ee746bf727b7'::uuid, -- ibm@gmail.com
  '639b801b-e0cd-4231-9139-0eda9cb7e39a'::uuid, -- Priya Sharma
  '8eaf2101-be9f-43f9-be26-01e563ea1cf2'::uuid, -- Comprehensive Essay Review
  NOW() + INTERVAL '1 day 14 hours',
  'confirmed'::booking_status,
  80.00,
  80.00,
  'Please review my Common App essay about overcoming challenges in robotics club',
  'Focus on storytelling and emotional impact. 650 words. Need to show leadership.',
  'https://zoom.us/j/123456789',
  false
) ON CONFLICT (id) DO NOTHING;

-- In 3 days: Mock Interview with Noah Kim (Cornell)
INSERT INTO bookings (
  student_id,
  consultant_id,
  service_id,
  scheduled_at,
  status,
  base_price,
  final_price,
  prompt_text,
  requirements_text,
  meeting_link,
  is_group_session
) VALUES (
  'e4bf552b-5275-40f9-a598-3793d8a1f4e9'::uuid, -- icecam000001@gmail.com
  'f47ac10b-58cc-4372-a567-0e02b2c3d486'::uuid, -- Noah Kim
  'ca2cb7ac-d4ae-4af4-b4f0-34cd1ebc9b68'::uuid, -- Mock Interview Session
  NOW() + INTERVAL '3 days 16 hours',
  'confirmed'::booking_status,
  100.00,
  100.00,
  'Cornell Engineering interview prep',
  'Focus on technical projects and research experience. I built an AI chatbot.',
  'https://zoom.us/j/987654321',
  false
) ON CONFLICT (id) DO NOTHING;

-- Next week: Strategy Session with Olivia Martinez (UPenn)
INSERT INTO bookings (
  student_id,
  consultant_id,
  service_id,
  scheduled_at,
  status,
  base_price,
  final_price,
  prompt_text,
  requirements_text,
  meeting_link,
  is_group_session
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d508'::uuid, -- christopher.king@example.com
  'f47ac10b-58cc-4372-a567-0e02b2c3d485'::uuid, -- Olivia Martinez
  'f05194aa-06a1-4118-ba87-1480a9dd9d7e'::uuid, -- Strategic Planning Session
  NOW() + INTERVAL '7 days 15 hours',
  'confirmed'::booking_status,
  150.00,
  150.00,
  'Help me build my college list for pre-med track',
  'GPA: 3.9, SAT: 1520, interested in research opportunities and BS/MD programs',
  'https://meet.google.com/abc-defg-hij',
  false
) ON CONFLICT (id) DO NOTHING;

-- In Progress: Essay being reviewed by Ava Nguyen (Brown)
INSERT INTO bookings (
  student_id,
  consultant_id,
  service_id,
  scheduled_at,
  status,
  base_price,
  final_price,
  essay_text,
  requirements_text,
  promised_delivery_at,
  is_group_session
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d507'::uuid, -- michelle.turner@example.com
  'f47ac10b-58cc-4372-a567-0e02b2c3d487'::uuid, -- Ava Nguyen
  'c34d9a8a-aace-4f6b-8dac-af0db4cff88f'::uuid, -- Comprehensive Essay Review
  NOW() - INTERVAL '2 hours',
  'in_progress'::booking_status,
  80.00,
  80.00,
  'The summer before my senior year, I found myself standing in the ruins of my high school''s computer lab. A burst pipe had destroyed everything – including the server hosting our school''s learning management system I had spent two years building. As I surveyed the damage, I felt the weight of 3,000 students and teachers who depended on this system. But instead of despair, I felt determination. Over the next 72 hours, I led a team of volunteers to rebuild everything from scratch, this time implementing cloud backups and disaster recovery protocols I had only read about in theory. We not only restored the system but made it better. When school started, no one knew how close we had come to chaos. This experience taught me that true engineering isn''t just about building things – it''s about building things that last, planning for failure, and leading when others need you most. At MIT, I want to explore how resilient systems can serve communities worldwide.',
  'Brown supplemental essay - Please review for authenticity and technical accuracy. 650 words max.',
  NOW() + INTERVAL '2 days',
  false
) ON CONFLICT (id) DO NOTHING;

-- Pending: Awaiting confirmation from Priya for full Common App review
INSERT INTO bookings (
  student_id,
  consultant_id,
  service_id,
  scheduled_at,
  status,
  base_price,
  final_price,
  prompt_text,
  requirements_text,
  is_group_session
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d506'::uuid, -- jason.hall@example.com
  '639b801b-e0cd-4231-9139-0eda9cb7e39a'::uuid, -- Priya Sharma
  '54db6db8-cb59-4c54-9916-3b9909653e54'::uuid, -- Strategic Planning Session
  NOW() + INTERVAL '5 days 18 hours',
  'pending'::booking_status,
  150.00,
  150.00,
  'Full Common App review before January deadlines',
  'Need comprehensive review of all essays, activities, and additional info. Applying to all Ivies.',
  false
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PART 2: COMPLETED BOOKINGS (Mix of rated and unrated)
-- =====================================================

-- Completed and rated bookings
INSERT INTO bookings (
  student_id,
  consultant_id,
  service_id,
  scheduled_at,
  status,
  base_price,
  final_price,
  rating,
  review_text,
  reviewed_at,
  completed_at,
  is_group_session
) VALUES 
-- 5-star essay review
(
  '338feabe-39f2-492a-93e4-ee746bf727b7'::uuid,
  '639b801b-e0cd-4231-9139-0eda9cb7e39a'::uuid,
  '8eaf2101-be9f-43f9-be26-01e563ea1cf2'::uuid,
  NOW() - INTERVAL '7 days',
  'completed'::booking_status,
  80.00,
  80.00,
  5,
  'Priya was absolutely amazing! She helped me completely transform my essay. Her insights about what Harvard looks for were invaluable. Highly recommend!',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '7 days',
  false
),
-- 5-star interview prep
(
  'e4bf552b-5275-40f9-a598-3793d8a1f4e9'::uuid,
  'f47ac10b-58cc-4372-a567-0e02b2c3d486'::uuid,
  'ca2cb7ac-d4ae-4af4-b4f0-34cd1ebc9b68'::uuid,
  NOW() - INTERVAL '14 days',
  'completed'::booking_status,
  100.00,
  100.00,
  5,
  'Noah gave me so much confidence! The mock interview was exactly like the real thing. I got into Cornell!',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '14 days',
  false
),
-- 4-star strategy session
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d508'::uuid,
  'f47ac10b-58cc-4372-a567-0e02b2c3d485'::uuid,
  'f05194aa-06a1-4118-ba87-1480a9dd9d7e'::uuid,
  NOW() - INTERVAL '21 days',
  'completed'::booking_status,
  150.00,
  150.00,
  4,
  'Very helpful session. Olivia helped me identify several safety schools I hadn''t considered.',
  NOW() - INTERVAL '19 days',
  NOW() - INTERVAL '21 days',
  false
)
ON CONFLICT (id) DO NOTHING;

-- Completed but UNRATED (to trigger rating prompts)
INSERT INTO bookings (
  student_id,
  consultant_id,
  service_id,
  scheduled_at,
  status,
  base_price,
  final_price,
  completed_at,
  is_group_session
) VALUES 
-- Recent essay review - needs rating
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d507'::uuid,
  'f47ac10b-58cc-4372-a567-0e02b2c3d487'::uuid,
  'c34d9a8a-aace-4f6b-8dac-af0db4cff88f'::uuid,
  NOW() - INTERVAL '3 days',
  'completed'::booking_status,
  80.00,
  80.00,
  NOW() - INTERVAL '2 days',
  false
),
-- Interview prep - needs rating
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d506'::uuid,
  'f47ac10b-58cc-4372-a567-0e02b2c3d486'::uuid,
  'ca2cb7ac-d4ae-4af4-b4f0-34cd1ebc9b68'::uuid,
  NOW() - INTERVAL '4 days',
  'completed'::booking_status,
  100.00,
  100.00,
  NOW() - INTERVAL '4 days',
  false
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PART 3: GROUP SESSIONS (if any services allow them)
-- =====================================================

-- First enable group sessions for some services
UPDATE services 
SET 
  allows_group_sessions = true,
  max_group_size = 8
WHERE title ILIKE '%essay%' 
  AND consultant_id IN (
    '639b801b-e0cd-4231-9139-0eda9cb7e39a',
    'f47ac10b-58cc-4372-a567-0e02b2c3d487'
  )
  AND allows_group_sessions = false;

-- Create a group essay workshop (if service supports it)
INSERT INTO bookings (
  student_id,
  consultant_id,
  service_id,
  scheduled_at,
  status,
  base_price,
  final_price,
  is_group_session,
  max_participants,
  current_participants,
  prompt_text,
  meeting_link
)
SELECT 
  s.consultant_id, -- consultant owns the group session
  s.consultant_id,
  s.id,
  NOW() + INTERVAL '2 days 17 hours',
  'confirmed'::booking_status,
  40.00, -- group rate
  40.00,
  true,
  s.max_group_size,
  0, -- will be updated when students join
  'Group Essay Workshop: Crafting Your Personal Statement',
  'https://zoom.us/j/555666777'
FROM services s
WHERE s.allows_group_sessions = true
  AND s.title ILIKE '%essay%'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PART 4: SAVED CONSULTANTS
-- =====================================================

INSERT INTO saved_consultants (student_id, consultant_id, saved_at)
VALUES
  -- Main student saved top consultants
  ('338feabe-39f2-492a-93e4-ee746bf727b7', '639b801b-e0cd-4231-9139-0eda9cb7e39a', NOW() - INTERVAL '10 days'),
  ('338feabe-39f2-492a-93e4-ee746bf727b7', 'f47ac10b-58cc-4372-a567-0e02b2c3d487', NOW() - INTERVAL '8 days'),
  ('338feabe-39f2-492a-93e4-ee746bf727b7', 'f47ac10b-58cc-4372-a567-0e02b2c3d486', NOW() - INTERVAL '5 days'),
  
  -- Other students saved consultants
  ('e4bf552b-5275-40f9-a598-3793d8a1f4e9', 'f47ac10b-58cc-4372-a567-0e02b2c3d485', NOW() - INTERVAL '15 days'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d508', '639b801b-e0cd-4231-9139-0eda9cb7e39a', NOW() - INTERVAL '20 days')
ON CONFLICT (student_id, consultant_id) DO NOTHING;

-- =====================================================
-- PART 5: WAITLISTS
-- =====================================================

INSERT INTO consultant_waitlist (consultant_id, student_id, position, joined_at, expires_at, notified)
VALUES
  -- Waitlist for Priya (Harvard)
  ('639b801b-e0cd-4231-9139-0eda9cb7e39a', 'f47ac10b-58cc-4372-a567-0e02b2c3d505', 1, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', false),
  ('639b801b-e0cd-4231-9139-0eda9cb7e39a', 'f47ac10b-58cc-4372-a567-0e02b2c3d504', 2, NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days', false)
ON CONFLICT DO NOTHING;

-- =====================================================
-- JOIN STUDENTS TO GROUP SESSIONS (if created)
-- =====================================================

-- Add some students to any group sessions we created
INSERT INTO group_session_participants (booking_id, student_id, joined_at)
SELECT 
  b.id,
  s.student_id,
  NOW() - INTERVAL '1 day'
FROM bookings b
CROSS JOIN (
  VALUES 
    ('f47ac10b-58cc-4372-a567-0e02b2c3d507'::uuid),
    ('f47ac10b-58cc-4372-a567-0e02b2c3d506'::uuid),
    ('338feabe-39f2-492a-93e4-ee746bf727b7'::uuid)
) s(student_id)
WHERE b.is_group_session = true
  AND b.scheduled_at > NOW()
LIMIT 3
ON CONFLICT (booking_id, student_id) DO NOTHING;

-- Update participant count for group sessions
UPDATE bookings b
SET current_participants = (
  SELECT COUNT(*) 
  FROM group_session_participants gsp 
  WHERE gsp.booking_id = b.id
)
WHERE b.is_group_session = true;

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check what we created for main student (ibm@gmail.com)
SELECT 
  b.status,
  b.scheduled_at,
  c.name as consultant,
  s.title as service,
  b.final_price,
  b.credits_earned,
  b.is_group_session
FROM bookings b
JOIN consultants c ON b.consultant_id = c.id
JOIN services s ON b.service_id = s.id
WHERE b.student_id = '338feabe-39f2-492a-93e4-ee746bf727b7'
ORDER BY b.scheduled_at DESC
LIMIT 10;

-- Count unrated sessions
SELECT COUNT(*) as unrated_count
FROM bookings 
WHERE status = 'completed' 
  AND rating IS NULL;