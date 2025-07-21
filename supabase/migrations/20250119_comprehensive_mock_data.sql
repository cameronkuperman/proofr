-- Comprehensive Mock Data for Proofr Marketplace
-- This migration populates all tables with realistic, cross-referenced data
-- Simulating several weeks of marketplace operation

-- Note: This file is split from the larger comprehensive_mock_data.sql 
-- to work within Supabase migration constraints

-- Fix the broken trigger first
CREATE OR REPLACE FUNCTION update_author_guide_stats()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    UPDATE students 
    SET 
      guides_published = guides_published + 1,
      is_guide_contributor = true
    WHERE id = NEW.author_id;  -- Fixed: was user_id, should be id
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- First check if we've already run this migration
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE id = '11111111-1111-1111-1111-111111111111') THEN
        RAISE NOTICE 'Mock data already exists, skipping...';
        RETURN;
    END IF;
END $$;

-- Create Services for existing consultants who don't have any
INSERT INTO services (id, consultant_id, service_type, title, description, prices, price_descriptions, delivery_type, standard_turnaround_hours, duration_minutes, rush_available, rush_turnarounds, max_active_orders, is_active, allows_group_sessions, max_group_size)
SELECT 
    gen_random_uuid(),
    c.id,
    service_types.type,
    service_types.title,
    service_types.description,
    service_types.prices,
    service_types.price_descriptions,
    service_types.delivery_type,
    service_types.turnaround,
    service_types.duration,
    service_types.rush,
    service_types.rush_turnarounds,
    5,
    true,
    false,
    NULL
FROM consultants c
CROSS JOIN (
    VALUES 
        ('essay_review', 'Comprehensive Essay Review', 'Get detailed feedback on your college essays', ARRAY[80, 120, 150]::numeric[], ARRAY['1 essay', '2 essays', 'Full package'], 'async'::delivery_type, 48, NULL, true, '{"24": 1.5, "12": 2}'::jsonb),
        ('interview_prep', 'Mock Interview Session', 'Practice with an experienced interviewer', ARRAY[100]::numeric[], ARRAY['60-minute session'], 'scheduled'::delivery_type, NULL, 60, false, NULL),
        ('application_strategy', 'Strategic Planning Session', 'Complete application strategy and timeline', ARRAY[150]::numeric[], ARRAY['90-minute consultation'], 'scheduled'::delivery_type, NULL, 90, false, NULL)
) AS service_types(type, title, description, prices, price_descriptions, delivery_type, turnaround, duration, rush, rush_turnarounds)
WHERE c.verification_status = 'approved'
AND NOT EXISTS (
    SELECT 1 FROM services s 
    WHERE s.consultant_id = c.id 
    AND s.service_type = service_types.type
)
LIMIT 30;

-- Create sample bookings for existing students and consultants
WITH available_services AS (
    SELECT s.*
    FROM services s
    JOIN consultants c ON s.consultant_id = c.id
    WHERE s.is_active = true
    AND c.is_available = true
),
booking_pairs AS (
    SELECT 
        st.id as student_id,
        s.consultant_id,
        s.id as service_id,
        s.prices[1] as base_price,
        s.price_descriptions[1] as price_tier,
        RANDOM() as status_rand,
        (NOW() - (RANDOM() * INTERVAL '30 days')) as booking_created_at,
        ROW_NUMBER() OVER (PARTITION BY st.id ORDER BY RANDOM()) as rn
    FROM students st
    CROSS JOIN available_services s
    WHERE NOT EXISTS (
        SELECT 1 FROM bookings b 
        WHERE b.student_id = st.id 
        AND b.consultant_id = s.consultant_id
    )
)
INSERT INTO bookings (id, student_id, consultant_id, service_id, base_price, price_tier, rush_multiplier, final_price, prompt_text, status, created_at, promised_delivery_at, completed_at, delivered_at)
SELECT 
    gen_random_uuid(),
    student_id,
    consultant_id,
    service_id,
    base_price,
    price_tier,
    1,
    base_price,
    'Need help with my college application essays and strategy',
    CASE 
        WHEN status_rand < 0.6 THEN 'completed'::booking_status
        WHEN status_rand < 0.8 THEN 'in_progress'::booking_status
        ELSE 'confirmed'::booking_status
    END,
    booking_created_at,
    booking_created_at + INTERVAL '3 days',
    -- Set completed_at for completed bookings
    CASE 
        WHEN status_rand < 0.6 THEN booking_created_at + INTERVAL '2 days'
        ELSE NULL
    END,
    -- Set delivered_at for completed bookings
    CASE 
        WHEN status_rand < 0.6 THEN booking_created_at + INTERVAL '2 days'
        ELSE NULL
    END
FROM booking_pairs
WHERE rn = 1
AND RANDOM() < 0.3  -- Only create bookings for 30% of possible pairs
LIMIT 50;

