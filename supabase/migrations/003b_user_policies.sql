-- Migration 003b: User and Profile Policies
-- Description: RLS policies for users, students, and consultants
-- Author: Proofr Team
-- Date: 2025-01-03

-- ======================
-- USERS TABLE POLICIES
-- ======================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role can manage all users
CREATE POLICY "Service role has full access to users" ON public.users
  FOR ALL USING (auth.role() = 'service_role');

-- ======================
-- STUDENTS TABLE POLICIES
-- ======================

-- Students can view their own profile
CREATE POLICY "Students can view own profile" ON public.students
  FOR SELECT USING (auth.uid() = id);

-- Students can update their own profile
CREATE POLICY "Students can update own profile" ON public.students
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Consultants can view student profiles (for browsing)
CREATE POLICY "Consultants can view student profiles" ON public.students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.user_type = 'consultant'
    )
  );

-- Service role full access
CREATE POLICY "Service role has full access to students" ON public.students
  FOR ALL USING (auth.role() = 'service_role');

-- ======================
-- CONSULTANTS TABLE POLICIES
-- ======================

-- IMPORTANT: Anyone can view ALL consultants (public browsing)
CREATE POLICY "Anyone can view all consultants" ON public.consultants
  FOR SELECT USING (true);  -- No restrictions!

-- Consultants can update their own profile (simplified - no verification check)
CREATE POLICY "Consultants can update own profile" ON public.consultants
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role full access
CREATE POLICY "Service role has full access to consultants" ON public.consultants
  FOR ALL USING (auth.role() = 'service_role');