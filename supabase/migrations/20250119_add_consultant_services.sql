-- Add comprehensive services for all consultants
-- This ensures all consultants appear on the browse page with services

-- Create services for consultants who don't have any
INSERT INTO services (id, consultant_id, service_type, title, description, prices, price_descriptions, delivery_type, standard_turnaround_hours, duration_minutes, rush_available, rush_turnarounds, max_active_orders, is_active, allows_group_sessions, max_group_size)
SELECT 
    gen_random_uuid(),
    c.id,
    service_types.type,
    service_types.title,
    service_types.description,
    service_types.prices,
    service_types.price_descriptions,
    service_types.delivery_type::delivery_type,
    service_types.turnaround,
    service_types.duration,
    service_types.rush,
    service_types.rush_turnarounds,
    service_types.max_orders,
    true,
    service_types.allows_group,
    service_types.group_size
FROM consultants c
CROSS JOIN LATERAL (
    VALUES 
        -- Essay Review Services
        ('essay_review', 
         'Comprehensive Essay Review', 
         'Get detailed feedback on your college essays with line-by-line edits, structural suggestions, and content improvements. I''ll help you craft compelling narratives that showcase your unique story.',
         ARRAY[80, 120, 150]::numeric[], 
         ARRAY['1 essay', '2 essays', 'Full package (5+ essays)'], 
         'async',
         48, 
         NULL, 
         true, 
         '{"24": 1.5, "12": 2, "6": 3}'::jsonb,
         10,
         false,
         NULL),
         
        -- Interview Preparation
        ('interview_prep', 
         'Mock Interview Session', 
         'Practice with an experienced interviewer who knows what admissions officers look for. Includes personalized feedback, common questions, and strategies to showcase your best self.',
         ARRAY[100, 150]::numeric[], 
         ARRAY['60-minute session', '90-minute intensive'], 
         'scheduled',
         NULL, 
         60, 
         false, 
         NULL,
         8,
         false,
         NULL),
         
        -- Application Strategy
        ('application_strategy', 
         'Strategic Planning Session', 
         'Complete application strategy including school selection, timeline planning, and positioning. We''ll create a roadmap tailored to your profile and goals.',
         ARRAY[150, 250]::numeric[], 
         ARRAY['90-minute consultation', 'Full package with follow-up'], 
         'scheduled',
         NULL, 
         90, 
         false, 
         NULL,
         5,
         false,
         NULL),
         
        -- SAT/ACT Tutoring (for some consultants)
        ('test_prep',
         'SAT/ACT Test Prep',
         'Personalized test prep focusing on your weak areas. Includes practice problems, test-taking strategies, and time management techniques.',
         ARRAY[75, 140]::numeric[],
         ARRAY['1 hour session', '2 hour intensive'],
         'scheduled',
         NULL,
         60,
         false,
         NULL,
         12,
         true,
         4),
         
        -- Extracurricular Planning (for some consultants)
        ('extracurricular_planning',
         'Activities & Leadership Coaching',
         'Develop a compelling extracurricular profile that aligns with your interests and strengthens your application. Includes activity selection and leadership development.',
         ARRAY[80]::numeric[],
         ARRAY['60-minute planning session'],
         'scheduled',
         NULL,
         60,
         false,
         NULL,
         6,
         false,
         NULL)
) AS service_types(type, title, description, prices, price_descriptions, delivery_type, turnaround, duration, rush, rush_turnarounds, max_orders, allows_group, group_size)
WHERE c.verification_status = 'approved'
AND NOT EXISTS (
    SELECT 1 FROM services s 
    WHERE s.consultant_id = c.id 
    AND s.service_type = service_types.type
)
-- Only add first 3 services to all consultants, last 2 to select consultants
AND (
    service_types.type IN ('essay_review', 'interview_prep', 'application_strategy')
    OR (service_types.type = 'test_prep' AND c.id IN (
        SELECT id FROM consultants 
        WHERE bio ILIKE '%SAT%' OR bio ILIKE '%ACT%' OR bio ILIKE '%test%'
        LIMIT 5
    ))
    OR (service_types.type = 'extracurricular_planning' AND c.id IN (
        SELECT id FROM consultants 
        WHERE bio ILIKE '%leadership%' OR bio ILIKE '%activities%' OR long_bio ILIKE '%extracurricular%'
        LIMIT 5
    ))
);

-- Update service statistics
UPDATE services s SET
    total_bookings = COALESCE((SELECT COUNT(*) FROM bookings b WHERE b.service_id = s.id), 0),
    avg_rating = COALESCE((SELECT AVG(b.rating) FROM bookings b WHERE b.service_id = s.id AND b.rating IS NOT NULL), NULL);

-- Log the results
DO $$
DECLARE
    v_services_count INTEGER;
    v_consultants_with_services INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_services_count FROM services;
    SELECT COUNT(DISTINCT consultant_id) INTO v_consultants_with_services FROM services;
    
    RAISE NOTICE 'Services addition complete!';
    RAISE NOTICE 'Total services: %', v_services_count;
    RAISE NOTICE 'Consultants with services: %', v_consultants_with_services;
END $$;