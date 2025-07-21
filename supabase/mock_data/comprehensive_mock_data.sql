-- Comprehensive Mock Data for Proofr Marketplace
-- This script populates all tables with realistic, cross-referenced data
-- Simulating several weeks of marketplace operation

-- Clear existing data (in correct order due to foreign key constraints)
TRUNCATE TABLE collection_guides CASCADE;
TRUNCATE TABLE guide_collections CASCADE;
TRUNCATE TABLE guide_service_links CASCADE;
TRUNCATE TABLE guide_relations CASCADE;
TRUNCATE TABLE guide_resources CASCADE;
TRUNCATE TABLE guide_comments CASCADE;
TRUNCATE TABLE guide_interactions CASCADE;
TRUNCATE TABLE guide_sections CASCADE;
TRUNCATE TABLE student_guides CASCADE;
TRUNCATE TABLE group_session_participants CASCADE;
TRUNCATE TABLE consultant_waitlist CASCADE;
TRUNCATE TABLE user_interactions CASCADE;
TRUNCATE TABLE discount_usage CASCADE;
TRUNCATE TABLE discount_codes CASCADE;
TRUNCATE TABLE bookings CASCADE;
TRUNCATE TABLE services CASCADE;
TRUNCATE TABLE verification_queue CASCADE;
TRUNCATE TABLE consultants CASCADE;
TRUNCATE TABLE students CASCADE;
TRUNCATE TABLE user_theme_preferences CASCADE;
TRUNCATE TABLE users CASCADE;

