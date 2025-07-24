-- =====================================================
-- MOCK BOOKINGS DATA MIGRATION FOR PROOFR (FINAL FIXED VERSION)
-- =====================================================
-- This migration creates realistic booking data
-- Safe to run multiple times - uses ON CONFLICT
-- Fixed all issues: removed service_type, credits_earned, proper enum casting
-- =====================================================

BEGIN;

-- =====================================================
-- PART 1: ACTIVE BOOKINGS (1:1 Sessions)
-- =====================================================

-- Create upcoming confirmed bookings for recent students
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
  is_group_session,
  created_at
)
SELECT 
  s.student_id,
  s.consultant_id,
  s.service_id,
  s.scheduled_at,
  s.status,
  s.base_price,
  s.final_price,
  s.prompt_text,
  s.requirements_text,
  s.meeting_link,
  s.is_group_session,
  s.created_at
FROM (
  -- Tomorrow's essay review with Amanda Davis (Brown)
  SELECT 
    '338feabe-39f2-492a-93e4-ee746bf727b7'::uuid as student_id,
    '6e4ebdab-dad2-47ed-80b0-a444583756d5'::uuid as consultant_id,
    (SELECT id FROM services WHERE consultant_id = '6e4ebdab-dad2-47ed-80b0-a444583756d5' LIMIT 1) as service_id,
    NOW() + INTERVAL '1 day' + TIME '14:00:00' as scheduled_at,
    'confirmed'::booking_status as status,
    120.00 as base_price,
    120.00 as final_price,
    'Please review my Common App essay about leadership in robotics club' as prompt_text,
    'Focus on narrative structure and showing vs telling. Word count: 650' as requirements_text,
    'https://zoom.us/j/123456789' as meeting_link,
    false as is_group_session,
    NOW() - INTERVAL '3 days' as created_at
  
  UNION ALL
  
  -- In 3 days - Interview prep with Kevin Zhou (UPenn)
  SELECT 
    'e4bf552b-5275-40f9-a598-3793d8a1f4e9'::uuid,
    'cf427c87-f260-49fb-9ced-d62cd6f78318'::uuid,
    (SELECT id FROM services WHERE consultant_id = 'cf427c87-f260-49fb-9ced-d62cd6f78318' LIMIT 1),
    NOW() + INTERVAL '3 days' + TIME '16:00:00',
    'confirmed'::booking_status,
    150.00,
    150.00,
    'MIT interview preparation - focus on technical questions',
    'I have a background in CS and want to discuss my research project',
    'https://zoom.us/j/987654321',
    false,
    NOW() - INTERVAL '2 days'
  
  UNION ALL
  
  -- Next week - Strategy session with Jessica Brown (Columbia)
  SELECT 
    '0beb79d5-6a77-46be-84f9-ab3b0a8627de'::uuid,
    'c2ccddbe-8d8b-48af-ac98-a7e300af7cb8'::uuid,
    (SELECT id FROM services WHERE consultant_id = 'c2ccddbe-8d8b-48af-ac98-a7e300af7cb8' LIMIT 1),
    NOW() + INTERVAL '7 days' + TIME '15:00:00',
    'confirmed'::booking_status,
    200.00,
    200.00,
    'Help me build my college list - interested in pre-med programs',
    'GPA: 3.9, SAT: 1520, looking for schools with strong research opportunities',
    'https://meet.google.com/abc-defg-hij',
    false,
    NOW() - INTERVAL '1 day'
) s
WHERE s.service_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Create in-progress bookings (essay reviews being worked on)
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
  is_group_session,
  created_at
)
SELECT
  '69f8f77c-6b82-4212-ae42-fcf1b4e2721b'::uuid as student_id,
  'f3189645-f5b7-46ec-858e-45334978f713'::uuid as consultant_id,
  (SELECT id FROM services WHERE consultant_id = 'f3189645-f5b7-46ec-858e-45334978f713' LIMIT 1) as service_id,
  NOW() - INTERVAL '2 hours',
  'in_progress'::booking_status,
  100.00,
  100.00,
  'Growing up in a small town in Texas, I never imagined that a broken laptop would change my life. It was junior year, and our school''s robotics team was preparing for the state championship. Our programming laptop crashed, taking with it months of code. While others panicked, I saw an opportunity. I had been learning Linux in my spare time, and I proposed using a Raspberry Pi I had been tinkering with. Over the next 48 hours, I led our team in not just recovering our work, but rebuilding our entire system on open-source platforms. We didn''t just make it to state—we won. But more importantly, I discovered my passion for creative problem-solving and the power of open-source collaboration. This experience shaped my desire to study Computer Science at Stanford, where I hope to contribute to democratizing technology access globally.',
  'Please provide detailed feedback on content, structure, and grammar. This is for Stanford''s first supplemental essay about intellectual vitality.',
  NOW() + INTERVAL '2 days',
  false,
  NOW() - INTERVAL '2 days'
