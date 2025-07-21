-- Create missing user records for consultants
-- This ensures all consultants have corresponding user records

-- First, insert users for consultants that don't have them
INSERT INTO users (id, email, user_type, profile_image_url, is_active, created_at, updated_at)
SELECT 
  c.id,
  COALESCE(c.edu_email, LOWER(REPLACE(c.name, ' ', '.')) || '@example.com'),
  'consultant'::user_type,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=' || c.id,
  true,
  c.created_at,
  c.updated_at
FROM consultants c
LEFT JOIN users u ON c.id = u.id
WHERE u.id IS NULL;

-- Update any consultants that have NULL emails in users table
UPDATE users u
SET email = COALESCE(c.edu_email, LOWER(REPLACE(c.name, ' ', '.')) || '@example.com')
FROM consultants c
WHERE u.id = c.id 
AND u.email IS NULL;

-- Log the results
DO $$
DECLARE
    v_created_count INTEGER;
    v_total_consultants INTEGER;
    v_total_users INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_total_consultants FROM consultants;
    SELECT COUNT(*) INTO v_total_users FROM users WHERE user_type = 'consultant';
    
    RAISE NOTICE 'User creation for consultants complete!';
    RAISE NOTICE 'Total consultants: %', v_total_consultants;
    RAISE NOTICE 'Total consultant users: %', v_total_users;
END $$;