-- Test Data for Student Guides System
-- Run this after the migration to have sample data

-- First, get a student user ID (replace with an actual student ID from your database)
-- You can find one by running: SELECT id FROM students LIMIT 1;

-- Insert a test guide (replace 'YOUR_STUDENT_ID' with an actual student ID)
INSERT INTO student_guides (
  author_id,
  title,
  slug,
  description,
  category,
  difficulty,
  content,
  tags,
  status,
  published_at,
  view_count,
  helpful_count,
  avg_rating,
  moderation_score,
  read_time,
  word_count
) VALUES (
  'YOUR_STUDENT_ID', -- Replace this!
  'How to Write a Killer Personal Statement',
  'how-to-write-killer-personal-statement',
  'Learn the secrets to crafting a personal statement that will make admissions officers remember you.',
  'essays',
  'intermediate',
  '{
    "sections": [
      {
        "id": "1",
        "type": "text",
        "content": "# How to Write a Killer Personal Statement\n\nYour personal statement is your chance to show admissions officers who you are beyond your grades and test scores. Here''s how to make it unforgettable.\n\n## Start with a Hook\n\nThe first sentence is crucial. You need to grab attention immediately. Here are three proven approaches:\n\n- **The Anecdote**: Start with a specific moment that changed your perspective\n- **The Question**: Pose a thought-provoking question that your essay will answer\n- **The Bold Statement**: Make a surprising claim that you''ll support\n\n## Show, Don''t Tell\n\nInstead of saying \"I am hardworking,\" describe a time when you stayed up all night perfecting a project. Use specific details:\n\n- What did you see, hear, feel?\n- What was at stake?\n- How did others react?\n\n## Find Your Theme\n\nEvery great personal statement has a central theme. Common successful themes include:\n\n- Growth through adversity\n- Discovering passion through exploration\n- Learning from failure\n- Building bridges between communities\n\n## The Conclusion That Resonates\n\nYour conclusion should:\n\n1. Circle back to your opening\n2. Show how you''ve grown\n3. Point toward your future\n4. Leave a lasting impression\n\n## Common Mistakes to Avoid\n\n- Writing what you think they want to hear\n- Listing accomplishments without reflection\n- Using clichés and overused phrases\n- Forgetting to proofread\n\n## Final Tips\n\n- Write multiple drafts\n- Read it aloud\n- Get feedback from teachers AND peers\n- Be authentically yourself",
        "order": 0
      }
    ],
    "summary": "A comprehensive guide to writing personal statements that stand out",
    "prerequisites": ["Basic writing skills", "Completed brainstorming"],
    "learning_objectives": ["Craft compelling openings", "Use specific details effectively", "Develop a cohesive theme"],
    "estimated_time": 15
  }'::jsonb,
  ARRAY['essays', 'personal-statement', 'college-application', 'writing-tips'],
  'published',
  NOW() - INTERVAL '5 days',
  342,
  45,
  4.8,
  0.95,
  15,
  850
);

-- Add some test interactions (replace USER_IDs with actual user IDs)
-- INSERT INTO guide_interactions (guide_id, user_id, viewed, found_helpful, rating, bookmarked)
-- SELECT 
--   (SELECT id FROM student_guides WHERE slug = 'how-to-write-killer-personal-statement'),
--   'SOME_USER_ID',
--   true,
--   true,
--   5,
--   true;

-- Add a test comment (replace USER_ID)
-- INSERT INTO guide_comments (guide_id, user_id, content, is_question)
-- SELECT
--   (SELECT id FROM student_guides WHERE slug = 'how-to-write-killer-personal-statement'),
--   'SOME_USER_ID',
--   'This guide really helped me! I used the anecdote approach and got into my dream school.',
--   false;

-- Create a few more guides for variety
INSERT INTO student_guides (
  author_id,
  title,
  slug,
  description,
  category,
  difficulty,
  content,
  tags,
  status,
  published_at,
  view_count,
  helpful_count,
  avg_rating,
  read_time
) VALUES 
(
  'YOUR_STUDENT_ID', -- Replace this!
  'SAT Math: Conquering Word Problems',
  'sat-math-word-problems',
  'Master the art of translating word problems into solvable equations.',
  'test_prep',
  'intermediate',
  '{"sections": [{"id": "1", "type": "text", "content": "Content about SAT math strategies...", "order": 0}]}'::jsonb,
  ARRAY['sat', 'math', 'test-prep', 'word-problems'],
  'published',
  NOW() - INTERVAL '10 days',
  523,
  67,
  4.7,
  20
),
(
  'YOUR_STUDENT_ID', -- Replace this!
  'First-Gen Student Guide to College Apps',
  'first-gen-college-guide',
  'Navigate the college application process when you''re the first in your family.',
  'applications',
  'beginner',
  '{"sections": [{"id": "1", "type": "text", "content": "Content for first-gen students...", "order": 0}]}'::jsonb,
  ARRAY['first-generation', 'college-apps', 'beginner-friendly'],
  'published',
  NOW() - INTERVAL '3 days',
  892,
  124,
  4.9,
  25
);