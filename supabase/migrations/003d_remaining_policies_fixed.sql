-- Migration 003d: Remaining Policies and View Update (FIXED)
-- Description: RLS policies for verification, interactions, and update view
-- Author: Proofr Team
-- Date: 2025-01-03

-- ======================
-- VERIFICATION QUEUE POLICIES
-- ======================

-- Consultants can view their own verification requests
CREATE POLICY "Consultants can view own verification requests" ON public.verification_queue
  FOR SELECT USING (auth.uid() = consultant_id);

-- Consultants can create verification requests
CREATE POLICY "Consultants can create verification requests" ON public.verification_queue
  FOR INSERT WITH CHECK (auth.uid() = consultant_id);

-- Service role full access
CREATE POLICY "Service role has full access to verification queue" ON public.verification_queue
  FOR ALL USING (auth.role() = 'service_role');

-- ======================
-- USER INTERACTIONS POLICIES
-- ======================

-- Students can create their own interactions
CREATE POLICY "Students can create own interactions" ON public.user_interactions
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Service role can read all interactions (for analytics)
CREATE POLICY "Service role can read all interactions" ON public.user_interactions
  FOR SELECT USING (auth.role() = 'service_role');

-- ======================
-- HELPER FUNCTIONS (in public schema)
-- ======================

-- Function to check if user is authenticated
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user type
CREATE OR REPLACE FUNCTION public.get_user_type()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT user_type FROM public.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================
-- UPDATE VIEW TO SHOW ALL CONSULTANTS
-- ======================

-- Update the active_consultants view to show ALL consultants
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
-- No verification_status check - show all consultants!

-- ======================
-- PERMISSIONS
-- ======================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ======================
-- DOCUMENTATION COMMENTS
-- ======================

COMMENT ON POLICY "Anyone can view all consultants" ON public.consultants
  IS 'Allows public browsing of ALL consultants regardless of verification status. Verification only adds a checkmark badge.';

COMMENT ON POLICY "Consultants can create own services" ON public.services
  IS 'Allows any consultant to create services immediately without waiting for verification';

COMMENT ON VIEW public.active_consultants
  IS 'Shows all active consultants who are available and not on vacation mode, regardless of verification status.';