WHERE (SELECT id FROM services WHERE consultant_id = 'f3189645-f5b7-46ec-858e-45334978f713' LIMIT 1) IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Create pending bookings (awaiting consultant confirmation)
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
  is_group_session,
  created_at
)
SELECT
  'b9cac74a-b729-491e-a409-d5f13755646b'::uuid as student_id,
  'de41442f-3642-4392-bf01-1e8bbec2f50a'::uuid as consultant_id,
  (SELECT id FROM services WHERE consultant_id = 'de41442f-3642-4392-bf01-1e8bbec2f50a' LIMIT 1) as service_id,
  NOW() + INTERVAL '5 days' + TIME '18:00:00',
  'pending'::booking_status,
  250.00,
  250.00,
  'Full Common App review before submission deadline',
  'Please review all sections including activities list, essays, and additional information. Applying to Ivies + Stanford/MIT',
  false,
  NOW() - INTERVAL '1 hour'
WHERE (SELECT id FROM services WHERE consultant_id = 'de41442f-3642-4392-bf01-1e8bbec2f50a' LIMIT 1) IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PART 2: COMPLETED BOOKINGS (For History Tab)
-- =====================================================

-- Completed and RATED bookings
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
  delivered_at,
  is_group_session,
  created_at
)
SELECT * FROM (
  VALUES
  -- Great essay review from Sophie Martinez (Yale)
  (
    '338feabe-39f2-492a-93e4-ee746bf727b7'::uuid,
    '751de371-730d-4bd3-9e89-620b5d68d490'::uuid,
    (SELECT id FROM services WHERE consultant_id = '751de371-730d-4bd3-9e89-620b5d68d490' LIMIT 1),
    NOW() - INTERVAL '7 days',
    'completed'::booking_status,
    120.00,
    120.00,
    5,
    'Sophie was absolutely incredible! She helped me completely restructure my essay and her insights about what Yale looks for were invaluable.',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '6 days',
    false,
    NOW() - INTERVAL '10 days'
  ),
  
  -- Interview prep with Priya Sharma (Harvard)
  (
    'e4bf552b-5275-40f9-a598-3793d8a1f4e9'::uuid,
    '639b801b-e0cd-4231-9139-0eda9cb7e39a'::uuid,
    (SELECT id FROM services WHERE consultant_id = '639b801b-e0cd-4231-9139-0eda9cb7e39a' LIMIT 1),
    NOW() - INTERVAL '14 days',
    'completed'::booking_status,
    150.00,
    150.00,
    5,
    'Excellent interview prep! Priya gave me confidence and great tips. I felt so prepared for my actual Harvard interview.',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '14 days',
    false,
    NOW() - INTERVAL '17 days'
  ),
  
  -- Strategy session with Alex Rodriguez (MIT)
  (
    '0beb79d5-6a77-46be-84f9-ab3b0a8627de'::uuid,
    'ffd289d6-f731-49ef-980c-8f7cd8798f37'::uuid,
    (SELECT id FROM services WHERE consultant_id = 'ffd289d6-f731-49ef-980c-8f7cd8798f37' LIMIT 1),
    NOW() - INTERVAL '21 days',
    'completed'::booking_status,
    200.00,
    200.00,
    4,
    'Very knowledgeable about STEM programs. Helped me identify several safety schools I hadn''t considered.',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '21 days',
    false,
    NOW() - INTERVAL '25 days'
  )
) AS completed_bookings(student_id, consultant_id, service_id, scheduled_at, status, base_price, final_price, rating, review_text, reviewed_at, delivered_at, is_group_session, created_at)
WHERE service_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Completed but UNRATED bookings (to show rating prompts)
INSERT INTO bookings (
  student_id,
  consultant_id,
  service_id,
  scheduled_at,
  status,
  base_price,
  final_price,
  delivered_at,
  is_group_session,
  created_at
)
SELECT * FROM (
  VALUES
  -- Recent essay review - needs rating
  (
    '69f8f77c-6b82-4212-ae42-fcf1b4e2721b'::uuid,
    '1684c912-8fc3-4d46-862a-c5e9177530a4'::uuid,
    (SELECT id FROM services WHERE consultant_id = '1684c912-8fc3-4d46-862a-c5e9177530a4' LIMIT 1),
    NOW() - INTERVAL '3 days',
    'completed'::booking_status,
    100.00,
    100.00,
    NOW() - INTERVAL '1 day',
    false,
    NOW() - INTERVAL '5 days'
  ),
  
  -- SAT tutoring session - needs rating
  (
    'b9cac74a-b729-491e-a409-d5f13755646b'::uuid,
    '7cefd294-6775-497d-a13a-373eea813373'::uuid,
    (SELECT id FROM services WHERE consultant_id = '7cefd294-6775-497d-a13a-373eea813373' LIMIT 1),
    NOW() - INTERVAL '4 days',
    'completed'::booking_status,
    80.00,
    80.00,
    NOW() - INTERVAL '4 days',
    false,
    NOW() - INTERVAL '6 days'
  )
) AS unrated_bookings(student_id, consultant_id, service_id, scheduled_at, status, base_price, final_price, delivered_at, is_group_session, created_at)
WHERE service_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PART 3: GROUP SESSIONS
-- =====================================================