-- Update completed bookings with reviews
UPDATE bookings 
SET 
    delivered_at = created_at + INTERVAL '2 days',
    completed_at = created_at + INTERVAL '2 days',
    rating = FLOOR(4 + RANDOM() * 2)::integer,  -- Ratings between 4-5
    review_text = CASE FLOOR(RANDOM() * 5)::integer
        WHEN 0 THEN 'Excellent feedback! Really helped improve my essays.'
        WHEN 1 THEN 'Great insights and very responsive. Highly recommend!'
        WHEN 2 THEN 'Very helpful session. Gave me clarity on my application strategy.'
        WHEN 3 THEN 'Professional and knowledgeable. Worth every penny!'
        ELSE 'Amazing consultant! Helped me get into my dream school.'
    END,
    reviewed_at = created_at + INTERVAL '3 days'
WHERE status = 'completed'
AND rating IS NULL;

-- Create user interactions
INSERT INTO user_interactions (student_id, consultant_id, interaction_type, service_type, created_at)
SELECT 
    s.id,
    c.id,
    interaction_types.type::interaction_type,
    CASE 
        WHEN interaction_types.type = 'viewed' 
        THEN (SELECT service_type FROM services WHERE consultant_id = c.id LIMIT 1)
        ELSE NULL
    END,
    NOW() - (RANDOM() * INTERVAL '30 days')
FROM students s
CROSS JOIN consultants c
CROSS JOIN (VALUES ('viewed'), ('booked')) AS interaction_types(type)
WHERE c.is_available = true
AND RANDOM() < 0.1  -- 10% chance of interaction
LIMIT 200
ON CONFLICT DO NOTHING;

-- Create student guides if none exist
INSERT INTO student_guides (id, author_id, title, slug, description, category, difficulty, content, read_time, word_count, status, moderation_score, published_at, view_count, helpful_count, tags, meta_description, featured, version, created_at)
SELECT
    gen_random_uuid(),
    s.id,
    guide_templates.title,
    guide_templates.slug || '-' || SUBSTRING(s.id::text, 1, 8),
    guide_templates.description,
    guide_templates.category,
    guide_templates.difficulty,
    guide_templates.content,
    guide_templates.read_time,
    guide_templates.word_count,
    'published'::guide_status,
    0.85 + RANDOM() * 0.15,  -- Score between 0.85-1.0
    NOW() - (RANDOM() * INTERVAL '30 days'),
    FLOOR(RANDOM() * 5000)::integer,
    FLOOR(RANDOM() * 500)::integer,
    guide_templates.tags,
    guide_templates.description,
    RANDOM() < 0.2,  -- 20% chance of being featured
    1,
    NOW() - (RANDOM() * INTERVAL '30 days')
FROM students s
CROSS JOIN (
    VALUES 
        ('My Journey to MIT', 'my-journey-to-mit', 'How I got accepted to MIT with average grades', 'applications'::guide_category, 'intermediate'::guide_difficulty, 
         '{"sections": [{"title": "Starting Point", "content": "My GPA was only 3.7..."}, {"title": "The Turning Point", "content": "When I discovered my passion for robotics..."}]}'::jsonb,
         12, 2400, ARRAY['mit', 'stem', 'robotics', 'essays']),
        ('Financial Aid Success', 'financial-aid-success', 'How I secured full financial aid as an international student', 'financial_aid'::guide_category, 'beginner'::guide_difficulty,
         '{"sections": [{"title": "Understanding Need", "content": "The difference between need-blind and need-aware..."}, {"title": "CSS Profile Tips", "content": "Common mistakes to avoid..."}]}'::jsonb,
         10, 2000, ARRAY['financial-aid', 'international', 'css-profile']),
        ('From Community College to Ivy', 'community-college-to-ivy', 'My transfer journey to Columbia', 'transfer'::guide_category, 'advanced'::guide_difficulty,
         '{"sections": [{"title": "Why CC First", "content": "The strategic advantages..."}, {"title": "Building Your Profile", "content": "What Ivies look for in transfers..."}]}'::jsonb,
         15, 3000, ARRAY['transfer', 'community-college', 'ivy-league'])
) AS guide_templates(title, slug, description, category, difficulty, content, read_time, word_count, tags)
WHERE NOT EXISTS (SELECT 1 FROM student_guides WHERE author_id = s.id)
AND RANDOM() < 0.3  -- 30% of students create guides
LIMIT 10;

-- Add guide interactions
INSERT INTO guide_interactions (guide_id, user_id, viewed, viewed_at, read_progress, bookmarked, found_helpful, rating, created_at)
SELECT 
    g.id,
    u.id,
    true,
    NOW() - (RANDOM() * INTERVAL '20 days'),
    FLOOR(RANDOM() * 100)::decimal,
    RANDOM() < 0.3,
    RANDOM() < 0.5,
    CASE WHEN RANDOM() < 0.7 THEN FLOOR(4 + RANDOM() * 2)::integer ELSE NULL END,
    NOW() - (RANDOM() * INTERVAL '20 days')
FROM student_guides g
CROSS JOIN users u
WHERE u.user_type = 'student'
AND RANDOM() < 0.2  -- 20% chance of interaction
LIMIT 100
ON CONFLICT DO NOTHING;

