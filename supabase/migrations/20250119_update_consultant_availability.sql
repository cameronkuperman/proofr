-- Update all consultants to be available and not on vacation
-- This ensures they appear on the student dashboard

UPDATE consultants 
SET 
  is_available = true,
  vacation_mode = false,
  last_active = NOW()
WHERE verification_status = 'approved';

-- Log the results
DO $$
DECLARE
    v_updated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_updated_count 
    FROM consultants 
    WHERE is_available = true 
    AND vacation_mode = false;
    
    RAISE NOTICE 'Updated consultant availability!';
    RAISE NOTICE 'Total available consultants: %', v_updated_count;
END $$;