-- First, update some services to allow group sessions if they don't already
UPDATE services 
SET 
  allows_group_sessions = true,
  max_group_size = 6
WHERE allows_group_sessions = false
  AND consultant_id IN (
    SELECT id FROM consultants 
    WHERE current_college IN ('Harvard University', 'Yale University', 'MIT', 'Stanford University')
    LIMIT 3
  )
  AND id IN (SELECT id FROM services ORDER BY RANDOM() LIMIT 3);

-- Create available group sessions (these act as templates)
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
  meeting_link,
  created_at
)
SELECT * FROM (
  VALUES
  -- Group Essay Workshop with Sophie Martinez (Yale)
  (
    '751de371-730d-4bd3-9e89-620b5d68d490'::uuid, -- consultant as the "owner"
    '751de371-730d-4bd3-9e89-620b5d68d490'::uuid,
    (SELECT id FROM services WHERE consultant_id = '751de371-730d-4bd3-9e89-620b5d68d490' AND allows_group_sessions = true LIMIT 1),
    NOW() + INTERVAL '2 days' + TIME '17:00:00',
    'confirmed'::booking_status,
    40.00,
    40.00,
    true,
    5,
    3,
    'Group workshop: Crafting compelling personal statements for Ivy League applications',
    'https://zoom.us/j/555666777',
    NOW() - INTERVAL '5 days'
  ),
  
  -- SAT Math Bootcamp with Alex Rodriguez (MIT)
  (
    'ffd289d6-f731-49ef-980c-8f7cd8798f37'::uuid,
    'ffd289d6-f731-49ef-980c-8f7cd8798f37'::uuid,
    (SELECT id FROM services WHERE consultant_id = 'ffd289d6-f731-49ef-980c-8f7cd8798f37' AND allows_group_sessions = true LIMIT 1),
    NOW() + INTERVAL '4 days' + TIME '10:00:00',
    'confirmed'::booking_status,
    30.00,
    30.00,
    true,
    8,
    2,
    'Intensive SAT Math prep: Algebra, Advanced Math, and Problem Solving',
    'https://zoom.us/j/888999000',
    NOW() - INTERVAL '3 days'
  )
) AS group_sessions(student_id, consultant_id, service_id, scheduled_at, status, base_price, final_price, is_group_session, max_participants, current_participants, prompt_text, meeting_link, created_at)
WHERE service_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PART 4: SAVED CONSULTANTS
-- =====================================================