-- Create discount codes (with a system user as creator)
INSERT INTO discount_codes (id, code, description, discount_type, discount_value, minimum_purchase, valid_from, valid_until, max_uses, used_count, is_active, created_by, created_at)
VALUES 
    (gen_random_uuid(), 'LAUNCH2024', 'Launch discount for new users', 'percentage', 15, 75, NOW() - INTERVAL '30 days', NOW() + INTERVAL '30 days', 500, 0, true, (SELECT id FROM users WHERE user_type = 'consultant' LIMIT 1), NOW() - INTERVAL '30 days'),
    (gen_random_uuid(), 'EARLYBIRD', 'Early bird special for 2025 applicants', 'percentage', 20, 100, NOW() - INTERVAL '14 days', NOW() + INTERVAL '60 days', 200, 0, true, (SELECT id FROM users WHERE user_type = 'consultant' LIMIT 1), NOW() - INTERVAL '14 days'),
    (gen_random_uuid(), 'REFER10', 'Referral program discount', 'fixed', 10, 50, NOW() - INTERVAL '7 days', NOW() + INTERVAL '90 days', 1000, 0, true, (SELECT id FROM users WHERE user_type = 'consultant' LIMIT 1), NOW() - INTERVAL '7 days')
ON CONFLICT DO NOTHING;

-- Update consultant and service statistics
UPDATE consultants c SET
    total_bookings = COALESCE((SELECT COUNT(*) FROM bookings b WHERE b.consultant_id = c.id AND b.status = 'completed' AND b.completed_at IS NOT NULL), 0),
    total_earnings = COALESCE((SELECT SUM(b.final_price * 0.8) FROM bookings b WHERE b.consultant_id = c.id AND b.status = 'completed' AND b.completed_at IS NOT NULL), 0),
    rating = COALESCE((SELECT AVG(b.rating) FROM bookings b WHERE b.consultant_id = c.id AND b.rating IS NOT NULL), 0),
    total_reviews = COALESCE((SELECT COUNT(*) FROM bookings b WHERE b.consultant_id = c.id AND b.rating IS NOT NULL), 0),
    profile_views = COALESCE((SELECT COUNT(*) FROM user_interactions ui WHERE ui.consultant_id = c.id AND ui.interaction_type = 'viewed'), 0),
    last_active = NOW() - (RANDOM() * INTERVAL '7 days')
WHERE verification_status = 'approved';

UPDATE services s SET
    total_bookings = COALESCE((SELECT COUNT(*) FROM bookings b WHERE b.service_id = s.id), 0),
    avg_rating = COALESCE((SELECT AVG(b.rating) FROM bookings b WHERE b.service_id = s.id AND b.rating IS NOT NULL), NULL);

-- Update student credit balances (credits_earned is auto-calculated as final_price * 0.02)
UPDATE students s SET
    credit_balance = COALESCE((SELECT SUM(b.final_price * 0.02) FROM bookings b WHERE b.student_id = s.id AND b.status = 'completed' AND b.completed_at IS NOT NULL), 0),
    lifetime_credits_earned = COALESCE((SELECT SUM(b.final_price * 0.02) FROM bookings b WHERE b.student_id = s.id AND b.status = 'completed' AND b.completed_at IS NOT NULL), 0);

-- Update guide statistics
UPDATE student_guides g SET
    view_count = COALESCE((SELECT COUNT(*) FROM guide_interactions gi WHERE gi.guide_id = g.id AND gi.viewed = true), 0),
    helpful_count = COALESCE((SELECT COUNT(*) FROM guide_interactions gi WHERE gi.guide_id = g.id AND gi.found_helpful = true), 0),
    avg_rating = COALESCE((SELECT AVG(gi.rating) FROM guide_interactions gi WHERE gi.guide_id = g.id AND gi.rating IS NOT NULL), NULL);

-- Final summary
DO $$
DECLARE
    v_users_count INTEGER;
    v_students_count INTEGER;
    v_consultants_count INTEGER;
    v_services_count INTEGER;
    v_bookings_count INTEGER;
    v_guides_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_users_count FROM users;
    SELECT COUNT(*) INTO v_students_count FROM students;
    SELECT COUNT(*) INTO v_consultants_count FROM consultants;
    SELECT COUNT(*) INTO v_services_count FROM services;
    SELECT COUNT(*) INTO v_bookings_count FROM bookings;
    SELECT COUNT(*) INTO v_guides_count FROM student_guides;
    
    RAISE NOTICE 'Mock data population complete!';
    RAISE NOTICE 'Total users: %', v_users_count;
    RAISE NOTICE 'Total students: %', v_students_count;
    RAISE NOTICE 'Total consultants: %', v_consultants_count;
    RAISE NOTICE 'Total services: %', v_services_count;
    RAISE NOTICE 'Total bookings: %', v_bookings_count;
    RAISE NOTICE 'Total guides: %', v_guides_count;
END $$;