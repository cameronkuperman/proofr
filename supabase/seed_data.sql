-- Seed data for testing
-- Run this after your migrations to add test consultants

-- IMPORTANT: Before running this seed data, you need to create auth users
-- Option 1: Use Supabase Dashboard > Authentication > Users > Add User
-- Option 2: Use the SQL below to create auth users (requires service role key)

-- To create auth users via SQL (run in SQL Editor with service role):
/*
-- Example: Create auth users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'sarah.chen@harvard.edu', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'michael.johnson@stanford.edu', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'emily.patel@mit.edu', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'david.kim@yale.edu', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('55555555-5555-5555-5555-555555555555', 'test.student@gmail.com', crypt('password123', gen_salt('bf')), now(), now(), now());
*/

-- After creating auth users, run this to create profiles:

-- Create test consultant users
INSERT INTO public.users (id, email, user_type, profile_image_url, auth_provider, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'sarah.chen@harvard.edu', 'consultant', null, '{email}', true),
  ('22222222-2222-2222-2222-222222222222', 'michael.johnson@stanford.edu', 'consultant', null, '{email}', true),
  ('33333333-3333-3333-3333-333333333333', 'emily.patel@mit.edu', 'consultant', null, '{email}', true),
  ('44444444-4444-4444-4444-444444444444', 'david.kim@yale.edu', 'consultant', null, '{email}', true)
ON CONFLICT (id) DO NOTHING;

-- Create consultant profiles
INSERT INTO public.consultants (
  id, name, bio, long_bio, current_college, major, graduation_year,
  verification_status, edu_email, auto_verified, is_available,
  rating, total_reviews, total_bookings, services_preview
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Sarah Chen',
    'Harvard senior specializing in college essay reviews and interview prep.',
    'Hi! I''m Sarah, a senior at Harvard studying Economics with a minor in Creative Writing. I''ve helped over 50 students get into their dream schools, including Ivy League universities. My specialty is helping students craft compelling personal narratives that stand out.',
    'Harvard University',
    'Economics',
    2025,
    'approved',
    'sarah.chen@harvard.edu',
    true,
    true,
    4.9,
    28,
    45,
    '{"essay_review": {"min_price": 40, "description": "Professional essay feedback"}, "mock_interview": {"min_price": 60, "description": "1-hour practice interview"}}'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Michael Johnson',
    'Stanford CS student offering technical interview prep and resume reviews.',
    'I''m a Computer Science major at Stanford with internship experience at Google and Meta. I specialize in helping students prepare for technical interviews and optimize their resumes for tech companies. I''ve successfully coached 30+ students into top tech programs.',
    'Stanford University',
    'Computer Science',
    2024,
    'approved',
    'michael.johnson@stanford.edu',
    true,
    true,
    4.8,
    19,
    32,
    '{"resume_help": {"min_price": 35, "description": "Tech resume optimization"}, "mock_interview": {"min_price": 75, "description": "Technical interview practice"}}'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Emily Patel',
    'MIT Engineering student helping with STEM applications and test prep.',
    'As an MIT Mechanical Engineering student with perfect SAT scores, I help students excel in standardized tests and craft compelling STEM applications. I''ve tutored 60+ students with an average SAT score increase of 150 points.',
    'MIT',
    'Mechanical Engineering',
    2026,
    'approved',
    'emily.patel@mit.edu',
    true,
    true,
    4.7,
    15,
    25,
    '{"sat_tutoring": {"min_price": 50, "description": "SAT math and science prep"}, "application_help": {"min_price": 45, "description": "STEM application guidance"}}'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'David Kim',
    'Yale humanities student offering comprehensive application support.',
    'Yale English major and debate team captain. I specialize in helping students develop their writing voice and present compelling arguments in their applications. Former admissions committee reader with insider knowledge of what top schools look for.',
    'Yale University',
    'English Literature',
    2025,
    'approved',
    'david.kim@yale.edu',
    true,
    false, -- On vacation
    4.6,
    12,
    20,
    '{"essay_review": {"min_price": 45, "description": "Literary essay analysis"}, "school_specific_advice": {"min_price": 55, "description": "Yale application insights"}}'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  bio = EXCLUDED.bio,
  verification_status = EXCLUDED.verification_status;

-- Add services for each consultant
INSERT INTO public.services (consultant_id, service_type, title, description, prices, price_descriptions, delivery_type, standard_turnaround_hours, duration_minutes) VALUES
  -- Sarah's services
  ('11111111-1111-1111-1111-111111111111', 'essay_review', 'Essay Review & Feedback', 'Comprehensive review of your college essays with detailed feedback', ARRAY[40, 60, 80], ARRAY['Basic', 'Standard', 'Premium'], 'async', 48, null),
  ('11111111-1111-1111-1111-111111111111', 'mock_interview', 'Mock Interview Session', '1-hour mock interview with personalized feedback', ARRAY[60], ARRAY['Standard'], 'scheduled', null, 60),
  
  -- Michael's services
  ('22222222-2222-2222-2222-222222222222', 'resume_help', 'Tech Resume Optimization', 'Resume review and optimization for tech companies', ARRAY[35, 50], ARRAY['Quick Review', 'Full Optimization'], 'async', 24, null),
  ('22222222-2222-2222-2222-222222222222', 'mock_interview', 'Technical Interview Prep', 'Coding interview practice with a Stanford CS student', ARRAY[75, 100], ARRAY['1 Hour', '1.5 Hours'], 'scheduled', null, 60),
  
  -- Emily's services
  ('33333333-3333-3333-3333-333333333333', 'sat_tutoring', 'SAT Math & Science Prep', 'Personalized SAT tutoring from perfect scorer', ARRAY[50, 75], ARRAY['1 Hour', '1.5 Hours'], 'scheduled', null, 60),
  ('33333333-3333-3333-3333-333333333333', 'application_help', 'STEM Application Review', 'Complete STEM application review and strategy', ARRAY[45, 70], ARRAY['Basic', 'Comprehensive'], 'async', 72, null),
  
  -- David's services
  ('44444444-4444-4444-4444-444444444444', 'essay_review', 'Literary Essay Analysis', 'In-depth literary analysis of your essays', ARRAY[45, 65, 85], ARRAY['Basic', 'Standard', 'Premium'], 'async', 48, null),
  ('44444444-4444-4444-4444-444444444444', 'school_specific_advice', 'Yale Application Strategy', 'Insider tips for Yale applications', ARRAY[55], ARRAY['Standard'], 'scheduled', null, 45)
ON CONFLICT DO NOTHING;

-- Update consultant stats based on services
UPDATE public.consultants c
SET 
  services_preview = (
    SELECT jsonb_object_agg(
      s.service_type,
      jsonb_build_object(
        'min_price', s.prices[1],
        'description', s.title
      )
    )
    FROM public.services s
    WHERE s.consultant_id = c.id
    GROUP BY s.consultant_id
  )
WHERE c.id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444'
);

-- Create a test student user
INSERT INTO public.users (id, email, user_type, auth_provider, is_active) VALUES
  ('55555555-5555-5555-5555-555555555555', 'test.student@gmail.com', 'student', '{email}', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.students (id, name, bio, current_school, school_type, grade_level, preferred_colleges, interests, budget_range) VALUES
  (
    '55555555-5555-5555-5555-555555555555',
    'Test Student',
    'High school senior looking for college application help',
    'Lincoln High School',
    'high-school',
    'senior',
    ARRAY['Harvard', 'Stanford', 'MIT'],
    ARRAY['Computer Science', 'Engineering'],
    '[30,100]'
  )
ON CONFLICT (id) DO NOTHING;