-- Add saved consultants for active students
INSERT INTO saved_consultants (student_id, consultant_id, saved_at)
VALUES
  -- Student 1 saved top consultants
  ('338feabe-39f2-492a-93e4-ee746bf727b7', '639b801b-e0cd-4231-9139-0eda9cb7e39a', NOW() - INTERVAL '10 days'),
  ('338feabe-39f2-492a-93e4-ee746bf727b7', '751de371-730d-4bd3-9e89-620b5d68d490', NOW() - INTERVAL '8 days'),
  ('338feabe-39f2-492a-93e4-ee746bf727b7', 'ffd289d6-f731-49ef-980c-8f7cd8798f37', NOW() - INTERVAL '5 days'),
  
  -- Student 2 saved consultants
  ('e4bf552b-5275-40f9-a598-3793d8a1f4e9', '1684c912-8fc3-4d46-862a-c5e9177530a4', NOW() - INTERVAL '15 days'),
  ('e4bf552b-5275-40f9-a598-3793d8a1f4e9', '7cefd294-6775-497d-a13a-373eea813373', NOW() - INTERVAL '12 days'),
  
  -- Student 3 saved consultants
  ('0beb79d5-6a77-46be-84f9-ab3b0a8627de', '6e4ebdab-dad2-47ed-80b0-a444583756d5', NOW() - INTERVAL '20 days'),
  ('0beb79d5-6a77-46be-84f9-ab3b0a8627de', 'c2ccddbe-8d8b-48af-ac98-a7e300af7cb8', NOW() - INTERVAL '18 days')
ON CONFLICT (student_id, consultant_id) DO NOTHING;

-- =====================================================
-- PART 5: WAITLISTS
-- =====================================================

