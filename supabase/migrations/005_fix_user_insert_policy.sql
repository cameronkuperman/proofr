-- Migration 005: Fix Missing User Registration Policies
-- Description: Fix critical missing INSERT policies for user registration
-- Author: Proofr Team
-- Date: 2025-01-03

-- ============================
-- USER REGISTRATION POLICIES
-- ============================

-- Allow authenticated users to insert their own user record
CREATE POLICY "Users can insert own profile during registration" ON public.users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to insert their student profile
CREATE POLICY "Students can insert own profile during registration" ON public.students
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to insert their consultant profile
CREATE POLICY "Consultants can insert own profile during registration" ON public.consultants
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ============================
-- MISSING CRITICAL POLICIES
-- ============================

-- Allow users to delete their own profiles (GDPR compliance)
CREATE POLICY "Users can delete own account" ON public.users
  FOR DELETE
  USING (auth.uid() = id);

-- Allow users to delete their type-specific profiles
CREATE POLICY "Students can delete own profile" ON public.students
  FOR DELETE
  USING (auth.uid() = id);

CREATE POLICY "Consultants can delete own profile" ON public.consultants
  FOR DELETE
  USING (auth.uid() = id);

-- ============================
-- GROUP SESSION POLICIES
-- ============================

-- Allow participants to join group sessions they booked
CREATE POLICY "Students can join group sessions" ON public.group_session_participants
  FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_id
      AND bookings.is_group_session = true
      AND bookings.current_participants < bookings.max_participants
    )
  );

-- Allow students to view group session participants
CREATE POLICY "Students can view group session participants" ON public.group_session_participants
  FOR SELECT
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_id
      AND bookings.consultant_id = auth.uid()
    )
  );