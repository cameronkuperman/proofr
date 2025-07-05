-- Migration 003e: Verification Status Protection
-- Description: Trigger to prevent consultants from changing their own verification status
-- Author: Proofr Team
-- Date: 2025-01-03

-- Create trigger function to protect verification status
CREATE OR REPLACE FUNCTION protect_verification_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If user is trying to update their own record
  IF auth.uid() = NEW.id THEN
    -- Prevent changing verification status unless it's currently pending
    IF OLD.verification_status != 'pending' AND NEW.verification_status != OLD.verification_status THEN
      RAISE EXCEPTION 'Cannot change verification status';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on consultants table
CREATE TRIGGER prevent_verification_status_change
  BEFORE UPDATE ON public.consultants
  FOR EACH ROW
  EXECUTE FUNCTION protect_verification_status();

-- Create trigger function to protect critical booking fields
CREATE OR REPLACE FUNCTION protect_booking_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent changing critical fields
  IF NEW.consultant_id != OLD.consultant_id THEN
    RAISE EXCEPTION 'Cannot change consultant_id';
  END IF;
  
  IF NEW.service_id != OLD.service_id THEN
    RAISE EXCEPTION 'Cannot change service_id';
  END IF;
  
  IF NEW.student_id != OLD.student_id THEN
    RAISE EXCEPTION 'Cannot change student_id';
  END IF;
  
  IF NEW.final_price != OLD.final_price THEN
    RAISE EXCEPTION 'Cannot change final_price';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on bookings table
CREATE TRIGGER prevent_booking_field_changes
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION protect_booking_fields();