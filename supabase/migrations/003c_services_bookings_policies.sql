-- Migration 003c: Services and Bookings Policies
-- Description: RLS policies for services and bookings
-- Author: Proofr Team
-- Date: 2025-01-03

-- ======================
-- SERVICES TABLE POLICIES
-- ======================

-- Anyone can view active services
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

-- Consultants can view all their services
CREATE POLICY "Consultants can view own services" ON public.services
  FOR SELECT USING (auth.uid() = consultant_id);

-- Consultants can create their own services (no approval required!)
CREATE POLICY "Consultants can create own services" ON public.services
  FOR INSERT WITH CHECK (
    auth.uid() = consultant_id AND
    EXISTS (
      SELECT 1 FROM public.consultants
      WHERE consultants.id = auth.uid()
    )
  );

-- Consultants can update their own services
CREATE POLICY "Consultants can update own services" ON public.services
  FOR UPDATE USING (auth.uid() = consultant_id)
  WITH CHECK (auth.uid() = consultant_id);

-- Consultants can delete their own services
CREATE POLICY "Consultants can delete own services" ON public.services
  FOR DELETE USING (auth.uid() = consultant_id);

-- Service role full access
CREATE POLICY "Service role has full access to services" ON public.services
  FOR ALL USING (auth.role() = 'service_role');

-- ======================
-- BOOKINGS TABLE POLICIES
-- ======================

-- Students can view their own bookings
CREATE POLICY "Students can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = student_id);

-- Consultants can view bookings for their services
CREATE POLICY "Consultants can view bookings for their services" ON public.bookings
  FOR SELECT USING (auth.uid() = consultant_id);

-- Students can create bookings
CREATE POLICY "Students can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (
    auth.uid() = student_id AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.user_type = 'student'
    )
  );

-- Students can update their own bookings (simplified)
CREATE POLICY "Students can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Consultants can update bookings for their services (simplified)
CREATE POLICY "Consultants can update bookings for their services" ON public.bookings
  FOR UPDATE USING (auth.uid() = consultant_id)
  WITH CHECK (auth.uid() = consultant_id);

-- Service role full access
CREATE POLICY "Service role has full access to bookings" ON public.bookings
  FOR ALL USING (auth.role() = 'service_role');