-- Add students to waitlists for popular consultants
INSERT INTO consultant_waitlist (consultant_id, student_id, position, joined_at, expires_at, notified)
VALUES
  -- Waitlist for Priya Sharma (Harvard)
  ('639b801b-e0cd-4231-9139-0eda9cb7e39a', '69f8f77c-6b82-4212-ae42-fcf1b4e2721b', 1, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', false),
  ('639b801b-e0cd-4231-9139-0eda9cb7e39a', 'b9cac74a-b729-491e-a409-d5f13755646b', 2, NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days', false),
  
  -- Waitlist for Sophie Martinez (Yale)
  ('751de371-730d-4bd3-9e89-620b5d68d490', '82599acf-7d88-430b-8fcd-05dcc69ac039', 1, NOW() - INTERVAL '8 days', NOW() + INTERVAL '22 days', false)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PART 6: JOIN SOME STUDENTS TO GROUP SESSIONS
-- =====================================================

-- Add participants to group sessions
INSERT INTO group_session_participants (booking_id, student_id, joined_at)
SELECT 
  b.id as booking_id,
  s.student_id,
  s.joined_at
FROM bookings b
CROSS JOIN (
  VALUES
    ('69f8f77c-6b82-4212-ae42-fcf1b4e2721b'::uuid, NOW() - INTERVAL '2 days'),
    ('b9cac74a-b729-491e-a409-d5f13755646b'::uuid, NOW() - INTERVAL '1 day'),
    ('82599acf-7d88-430b-8fcd-05dcc69ac039'::uuid, NOW() - INTERVAL '3 hours')
) s(student_id, joined_at)
WHERE b.is_group_session = true 
  AND b.prompt_text LIKE '%Group workshop%'
  AND b.scheduled_at > NOW()
LIMIT 3
ON CONFLICT (booking_id, student_id) DO NOTHING;

-- Add current user to SAT bootcamp
INSERT INTO group_session_participants (booking_id, student_id, joined_at)
SELECT 
  b.id as booking_id,
  '338feabe-39f2-492a-93e4-ee746bf727b7'::uuid as student_id,
  NOW() - INTERVAL '2 hours' as joined_at
FROM bookings b
WHERE b.is_group_session = true 
  AND b.prompt_text LIKE '%SAT Math%'
  AND b.scheduled_at > NOW()
LIMIT 1
ON CONFLICT (booking_id, student_id) DO NOTHING;

-- =====================================================
-- PART 7: UPDATE CONSULTANT STATS
-- =====================================================

-- Update consultant statistics based on the bookings we created
UPDATE consultants c
SET 
  total_bookings = COALESCE(c.total_bookings, 0) + subq.new_bookings,
  total_reviews = COALESCE(c.total_reviews, 0) + subq.new_reviews,
  rating = CASE 
    WHEN COALESCE(c.total_reviews, 0) + subq.new_reviews = 0 THEN 0
    ELSE (
      (COALESCE(c.rating, 0) * COALESCE(c.total_reviews, 0) + subq.total_rating) / 
      (COALESCE(c.total_reviews, 0) + subq.new_reviews)
    )
  END
FROM (
  SELECT 
    consultant_id,
    COUNT(*) FILTER (WHERE status = 'completed') as new_bookings,
    COUNT(rating) as new_reviews,
    COALESCE(SUM(rating), 0) as total_rating
  FROM bookings
  WHERE created_at > NOW() - INTERVAL '1 hour'
  GROUP BY consultant_id
) subq
WHERE c.id = subq.consultant_id;

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES - Run these separately
-- =====================================================

-- Check active bookings for main student (ibm@gmail.com)
-- SELECT 
--   b.id,
--   b.status,
--   b.scheduled_at,
--   c.name as consultant_name,
--   c.current_college,
--   b.final_price,
--   b.is_group_session,
--   b.credits_earned
-- FROM bookings b
-- JOIN consultants c ON b.consultant_id = c.id
-- WHERE b.student_id = '338feabe-39f2-492a-93e4-ee746bf727b7'
--   AND b.status IN ('pending', 'confirmed', 'in_progress')
-- ORDER BY b.scheduled_at;

-- Check unrated bookings count
-- SELECT COUNT(*) as unrated_sessions
-- FROM bookings 
-- WHERE status = 'completed' 
--   AND rating IS NULL
--   AND student_id IN (
--     '338feabe-39f2-492a-93e4-ee746bf727b7',
--     'e4bf552b-5275-40f9-a598-3793d8a1f4e9',
--     '69f8f77c-6b82-4212-ae42-fcf1b4e2721b',
--     'b9cac74a-b729-491e-a409-d5f13755646b'
--   );

-- Check available group sessions
-- SELECT 
--   b.prompt_text,
--   c.name as consultant_name,
--   c.current_college,
--   b.scheduled_at,
--   b.current_participants || '/' || b.max_participants as spots,
--   b.final_price
-- FROM bookings b
-- JOIN consultants c ON b.consultant_id = c.id
-- WHERE b.is_group_session = true 
--   AND b.scheduled_at > NOW();

-- Check saved consultants for main student
-- SELECT 
--   c.name,
--   c.current_college,
--   c.rating,
--   sc.saved_at
-- FROM saved_consultants sc
-- JOIN consultants c ON sc.consultant_id = c.id
-- WHERE sc.student_id = '338feabe-39f2-492a-93e4-ee746bf727b7'
-- ORDER BY sc.saved_at DESC;