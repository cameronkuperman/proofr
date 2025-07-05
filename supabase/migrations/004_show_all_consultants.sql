-- Migration 004: Show All Consultants
-- Description: Allow all consultants to be visible, verification only adds checkmark
-- Author: Proofr Team  
-- Date: 2025-01-03

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Anyone can view approved consultants" ON public.consultants;

-- Create new policy - EVERYONE can see ALL consultants
CREATE POLICY "Anyone can view all consultants" ON public.consultants
  FOR SELECT USING (true);  -- No restrictions!

-- Update the active_consultants view to show all consultants
DROP VIEW IF EXISTS public.active_consultants;

CREATE VIEW public.active_consultants AS
SELECT 
  c.*,
  u.email,
  u.profile_image_url,
  u.last_login
FROM public.consultants c
JOIN public.users u ON c.id = u.id
WHERE c.is_available = true
  AND c.vacation_mode = false
  AND u.is_active = true;
-- Removed verification_status = 'approved' check

-- Update consultant profile data to ensure proper defaults
UPDATE public.consultants
SET verification_status = 'pending'
WHERE verification_status IS NULL;

-- Add comment for clarity
COMMENT ON POLICY "Anyone can view all consultants" ON public.consultants
  IS 'Allows public browsing of ALL consultants regardless of verification status. Verification only adds a checkmark badge.';

COMMENT ON VIEW public.active_consultants
  IS 'Shows all active consultants who are available and not on vacation mode, regardless of verification status.';