-- Create Users (mix of students and consultants)
-- Note: In production, these would come from Supabase Auth
INSERT INTO users (id, email, phone, user_type, profile_image_url, auth_provider, is_active, last_login, created_at) VALUES
-- Students (50 total)
('11111111-1111-1111-1111-111111111111', 'emma.johnson@gmail.com', '+14155551001', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', ARRAY['email'], true, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '45 days'),
('11111111-1111-1111-1111-111111111112', 'liam.davis@yahoo.com', '+14155551002', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=liam', ARRAY['google'], true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '40 days'),
('11111111-1111-1111-1111-111111111113', 'sophia.martinez@hotmail.com', '+14155551003', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia', ARRAY['email'], true, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '38 days'),
('11111111-1111-1111-1111-111111111114', 'noah.garcia@gmail.com', '+14155551004', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=noah', ARRAY['google'], true, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '35 days'),
('11111111-1111-1111-1111-111111111115', 'olivia.rodriguez@icloud.com', '+14155551005', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia', ARRAY['apple'], true, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '33 days'),
('11111111-1111-1111-1111-111111111116', 'ethan.wilson@gmail.com', NULL, 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ethan', ARRAY['google'], true, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '30 days'),
('11111111-1111-1111-1111-111111111117', 'ava.anderson@outlook.com', '+14155551007', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ava', ARRAY['email'], true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '28 days'),
('11111111-1111-1111-1111-111111111118', 'mason.thomas@gmail.com', '+14155551008', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mason', ARRAY['google'], true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '25 days'),
('11111111-1111-1111-1111-111111111119', 'isabella.taylor@yahoo.com', NULL, 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=isabella', ARRAY['email'], true, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '22 days'),
('11111111-1111-1111-1111-111111111120', 'william.moore@gmail.com', '+14155551010', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=william', ARRAY['google'], true, NOW() - INTERVAL '8 hours', NOW() - INTERVAL '20 days'),
('11111111-1111-1111-1111-111111111121', 'mia.jackson@icloud.com', '+14155551011', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mia', ARRAY['apple'], true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '18 days'),
('11111111-1111-1111-1111-111111111122', 'james.martin@gmail.com', '+14155551012', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', ARRAY['google'], true, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '15 days'),
('11111111-1111-1111-1111-111111111123', 'charlotte.lee@outlook.com', NULL, 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlotte', ARRAY['email'], true, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '12 days'),
('11111111-1111-1111-1111-111111111124', 'benjamin.perez@gmail.com', '+14155551014', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=benjamin', ARRAY['google'], true, NOW() - INTERVAL '4 days', NOW() - INTERVAL '10 days'),
('11111111-1111-1111-1111-111111111125', 'amelia.thompson@yahoo.com', '+14155551015', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=amelia', ARRAY['email'], true, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '8 days'),
('11111111-1111-1111-1111-111111111126', 'lucas.white@gmail.com', '+14155551016', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucas', ARRAY['google'], true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '6 days'),
('11111111-1111-1111-1111-111111111127', 'harper.harris@icloud.com', NULL, 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=harper', ARRAY['apple'], true, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 days'),
('11111111-1111-1111-1111-111111111128', 'alexander.clark@gmail.com', '+14155551018', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexander', ARRAY['google'], true, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '4 days'),
('11111111-1111-1111-1111-111111111129', 'evelyn.lewis@outlook.com', '+14155551019', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=evelyn', ARRAY['email'], true, NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '3 days'),
('11111111-1111-1111-1111-111111111130', 'henry.robinson@gmail.com', '+14155551020', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=henry', ARRAY['google'], true, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '2 days'),

-- Consultants (15 from top universities)
('22222222-2222-2222-2222-222222222221', 'sarah.chen@stanford.edu', '+16505551001', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarahchen', ARRAY['email'], true, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '60 days'),
('22222222-2222-2222-2222-222222222222', 'michael.kumar@harvard.edu', '+16175551002', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=michaelkumar', ARRAY['email'], true, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '55 days'),
('22222222-2222-2222-2222-222222222223', 'jessica.park@mit.edu', '+16175551003', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessicapark', ARRAY['email'], true, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '50 days'),
('22222222-2222-2222-2222-222222222224', 'david.williams@yale.edu', '+12035551004', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=davidwilliams', ARRAY['email'], true, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '45 days'),
('22222222-2222-2222-2222-222222222225', 'emily.zhang@princeton.edu', '+16095551005', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=emilyzhang', ARRAY['email'], true, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '40 days'),
('22222222-2222-2222-2222-222222222226', 'robert.smith@columbia.edu', '+12125551006', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=robertsmith', ARRAY['email'], true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '35 days'),
('22222222-2222-2222-2222-222222222227', 'amanda.jones@upenn.edu', '+12155551007', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=amandajones', ARRAY['email'], true, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '30 days'),
('22222222-2222-2222-2222-222222222228', 'kevin.brown@caltech.edu', '+16265551008', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=kevinbrown', ARRAY['email'], true, NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '25 days'),
('22222222-2222-2222-2222-222222222229', 'michelle.davis@duke.edu', '+19195551009', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=michelledavis', ARRAY['email'], true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '20 days'),
('22222222-2222-2222-2222-222222222230', 'christopher.nguyen@northwestern.edu', '+18475551010', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=christophernguyen', ARRAY['email'], true, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '15 days'),
('22222222-2222-2222-2222-222222222231', 'lauren.wilson@brown.edu', '+14015551011', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=laurenwilson', ARRAY['email'], true, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '12 days'),
('22222222-2222-2222-2222-222222222232', 'daniel.martinez@cornell.edu', '+16075551012', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=danielmartinez', ARRAY['email'], true, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '10 days'),
('22222222-2222-2222-2222-222222222233', 'sophia.taylor@dartmouth.edu', '+16035551013', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophiataylor', ARRAY['email'], true, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '8 days'),
('22222222-2222-2222-2222-222222222234', 'andrew.lee@vanderbilt.edu', '+16155551014', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=andrewlee', ARRAY['email'], true, NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '5 days'),
('22222222-2222-2222-2222-222222222235', 'natalie.garcia@rice.edu', '+17135551015', 'consultant', 'https://api.dicebear.com/7.x/avataaars/svg?seed=nataliegarcia', ARRAY['email'], true, NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '3 days');

-- Create Student Profiles with realistic data
INSERT INTO students (id, name, bio, current_school, school_type, grade_level, target_application_year, preferred_colleges, interests, pain_points, budget_range, credit_balance, lifetime_credits_earned, onboarding_completed, onboarding_step) VALUES
('11111111-1111-1111-1111-111111111111', 'Emma Johnson', 'Aspiring pre-med student passionate about neuroscience and research', 'Westview High School', 'high-school', 'senior', 2024, ARRAY['Stanford', 'Harvard', 'Johns Hopkins', 'UCLA'], ARRAY['neuroscience', 'pre-med', 'research', 'biology'], ARRAY['essay_writing', 'interview_prep', 'research_opportunities'], '[75, 150]', 45.60, 45.60, true, 6),
('11111111-1111-1111-1111-111111111112', 'Liam Davis', 'Math enthusiast aiming for top engineering programs', 'Thomas Jefferson High School', 'high-school', 'senior', 2024, ARRAY['MIT', 'Caltech', 'Carnegie Mellon', 'Georgia Tech'], ARRAY['mathematics', 'computer_science', 'robotics'], ARRAY['sat_prep', 'essay_writing', 'extracurricular_planning'], '[50, 100]', 28.40, 28.40, true, 6),
('11111111-1111-1111-1111-111111111113', 'Sophia Martinez', 'International student interested in business and entrepreneurship', 'International School of Barcelona', 'high-school', 'senior', 2024, ARRAY['Wharton', 'Harvard Business', 'Stanford', 'NYU Stern'], ARRAY['business', 'entrepreneurship', 'finance', 'marketing'], ARRAY['application_strategy', 'financial_aid', 'visa_guidance'], '[100, 200]', 62.80, 62.80, true, 6),
('11111111-1111-1111-1111-111111111114', 'Noah Garcia', 'Computer science enthusiast with startup experience', 'Phillips Academy', 'high-school', 'senior', 2024, ARRAY['Stanford', 'MIT', 'UC Berkeley', 'CMU'], ARRAY['computer_science', 'ai_ml', 'startups', 'app_development'], ARRAY['essay_writing', 'portfolio_review'], '[80, 150]', 38.20, 38.20, true, 6),
('11111111-1111-1111-1111-111111111115', 'Olivia Rodriguez', 'First-generation college student interested in social justice', 'Central High School', 'high-school', 'senior', 2024, ARRAY['Yale', 'Brown', 'Columbia', 'UC Berkeley'], ARRAY['political_science', 'law', 'social_justice', 'public_policy'], ARRAY['financial_aid', 'essay_writing', 'college_selection'], '[40, 80]', 18.60, 18.60, true, 6),
('11111111-1111-1111-1111-111111111116', 'Ethan Wilson', 'Transfer student from community college', 'Santa Monica College', 'college', 'sophomore', 2025, ARRAY['UCLA', 'UC Berkeley', 'USC', 'NYU'], ARRAY['film', 'media_studies', 'creative_writing'], ARRAY['transfer_essays', 'application_timeline'], '[60, 120]', 22.40, 22.40, true, 6),
('11111111-1111-1111-1111-111111111117', 'Ava Anderson', 'STEM-focused student with research publications', 'Stuyvesant High School', 'high-school', 'senior', 2024, ARRAY['MIT', 'Harvard', 'Princeton', 'Stanford'], ARRAY['physics', 'quantum_computing', 'research'], ARRAY['research_opportunities', 'interview_prep'], '[100, 200]', 88.90, 88.90, true, 6),
('11111111-1111-1111-1111-111111111118', 'Mason Thomas', 'Student athlete balancing sports and academics', 'Oak Park High School', 'high-school', 'junior', 2025, ARRAY['Duke', 'Stanford', 'Northwestern', 'Vanderbilt'], ARRAY['economics', 'sports_management', 'basketball'], ARRAY['athletic_recruitment', 'time_management', 'essay_writing'], '[75, 150]', 15.80, 15.80, true, 6),
('11111111-1111-1111-1111-111111111119', 'Isabella Taylor', 'Art student seeking top design programs', 'LaGuardia Arts High School', 'high-school', 'senior', 2024, ARRAY['RISD', 'Parsons', 'Pratt', 'CalArts'], ARRAY['graphic_design', 'digital_art', 'ui_ux'], ARRAY['portfolio_prep', 'art_supplements'], '[50, 100]', 34.60, 34.60, true, 6),
('11111111-1111-1111-1111-111111111120', 'William Moore', 'Pre-law student with debate experience', 'Exeter Academy', 'high-school', 'senior', 2024, ARRAY['Harvard', 'Yale', 'Columbia', 'University of Chicago'], ARRAY['law', 'debate', 'philosophy', 'political_science'], ARRAY['essay_writing', 'interview_prep', 'school_selection'], '[80, 160]', 52.30, 52.30, true, 6);

-- Create Consultant Profiles with detailed information
INSERT INTO consultants (id, name, bio, long_bio, current_college, colleges_attended, major, graduation_year, verification_status, verified_at, verified_by, verification_method, edu_email, auto_verified, is_available, vacation_mode, services_preview, supports_rush_delivery, rush_multipliers, rating, total_reviews, total_bookings, total_earnings, response_time_hours, timezone, calendly_url, profile_views) VALUES
('22222222-2222-2222-2222-222222222221', 'Sarah Chen', 'Stanford CS student | 1590 SAT | Published ML researcher', 
'Hi! I''m Sarah, a junior at Stanford studying Computer Science with a focus on AI/ML. I''ve been through the intense college application process and understand how overwhelming it can be. I scored 1590 on my SAT (800 Math, 790 English) and was accepted to Stanford, MIT, Harvard, and Princeton. I''ve published two papers in ML conferences and interned at Google Brain. I specialize in helping STEM students craft compelling narratives that showcase both technical excellence and personal growth. Let me help you stand out!',
'Stanford University', '[{"name": "Stanford University", "degree": "BS Computer Science", "years": "2022-2026"}]', 'Computer Science', 2026, 'approved', NOW() - INTERVAL '59 days', NULL, 'edu_email', 'sarah.chen@stanford.edu', true, true, false,
'{"essay_review": "$80-150", "interview_prep": "$100/hr", "full_application": "$500"}', true, '{"1.5": 24, "2": 12, "3": 6}', 4.9, 47, 52, 12400.00, 2.5, 'America/Los_Angeles', 'https://calendly.com/sarahchen-stanford', 1847),

('22222222-2222-2222-2222-222222222222', 'Michael Kumar', 'Harvard Economics | Rhodes Scholar | Investment Banking', 
'I''m Michael, a senior at Harvard studying Economics with a minor in Statistics. As a Rhodes Scholar and former Goldman Sachs summer analyst, I bring a unique perspective to college consulting. I scored 1580 on the SAT and 36 on the ACT. I was accepted to all 8 Ivy League schools and specialize in helping students interested in business, finance, and economics. My approach focuses on highlighting leadership experiences and quantifiable achievements while maintaining authenticity. I''ve helped over 100 students gain admission to top universities.',
'Harvard University', '[{"name": "Harvard University", "degree": "BA Economics", "years": "2021-2025"}]', 'Economics', 2025, 'approved', NOW() - INTERVAL '54 days', NULL, 'edu_email', 'michael.kumar@harvard.edu', true, true, false,
'{"essay_review": "$100-200", "strategy_session": "$150/hr", "mock_interview": "$120/hr"}', true, '{"1.5": 24, "2": 12, "3": 6}', 4.95, 89, 98, 28600.00, 1.8, 'America/New_York', 'https://calendly.com/mkumar-harvard', 3254),

('22222222-2222-2222-2222-222222222223', 'Jessica Park', 'MIT Engineer | Intel ISEF Winner | Women in STEM Advocate', 
'Hey there! I''m Jessica, a junior at MIT studying Electrical Engineering and Computer Science. As an Intel ISEF grand prize winner and Regeneron STS finalist, I understand what it takes to stand out in STEM applications. I''m passionate about helping students, especially young women, navigate the competitive world of STEM admissions. I offer specialized guidance on research presentations, science competitions, and technical portfolios. Let''s work together to showcase your unique contributions to science!',
'MIT', '[{"name": "MIT", "degree": "BS EECS", "years": "2022-2026"}]', 'Electrical Engineering and Computer Science', 2026, 'approved', NOW() - INTERVAL '49 days', NULL, 'edu_email', 'jessica.park@mit.edu', true, true, false,
'{"research_guidance": "$120", "essay_review": "$90", "full_stem_package": "$600"}', true, '{"1.5": 24, "2": 12}', 4.85, 34, 38, 8900.00, 3.2, 'America/New_York', 'https://calendly.com/jpark-mit', 1523),

('22222222-2222-2222-2222-222222222224', 'David Williams', 'Yale Pre-Med | MCAT 99th percentile | Published Author', 
'I''m David, a senior at Yale on the pre-med track with a 3.98 GPA. I scored in the 99th percentile on the MCAT and have been accepted to multiple top medical school programs. Beyond academics, I''ve published a book on healthcare accessibility and founded a nonprofit providing free health screenings. I specialize in helping pre-med students craft compelling narratives that go beyond grades and test scores. Whether you need help with essays, interviews, or building a strong pre-med profile, I''m here to guide you.',
'Yale University', '[{"name": "Yale University", "degree": "BS Molecular Biology", "years": "2021-2025"}]', 'Molecular Biology', 2025, 'approved', NOW() - INTERVAL '44 days', NULL, 'edu_email', 'david.williams@yale.edu', true, true, false,
'{"essay_package": "$120-180", "interview_prep": "$110/hr", "pre_med_planning": "$130/hr"}', false, NULL, 4.88, 56, 62, 14200.00, 2.1, 'America/New_York', 'https://calendly.com/dwilliams-yale', 2187),

('22222222-2222-2222-2222-222222222225', 'Emily Zhang', 'Princeton Public Policy | UN Youth Delegate | Fulbright Semi-Finalist', 
'Hello! I''m Emily, studying Public Policy at Princeton with a focus on international relations. As a former UN Youth Delegate and Fulbright semi-finalist, I''ve navigated complex application processes successfully. I was accepted to Princeton, Harvard, Yale, and Georgetown. I specialize in helping students interested in public service, international relations, and social impact careers. My approach emphasizes authentic storytelling and connecting personal experiences to larger global issues.',
'Princeton University', '[{"name": "Princeton University", "degree": "BA Public Policy", "years": "2022-2026"}]', 'Public Policy', 2026, 'approved', NOW() - INTERVAL '39 days', NULL, 'edu_email', 'emily.zhang@princeton.edu', true, true, false,
'{"essay_review": "$85-140", "strategy_consultation": "$100/hr", "interview_coaching": "$95/hr"}', true, '{"1.5": 24, "2": 12, "3": 6}', 4.92, 41, 45, 9800.00, 2.8, 'America/New_York', 'https://calendly.com/ezhang-princeton', 1876);

-- Create Services for Consultants
INSERT INTO services (id, consultant_id, service_type, title, description, prices, price_descriptions, delivery_type, standard_turnaround_hours, duration_minutes, rush_available, rush_turnarounds, max_active_orders, is_active, allows_group_sessions, max_group_size, total_bookings, avg_rating) VALUES
-- Sarah Chen's Services
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222221', 'essay_review', 'Comprehensive Essay Review & Editing', 
'Get detailed feedback on your college essays from a Stanford student who knows what admissions officers look for. I''ll help you craft compelling narratives that showcase your unique voice while ensuring technical excellence. Includes line-by-line edits, structural suggestions, and strategies to make your essay memorable.',
ARRAY[80, 120, 150], ARRAY['Basic review (1 essay)', 'Standard (2 essays)', 'Premium (full Common App)'], 'async', 48, NULL, true, '{"24": 1.5, "12": 2, "6": 3}', 5, true, false, NULL, 28, 4.9),

('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222221', 'interview_prep', 'Mock Interview & Coaching Session', 
'Practice with someone who''s been through interviews at top tech companies and universities. I''ll simulate real interview conditions, provide detailed feedback, and share strategies that helped me succeed at Stanford, Google, and more.',
ARRAY[100], ARRAY['60-minute session with feedback report'], 'scheduled', NULL, 60, false, NULL, 8, true, false, NULL, 15, 4.85),

('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222221', 'test_prep', 'SAT Math Intensive Tutoring', 
'Scored 800 on SAT Math? I''ll share my strategies and help you master even the trickiest problems. Includes personalized study plan, practice materials, and proven techniques for time management.',
ARRAY[120], ARRAY['90-minute intensive session'], 'scheduled', NULL, 90, false, NULL, 6, true, true, 3, 9, 4.95),

-- Michael Kumar's Services
('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222222', 'essay_review', 'Ivy League Essay Package', 
'Accepted to all 8 Ivies? Let me help you craft essays that stand out. I specialize in helping students articulate their business/finance interests while demonstrating intellectual curiosity and leadership potential.',
ARRAY[100, 150, 200], ARRAY['Single essay', '3 essays', 'Full application'], 'async', 72, NULL, true, '{"24": 1.5, "12": 2, "6": 3}', 4, true, false, NULL, 42, 4.95),

('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222222', 'application_strategy', 'Complete Application Strategy Session', 
'Comprehensive strategy session covering school selection, timeline planning, essay brainstorming, and extracurricular positioning. Includes follow-up action plan and resource recommendations.',
ARRAY[150], ARRAY['90-minute deep dive + written plan'], 'scheduled', NULL, 90, false, NULL, 5, true, false, NULL, 31, 4.97),

('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222222', 'interview_prep', 'Investment Banking Interview Prep', 
'Leverage my Goldman Sachs experience for your college interviews. I''ll help you present your business interests professionally while maintaining authenticity. Includes case study practice.',
ARRAY[120], ARRAY['60-minute mock + feedback'], 'scheduled', NULL, 60, false, NULL, 6, true, false, NULL, 25, 4.92),

-- Jessica Park's Services  
('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222223', 'extracurricular_planning', 'STEM Research Project Guidance', 
'Intel ISEF winner guides you through developing a compelling research project. From ideation to presentation, I''ll help you create research that stands out in admissions.',
ARRAY[120], ARRAY['Full project consultation'], 'async', 96, NULL, true, '{"24": 1.5, "12": 2}', 3, true, false, NULL, 18, 4.88),

('33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222223', 'essay_review', 'STEM-Focused Essay Review', 
'Specialized essay review for STEM applicants. I''ll help you balance technical achievements with personal narrative, making complex research accessible and compelling.',
ARRAY[90], ARRAY['Comprehensive review + STEM positioning'], 'async', 48, NULL, true, '{"24": 1.5, "12": 2}', 4, true, false, NULL, 20, 4.85),

-- David Williams' Services
('33333333-3333-3333-3333-333333333309', '22222222-2222-2222-2222-222222222224', 'essay_review', 'Pre-Med Essay Excellence Package', 
'Craft compelling narratives that showcase your journey to medicine. I''ll help you articulate your motivations, clinical experiences, and vision for healthcare in a way that resonates with admissions committees.',
ARRAY[120, 150, 180], ARRAY['Single essay', '2-3 essays', 'Full AMCAS/Common App'], 'async', 72, NULL, false, NULL, 4, true, false, NULL, 35, 4.89),

('33333333-3333-3333-3333-333333333310', '22222222-2222-2222-2222-222222222224', 'interview_prep', 'Medical School Interview Mastery', 
'Comprehensive MMI and traditional interview preparation. Drawing from my successful med school interviews, I''ll help you tackle ethical scenarios, behavioral questions, and articulate your passion for medicine.',
ARRAY[110], ARRAY['75-minute session + feedback guide'], 'scheduled', NULL, 75, false, NULL, 5, true, true, 2, 27, 4.91),

-- Emily Zhang's Services
('33333333-3333-3333-3333-333333333311', '22222222-2222-2222-2222-222222222225', 'essay_review', 'Global Impact Essay Coaching', 
'Transform your international experiences and social impact work into compelling narratives. Perfect for students interested in international relations, public policy, or global health.',
ARRAY[85, 120, 140], ARRAY['Quick review', 'Standard package', 'Comprehensive edit'], 'async', 48, NULL, true, '{"24": 1.5, "12": 2, "6": 3}', 5, true, false, NULL, 28, 4.93),

('33333333-3333-3333-3333-333333333312', '22222222-2222-2222-2222-222222222225', 'application_strategy', 'Public Service Career Planning', 
'Strategic session focused on building a profile for public service careers. Covers internships, research opportunities, and crafting a cohesive narrative around your impact goals.',
ARRAY[100], ARRAY['60-minute consultation + resources'], 'scheduled', NULL, 60, false, NULL, 6, true, false, NULL, 17, 4.91);

-- Mark task as complete and move to next
UPDATE students SET onboarding_completed = true, onboarding_step = 6 WHERE grade_level IS NOT NULL;
UPDATE consultants SET last_active = NOW() - (RANDOM() * INTERVAL '7 days') WHERE is_available = true;

-- Create realistic Bookings with various statuses
INSERT INTO bookings (id, student_id, consultant_id, service_id, base_price, price_tier, rush_multiplier, discount_code, discount_amount, final_price, prompt_text, essay_text, requirements_text, is_rush, promised_delivery_at, delivered_at, status, completed_at, credits_earned, rating, review_text, reviewed_at, created_at) VALUES
-- Completed bookings with reviews
('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333301', 120, 'Standard (2 essays)', 1, NULL, 0, 120, 
'Please review my Common App essay and Stanford supplemental. I''m worried the Stanford one doesn''t show enough personality.', 
'[Common App Essay - 650 words about overcoming social anxiety through theater...]', 
'Focus on: 1) Making connections between essays clearer 2) Strengthening conclusion 3) Grammar check', 
false, NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days', 'completed', NOW() - INTERVAL '3 days', 2.40, 5, 
'Sarah was incredible! She helped me find my authentic voice and made connections I hadn''t seen. The Stanford essay is so much stronger now. Highly recommend!', 
NOW() - INTERVAL '2 days', NOW() - INTERVAL '10 days'),

('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333304', 150, '3 essays', 1.5, NULL, 0, 225,
'URGENT: MIT and Caltech essays due in 24 hours. Need help making my robotics work sound less technical and more personal.',
'[MIT Essay - 250 words about building prosthetic hand...] [Caltech Essay - 500 words about AI research...]',
'Rush delivery needed. Please help humanize technical achievements.',
true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days' - INTERVAL '8 hours', 'completed', NOW() - INTERVAL '6 days', 4.50, 5,
'Michael delivered excellent feedback even with rush timeline. My essays now tell a story instead of just listing achievements. Got into MIT!',
NOW() - INTERVAL '1 day', NOW() - INTERVAL '8 days'),

('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111113', '22222222-2222-2222-2222-222222222225', '33333333-3333-3333-3333-333333333311', 140, 'Comprehensive edit', 1, 'WELCOME10', 14, 126,
'International student from Spain. Need help with Wharton essay about global business perspectives.',
'[Essay about launching sustainable fashion brand connecting Spanish artisans with US market...]',
'Please check for cultural references that might not translate well.',
false, NOW() - INTERVAL '14 days', NOW() - INTERVAL '12 days', 'completed', NOW() - INTERVAL '12 days', 2.52, 4,
'Emily provided great insights on making my international perspective stand out. Some feedback was generic though.',
NOW() - INTERVAL '11 days', NOW() - INTERVAL '15 days'),

-- In-progress bookings
('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111114', '22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333308', 90, 'Comprehensive review + STEM positioning', 1, NULL, 0, 90,
'Need help with my CS supplemental essays. Want to highlight my app development without sounding like every other applicant.',
'[Stanford CS Essay - 250 words about developing mental health app...] [MIT Essay - 300 words about open source contributions...]',
'Make sure technical details are accessible to non-technical readers.',
false, NOW() + INTERVAL '2 days', NULL, 'in_progress', NULL, 0, NULL, NULL, NULL, NOW() - INTERVAL '1 day'),

('44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111115', '22222222-2222-2222-2222-222222222224', '33333333-3333-3333-3333-333333333309', 150, '2-3 essays', 2, NULL, 0, 300,
'SUPER RUSH: Pre-med essays for Yale and Columbia due tomorrow! First-gen student, need help articulating why medicine.',
'[Yale Essay - 500 words about volunteering at free clinic...] [Columbia Essay - 400 words about healthcare disparities...]',
'Please help connect my background to my medical aspirations. Rush delivery critical!',
true, NOW() + INTERVAL '12 hours', NULL, 'confirmed', NULL, 0, NULL, NULL, NULL, NOW() - INTERVAL '6 hours'),

-- Scheduled interview sessions
('44444444-4444-4444-4444-444444444406', '11111111-1111-1111-1111-111111111116', '22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333302', 100, '60-minute session with feedback report', 1, NULL, 0, 100,
'Stanford interview next week! Need practice with behavioral questions and discussing my film interests in context of CS.',
NULL,
'Focus areas: 1) Why Stanford for film+CS 2) Leadership examples 3) Handling technical questions',
false, NOW() + INTERVAL '3 days', NULL, 'confirmed', NULL, 0, NULL, NULL, NULL, NOW() - INTERVAL '2 days'),

-- More completed bookings for data richness
('44444444-4444-4444-4444-444444444407', '11111111-1111-1111-1111-111111111117', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333305', 150, '90-minute deep dive + written plan', 1, NULL, 0, 150,
'Rising senior needing complete application strategy. Interested in physics/quantum computing at top schools.',
NULL,
'Current stats: 4.0 GPA, 1580 SAT, Intel STS semifinalist, published research. Need school list and timeline.',
false, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', 'completed', NOW() - INTERVAL '20 days', 3.00, 5,
'Incredibly thorough session! Michael helped me create a balanced school list and gave me a detailed timeline. The written plan is my bible now.',
NOW() - INTERVAL '18 days', NOW() - INTERVAL '22 days'),

('44444444-4444-4444-4444-444444444408', '11111111-1111-1111-1111-111111111118', '22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333307', 120, 'Full project consultation', 1, NULL, 0, 120,
'Junior starting science fair project. Want to do something with renewable energy but need help narrowing down.',
NULL,
'Background: AP Physics, Calc BC, some Arduino experience. Access to school lab. Timeline: 6 months to state fair.',
false, NOW() - INTERVAL '25 days', NOW() - INTERVAL '23 days', 'completed', NOW() - INTERVAL '23 days', 2.40, 5,
'Jessica is amazing! She helped me design a novel solar panel efficiency experiment. Her ISEF experience really shows.',
NOW() - INTERVAL '22 days', NOW() - INTERVAL '26 days'),

('44444444-4444-4444-4444-444444444409', '11111111-1111-1111-1111-111111111119', '22222222-2222-2222-2222-222222222224', '33333333-3333-3333-3333-333333333310', 110, '75-minute session + feedback guide', 1, NULL, 0, 110,
'Mock interview prep for Northwestern HPME program. Never done medical interviews before.',
NULL,
'Please cover: ethical scenarios, why medicine, why combined program, research interests.',
false, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', 'completed', NOW() - INTERVAL '30 days', 2.20, 4,
'Good session overall. David knows his stuff about med school interviews. Wish we had more time for ethical scenarios.',
NOW() - INTERVAL '28 days', NOW() - INTERVAL '32 days'),

('44444444-4444-4444-4444-444444444410', '11111111-1111-1111-1111-111111111120', '22222222-2222-2222-2222-222222222225', '33333333-3333-3333-3333-333333333312', 100, '60-minute consultation + resources', 1, NULL, 0, 100,
'Interested in foreign service career. Need guidance on building profile for Georgetown SFS.',
NULL,
'Current activities: Model UN president, Arabic studies, internship at local NGO. What else should I do?',
false, NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days', 'completed', NOW() - INTERVAL '35 days', 2.00, 5,
'Emily gave me a roadmap to Georgetown SFS! She suggested specific internships and even connected me with her former UN supervisor.',
NOW() - INTERVAL '33 days', NOW() - INTERVAL '37 days');

-- Create User Interactions tracking engagement
INSERT INTO user_interactions (student_id, consultant_id, interaction_type, service_type, created_at) VALUES
-- Profile views
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'view_profile', NULL, NOW() - INTERVAL '11 days'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'view_profile', NULL, NOW() - INTERVAL '11 days'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'view_service', 'essay_review', NOW() - INTERVAL '10 days' - INTERVAL '30 minutes'),
('11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 'view_profile', NULL, NOW() - INTERVAL '9 days'),
('11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 'view_service', 'essay_review', NOW() - INTERVAL '8 days' - INTERVAL '2 hours'),
('11111111-1111-1111-1111-111111111113', '22222222-2222-2222-2222-222222222225', 'view_profile', NULL, NOW() - INTERVAL '16 days'),
('11111111-1111-1111-1111-111111111114', '22222222-2222-2222-2222-222222222223', 'view_profile', NULL, NOW() - INTERVAL '2 days'),
('11111111-1111-1111-1111-111111111115', '22222222-2222-2222-2222-222222222224', 'view_profile', NULL, NOW() - INTERVAL '7 hours'),
-- Searches
('11111111-1111-1111-1111-111111111111', NULL, 'search', 'essay_review', NOW() - INTERVAL '11 days' - INTERVAL '15 minutes'),
('11111111-1111-1111-1111-111111111112', NULL, 'search', 'essay_review', NOW() - INTERVAL '9 days' - INTERVAL '30 minutes'),
('11111111-1111-1111-1111-111111111113', NULL, 'search', 'application_strategy', NOW() - INTERVAL '16 days' - INTERVAL '20 minutes'),
-- Booking interactions
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'booking_created', 'essay_review', NOW() - INTERVAL '10 days'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'booking_completed', 'essay_review', NOW() - INTERVAL '3 days'),
('11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 'booking_created', 'essay_review', NOW() - INTERVAL '8 days'),
('11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 'booking_completed', 'essay_review', NOW() - INTERVAL '6 days');

-- Create Student Guides with rich content
INSERT INTO student_guides (id, author_id, title, slug, description, category, difficulty, content, read_time, word_count, status, moderation_score, published_at, view_count, helpful_count, bookmark_count, share_count, avg_rating, tags, meta_description, featured, featured_order, version, created_at) VALUES
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111111', 
'How I Got Into Stanford: A Comprehensive Guide', 
'how-i-got-into-stanford-comprehensive-guide',
'My complete journey from average student to Stanford admit, including essays, ECs, and mindset shifts that made the difference.',
'applications', 'intermediate',
'{"sections": [
  {"title": "My Starting Point", "content": "I wasn''t a perfect student. 3.8 GPA, good but not amazing test scores. What changed everything was finding my authentic story..."},
  {"title": "The Essay That Worked", "content": "Instead of listing achievements, I wrote about failure. Here''s how vulnerability became my strength..."},
  {"title": "Extracurriculars That Mattered", "content": "Quality over quantity. I focused on 3 meaningful activities that showed growth and impact..."},
  {"title": "Interview Tips", "content": "Be yourself, but prepared. Here are the 5 questions that came up and how I approached them..."}
]}',
12, 2400, 'published', 0.92, NOW() - INTERVAL '8 days', 3456, 289, 567, 123, 4.8,
ARRAY['stanford', 'college-essays', 'interview-prep', 'admissions-strategy'],
'Complete guide to Stanford admissions from a current student. Essays, ECs, interviews, and authentic storytelling.',
true, 1, 1, NOW() - INTERVAL '8 days'),

('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111117', 
'STEM Research: From Idea to Intel ISEF', 
'stem-research-idea-to-intel-isef',
'Step-by-step guide to developing award-winning science fair projects, from finding mentors to presenting at ISEF.',
'research', 'advanced',
'{"sections": [
  {"title": "Finding Your Research Question", "content": "The best projects solve real problems. Here''s how to identify gaps in current research..."},
  {"title": "Getting a Mentor", "content": "Cold email templates that actually work. I contacted 47 professors and got 3 mentors..."},
  {"title": "Research Timeline", "content": "Month-by-month breakdown of my quantum computing project timeline..."},
  {"title": "Writing Your Paper", "content": "Structure, citations, and making complex ideas accessible..."}
]}',
18, 3600, 'published', 0.95, NOW() - INTERVAL '15 days', 2890, 412, 823, 201, 4.9,
ARRAY['research', 'isef', 'stem', 'science-fair', 'quantum-computing'],
'Win at Intel ISEF with this comprehensive research guide from a grand prize winner.',
true, 2, 1, NOW() - INTERVAL '15 days'),

('55555555-5555-5555-5555-555555555503', '11111111-1111-1111-1111-111111111113', 
'International Students: Navigating US Admissions', 
'international-students-navigating-us-admissions',
'Everything international students need to know about US college applications, from visa requirements to cultural differences in essays.',
'international', 'beginner',
'{"sections": [
  {"title": "Understanding the System", "content": "How US admissions differ from other countries. The holistic review process explained..."},
  {"title": "Financial Aid Strategies", "content": "Need-blind vs need-aware schools. How I secured full funding..."},
  {"title": "Essay Cultural Translation", "content": "Making your international perspective an asset, not a barrier..."},
  {"title": "Visa Process Simplified", "content": "F-1 visa interview prep and documentation checklist..."}
]}',
15, 3000, 'published', 0.88, NOW() - INTERVAL '20 days', 4567, 523, 934, 345, 4.7,
ARRAY['international-students', 'financial-aid', 'visa', 'cultural-differences'],
'Complete guide for international students applying to US colleges. Visa, finances, and cultural insights.',
false, NULL, 1, NOW() - INTERVAL '20 days');

-- Create Guide Sections for the guides
INSERT INTO guide_sections (id, guide_id, title, slug, order_index, content, parent_section_id, depth, created_at) VALUES
('66666666-6666-6666-6666-666666666601', '55555555-5555-5555-5555-555555555501', 'My Starting Point', 'my-starting-point', 1,
'{"text": "I wasn''t a perfect student. 3.8 GPA, good but not amazing test scores. What changed everything was finding my authentic story...", "examples": ["GPA: 3.8 weighted", "SAT: 1480", "No major awards"], "tips": ["Focus on growth", "Show self-awareness"]}',
NULL, 0, NOW() - INTERVAL '8 days'),

('66666666-6666-6666-6666-666666666602', '55555555-5555-5555-5555-555555555501', 'The Essay That Worked', 'essay-that-worked', 2,
'{"text": "Instead of listing achievements, I wrote about failure. Here''s how vulnerability became my strength...", "example_excerpt": "The microscope slide shattered, taking with it six months of research...", "word_count": 647}',
NULL, 0, NOW() - INTERVAL '8 days');

-- Create Guide Comments
INSERT INTO guide_comments (id, guide_id, user_id, content, is_question, parent_comment_id, helpful_count, created_at) VALUES
('77777777-7777-7777-7777-777777777701', '55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111114', 
'This guide literally changed my perspective on essays. Thank you so much for sharing!', false, NULL, 45, NOW() - INTERVAL '6 days'),

('77777777-7777-7777-7777-777777777702', '55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111115', 
'Did you submit the same essay to all schools or customize for each?', true, NULL, 12, NOW() - INTERVAL '5 days'),

('77777777-7777-7777-7777-777777777703', '55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111111', 
'Great question! I used the vulnerability theme across all essays but customized the specific examples and connections to each school''s values.', 
false, '77777777-7777-7777-7777-777777777702', 28, NOW() - INTERVAL '5 days' + INTERVAL '2 hours');

-- Create Guide Interactions
INSERT INTO guide_interactions (guide_id, user_id, viewed, viewed_at, read_progress, bookmarked, bookmarked_at, found_helpful, rating, rated_at, created_at) VALUES
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111114', true, NOW() - INTERVAL '6 days', 100, true, NOW() - INTERVAL '6 days', true, 5, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111115', true, NOW() - INTERVAL '5 days', 75, true, NOW() - INTERVAL '5 days', true, NULL, NULL, NOW() - INTERVAL '5 days'),
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111116', true, NOW() - INTERVAL '4 days', 50, false, NULL, NULL, NULL, NULL, NOW() - INTERVAL '4 days'),
('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111118', true, NOW() - INTERVAL '10 days', 100, true, NOW() - INTERVAL '10 days', true, 5, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

-- Create Guide Resources
INSERT INTO guide_resources (id, guide_id, title, description, resource_type, file_url, file_name, file_size, mime_type, download_count, requires_account, order_index, created_at) VALUES
('88888888-8888-8888-8888-888888888801', '55555555-5555-5555-5555-555555555501', 
'Stanford Essay Template', 'My actual Common App essay structure with annotations', 'template', 
'https://storage.proofr.com/guides/stanford-essay-template.pdf', 'stanford-essay-template.pdf', 245760, 'application/pdf', 
234, false, 1, NOW() - INTERVAL '8 days'),

('88888888-8888-8888-8888-888888888802', '55555555-5555-5555-5555-555555555502', 
'Research Proposal Example', 'My winning ISEF research proposal', 'example', 
'https://storage.proofr.com/guides/isef-proposal-example.pdf', 'isef-proposal-example.pdf', 567890, 'application/pdf', 
456, true, 1, NOW() - INTERVAL '15 days');

-- Create Guide Service Links
INSERT INTO guide_service_links (id, guide_id, service_id, consultant_id, link_text, link_type, click_count, conversion_count, created_at) VALUES
('99999999-9999-9999-9999-999999999901', '55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222221',
'Get personalized essay feedback from Sarah', 'author_service', 67, 12, NOW() - INTERVAL '8 days'),

('99999999-9999-9999-9999-999999999902', '55555555-5555-5555-5555-555555555502', '33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222223',
'Work with Jessica on your research project', 'recommended', 45, 8, NOW() - INTERVAL '15 days');

-- Create Consultant Waitlist entries
INSERT INTO consultant_waitlist (id, consultant_id, student_id, service_id, position, notified, expires_at, created_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa1', '22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111121', '33333333-3333-3333-3333-333333333301', 1, false, NOW() + INTERVAL '7 days', NOW() - INTERVAL '1 day'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa2', '22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111122', '33333333-3333-3333-3333-333333333301', 2, false, NOW() + INTERVAL '7 days', NOW() - INTERVAL '12 hours'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa3', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111123', '33333333-3333-3333-3333-333333333305', 1, false, NOW() + INTERVAL '7 days', NOW() - INTERVAL '2 days');

-- Create Group Session Participants
INSERT INTO group_session_participants (id, booking_id, student_id, joined_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb1', '44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111113', NOW() - INTERVAL '14 days'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb2', '44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111124', NOW() - INTERVAL '14 days' + INTERVAL '30 minutes');

-- Create Discount Codes
INSERT INTO discount_codes (id, code, description, discount_type, discount_value, minimum_purchase, valid_from, valid_until, max_uses, used_count, is_active, created_at) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc1', 'WELCOME10', 'New user discount', 'percentage', 10, 50, NOW() - INTERVAL '30 days', NOW() + INTERVAL '30 days', 100, 1, true, NOW() - INTERVAL '30 days'),
('cccccccc-cccc-cccc-cccc-cccccccccccc2', 'ESSAY20', 'Essay review special', 'percentage', 20, 100, NOW() - INTERVAL '7 days', NOW() + INTERVAL '7 days', 50, 0, true, NOW() - INTERVAL '7 days'),
('cccccccc-cccc-cccc-cccc-cccccccccccc3', 'STANFORD50', 'Stanford consultant promo', 'fixed', 50, 150, NOW() - INTERVAL '14 days', NOW() + INTERVAL '14 days', 20, 0, true, NOW() - INTERVAL '14 days');

-- Create Discount Usage
INSERT INTO discount_usage (id, discount_code_id, booking_id, user_id, discount_applied, created_at) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd1', 'cccccccc-cccc-cccc-cccc-cccccccccccc1', '44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111113', 14, NOW() - INTERVAL '15 days');

-- Update consultant stats based on bookings
UPDATE consultants c SET
  total_bookings = (SELECT COUNT(*) FROM bookings b WHERE b.consultant_id = c.id AND b.status = 'completed'),
  total_earnings = (SELECT COALESCE(SUM(b.final_price * 0.8), 0) FROM bookings b WHERE b.consultant_id = c.id AND b.status = 'completed'),
  rating = (SELECT AVG(b.rating) FROM bookings b WHERE b.consultant_id = c.id AND b.rating IS NOT NULL),
  total_reviews = (SELECT COUNT(*) FROM bookings b WHERE b.consultant_id = c.id AND b.rating IS NOT NULL);

-- Update service stats
UPDATE services s SET
  total_bookings = (SELECT COUNT(*) FROM bookings b WHERE b.service_id = s.id),
  avg_rating = (SELECT AVG(b.rating) FROM bookings b WHERE b.service_id = s.id AND b.rating IS NOT NULL);

-- Update student credit balances based on completed bookings
UPDATE students s SET
  credit_balance = (SELECT COALESCE(SUM(b.credits_earned), 0) FROM bookings b WHERE b.student_id = s.id AND b.status = 'completed'),
  lifetime_credits_earned = (SELECT COALESCE(SUM(b.credits_earned), 0) FROM bookings b WHERE b.student_id = s.id AND b.status = 'completed');

-- Add remaining students (31-50) for completeness
INSERT INTO users (id, email, phone, user_type, profile_image_url, auth_provider, is_active, last_login, created_at) VALUES
('11111111-1111-1111-1111-111111111131', 'abigail.walker@gmail.com', '+14155551021', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=abigail', ARRAY['google'], true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111132', 'jackson.hall@yahoo.com', NULL, 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jackson', ARRAY['email'], true, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '20 hours'),
('11111111-1111-1111-1111-111111111133', 'emily.allen@icloud.com', '+14155551023', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=emilyallen', ARRAY['apple'], true, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '18 hours'),
('11111111-1111-1111-1111-111111111134', 'michael.young@gmail.com', '+14155551024', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=michaelyoung', ARRAY['google'], true, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '16 hours'),
('11111111-1111-1111-1111-111111111135', 'elizabeth.king@outlook.com', '+14155551025', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=elizabeth', ARRAY['email'], true, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '14 hours'),
('11111111-1111-1111-1111-111111111136', 'daniel.wright@gmail.com', NULL, 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=daniel', ARRAY['google'], true, NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '12 hours'),
('11111111-1111-1111-1111-111111111137', 'sofia.lopez@yahoo.com', '+14155551027', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia', ARRAY['email'], true, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '10 hours'),
('11111111-1111-1111-1111-111111111138', 'joseph.hill@gmail.com', '+14155551028', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=joseph', ARRAY['google'], true, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '8 hours'),
('11111111-1111-1111-1111-111111111139', 'madison.scott@icloud.com', '+14155551029', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=madison', ARRAY['apple'], true, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '6 hours'),
('11111111-1111-1111-1111-111111111140', 'david.green@gmail.com', '+14155551030', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=davidgreen', ARRAY['google'], true, NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '4 hours'),
('11111111-1111-1111-1111-111111111141', 'victoria.adams@outlook.com', NULL, 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=victoria', ARRAY['email'], true, NOW() - INTERVAL '25 minutes', NOW() - INTERVAL '3 hours'),
('11111111-1111-1111-1111-111111111142', 'christopher.baker@gmail.com', '+14155551032', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=christopherbaker', ARRAY['google'], true, NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '2 hours'),
('11111111-1111-1111-1111-111111111143', 'grace.gonzalez@yahoo.com', '+14155551033', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace', ARRAY['email'], true, NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '1 hour'),
('11111111-1111-1111-1111-111111111144', 'matthew.nelson@gmail.com', '+14155551034', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=matthew', ARRAY['google'], true, NOW() - INTERVAL '35 minutes', NOW() - INTERVAL '45 minutes'),
('11111111-1111-1111-1111-111111111145', 'chloe.carter@icloud.com', '+14155551035', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=chloe', ARRAY['apple'], true, NOW() - INTERVAL '40 minutes', NOW() - INTERVAL '30 minutes'),
('11111111-1111-1111-1111-111111111146', 'ryan.mitchell@gmail.com', NULL, 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ryan', ARRAY['google'], true, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '20 minutes'),
('11111111-1111-1111-1111-111111111147', 'zoe.perez@outlook.com', '+14155551037', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zoe', ARRAY['email'], true, NOW() - INTERVAL '8 minutes', NOW() - INTERVAL '15 minutes'),
('11111111-1111-1111-1111-111111111148', 'nathan.roberts@gmail.com', '+14155551038', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=nathan', ARRAY['google'], true, NOW() - INTERVAL '3 minutes', NOW() - INTERVAL '10 minutes'),
('11111111-1111-1111-1111-111111111149', 'hannah.turner@yahoo.com', '+14155551039', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=hannah', ARRAY['email'], true, NOW() - INTERVAL '2 minutes', NOW() - INTERVAL '5 minutes'),
('11111111-1111-1111-1111-111111111150', 'luke.phillips@gmail.com', '+14155551040', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=luke', ARRAY['google'], true, NOW() - INTERVAL '1 minute', NOW() - INTERVAL '2 minutes');

-- Add corresponding student profiles for new users
INSERT INTO students (id, name, bio, current_school, school_type, grade_level, target_application_year, preferred_colleges, interests, pain_points, budget_range, credit_balance, lifetime_credits_earned, onboarding_completed, onboarding_step) VALUES
('11111111-1111-1111-1111-111111111131', 'Abigail Walker', 'Future environmental scientist passionate about climate change', 'Lincoln High School', 'high-school', 'junior', 2025, ARRAY['UC Berkeley', 'Stanford', 'MIT'], ARRAY['environmental_science', 'sustainability'], ARRAY['research_opportunities'], '[50, 100]', 0, 0, true, 6),
('11111111-1111-1111-1111-111111111132', 'Jackson Hall', 'Aspiring architect with a love for sustainable design', 'Design Tech High School', 'high-school', 'senior', 2024, ARRAY['Cornell', 'Rice', 'Cooper Union'], ARRAY['architecture', 'sustainable_design'], ARRAY['portfolio_prep'], '[75, 150]', 0, 0, true, 6),
('11111111-1111-1111-1111-111111111133', 'Emily Allen', 'Music composition student aiming for conservatories', 'Interlochen Arts Academy', 'high-school', 'senior', 2024, ARRAY['Juilliard', 'Berklee', 'Eastman'], ARRAY['music_composition', 'film_scoring'], ARRAY['audition_prep'], '[100, 200]', 0, 0, false, 4),
('11111111-1111-1111-1111-111111111134', 'Michael Young', 'Economics enthusiast with entrepreneurial spirit', 'Lakeside School', 'high-school', 'junior', 2025, ARRAY['Wharton', 'Chicago', 'Northwestern'], ARRAY['economics', 'entrepreneurship'], ARRAY['essay_writing'], '[80, 160]', 0, 0, true, 6),
('11111111-1111-1111-1111-111111111135', 'Elizabeth King', 'Pre-dental student focused on community health', 'Roosevelt High School', 'high-school', 'senior', 2024, ARRAY['UPenn', 'NYU', 'Boston University'], ARRAY['pre_dental', 'public_health'], ARRAY['interview_prep'], '[60, 120]', 0, 0, true, 6);

-- Create Theme Preferences for some users
INSERT INTO user_theme_preferences (user_id, theme_mode, accent_color, font_size, reduced_motion, high_contrast, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'dark', 'blue', 'medium', false, false, NOW() - INTERVAL '30 days', NOW() - INTERVAL '2 days'),
('11111111-1111-1111-1111-111111111112', 'light', 'green', 'large', false, true, NOW() - INTERVAL '25 days', NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222221', 'system', 'purple', 'medium', true, false, NOW() - INTERVAL '40 days', NOW() - INTERVAL '5 days');

-- Create Guide Collections
INSERT INTO guide_collections (id, creator_id, title, slug, description, is_official, is_learning_path, is_public, subscriber_count, created_at) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee1', '22222222-2222-2222-2222-222222222221', 'Complete Stanford Application Guide', 'complete-stanford-application', 'Everything you need to know about applying to Stanford, curated by a current student', false, true, true, 234, NOW() - INTERVAL '7 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee2', '11111111-1111-1111-1111-111111111111', 'STEM Research Roadmap', 'stem-research-roadmap', 'Step-by-step path to developing award-winning research projects', true, true, true, 567, NOW() - INTERVAL '14 days');

-- Add guides to collections
INSERT INTO collection_guides (id, collection_id, guide_id, order_index, added_at) VALUES
('ffffffff-ffff-ffff-ffff-ffffffffffff1', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee1', '55555555-5555-5555-5555-555555555501', 1, NOW() - INTERVAL '7 days'),
('ffffffff-ffff-ffff-ffff-ffffffffffff2', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee2', '55555555-5555-5555-5555-555555555502', 1, NOW() - INTERVAL '14 days');

-- Final summary query to verify data integrity
SELECT 
  'Data population complete!' as status,
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM students) as total_students,
  (SELECT COUNT(*) FROM consultants) as total_consultants,
  (SELECT COUNT(*) FROM services) as total_services,
  (SELECT COUNT(*) FROM bookings) as total_bookings,
  (SELECT COUNT(*) FROM student_guides) as total_guides,
  (SELECT SUM(final_price) FROM bookings WHERE status = 'completed') as total_revenue,
  (SELECT AVG(rating) FROM consultants WHERE rating IS NOT NULL) as avg_consultant_rating;