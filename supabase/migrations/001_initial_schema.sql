-- Migration 001: Initial Schema Setup
-- Description: Creates core user tables and authentication structure
-- Author: Proofr Team
-- Date: 2025-01-03

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Create enum types
CREATE TYPE user_type AS ENUM ('student', 'consultant');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded');
CREATE TYPE delivery_type AS ENUM ('async', 'scheduled', 'flexible');
CREATE TYPE interaction_type AS ENUM ('viewed', 'booked', 'completed', 'rated');
CREATE TYPE report_status AS ENUM ('pending', 'reviewing', 'resolved', 'dismissed');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  user_type user_type NOT NULL,
  profile_image_url TEXT,
  auth_provider TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT, -- short bio for profile
  current_school TEXT,
  school_type TEXT CHECK (school_type IN ('high-school', 'college')),
  grade_level TEXT CHECK (grade_level IN ('senior', 'junior', 'sophomore', 'freshman', 'transfer')),
  target_application_year INTEGER CHECK (target_application_year >= 2024 AND target_application_year <= 2030),
  preferred_colleges TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  pain_points TEXT[] DEFAULT '{}',
  budget_range INT4RANGE,
  
  -- Credits system
  credit_balance NUMERIC(10,2) DEFAULT 0 CHECK (credit_balance >= 0),
  lifetime_credits_earned NUMERIC(10,2) DEFAULT 0 CHECK (lifetime_credits_earned >= 0),
  
  -- Onboarding tracking
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 0,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consultants table
CREATE TABLE public.consultants (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT, -- short bio for cards/search results
  long_bio TEXT, -- detailed bio for profile page
  
  -- Academic info
  current_college TEXT,
  colleges_attended JSONB DEFAULT '[]', -- [{name: "Harvard", degree: "BA", major: "Economics", graduation_year: 2024}]
  major TEXT,
  graduation_year INTEGER CHECK (graduation_year >= 2020 AND graduation_year <= 2030),
  
  -- Verification
  verification_status verification_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.users(id),
  verification_method TEXT CHECK (verification_method IN ('edu_email', 'manual', 'document')),
  edu_email TEXT,
  auto_verified BOOLEAN DEFAULT false,
  
  -- Availability
  is_available BOOLEAN DEFAULT true,
  vacation_mode BOOLEAN DEFAULT false,
  vacation_message TEXT,
  
  -- Services preview (for browse cards)
  services_preview JSONB DEFAULT '{}', -- {"essay_review": {"min_price": 30, "description": "Professional essay feedback"}}
  
  -- Rush delivery settings
  supports_rush_delivery BOOLEAN DEFAULT true,
  rush_multipliers JSONB DEFAULT '{"1.5x": 24, "2x": 12, "3x": 6}', -- {multiplier: hours}
  
  -- Stats (denormalized for performance)
  rating NUMERIC(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0 CHECK (total_reviews >= 0),
  total_bookings INTEGER DEFAULT 0 CHECK (total_bookings >= 0),
  total_earnings NUMERIC(10,2) DEFAULT 0 CHECK (total_earnings >= 0),
  response_time_hours NUMERIC(4,1) CHECK (response_time_hours >= 0),
  
  -- Settings
  timezone TEXT DEFAULT 'America/New_York',
  calendly_url TEXT,
  
  -- Analytics
  profile_views INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification queue for manual review
CREATE TABLE public.verification_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE CASCADE,
  edu_email TEXT,
  university_name TEXT NOT NULL,
  document_type TEXT CHECK (document_type IN ('assignment', 'acceptance_letter', 'transcript', 'student_id')),
  document_url TEXT, -- Supabase storage URL
  auto_verify_eligible BOOLEAN DEFAULT false, -- true if edu email domain matches university
  status verification_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User interactions for recommendation system
CREATE TABLE public.user_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE CASCADE,
  interaction_type interaction_type NOT NULL,
  service_type TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure rating is only set for 'rated' interactions
  CONSTRAINT rating_only_for_rated CHECK (
    (interaction_type = 'rated' AND rating IS NOT NULL) OR
    (interaction_type != 'rated' AND rating IS NULL)
  )
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_type ON public.users(user_type);
CREATE INDEX idx_users_active ON public.users(is_active);

CREATE INDEX idx_students_school ON public.students(current_school);
CREATE INDEX idx_students_budget ON public.students USING GIST (budget_range);
CREATE INDEX idx_students_colleges ON public.students USING GIN (preferred_colleges);

CREATE INDEX idx_consultants_college ON public.consultants(current_college);
CREATE INDEX idx_consultants_status ON public.consultants(verification_status);
CREATE INDEX idx_consultants_available ON public.consultants(is_available, vacation_mode);
CREATE INDEX idx_consultants_rating ON public.consultants(rating DESC);

CREATE INDEX idx_verification_queue_status ON public.verification_queue(status);
CREATE INDEX idx_verification_queue_consultant ON public.verification_queue(consultant_id);

CREATE INDEX idx_interactions_student ON public.user_interactions(student_id);
CREATE INDEX idx_interactions_consultant ON public.user_interactions(consultant_id);
CREATE INDEX idx_interactions_type ON public.user_interactions(interaction_type);
CREATE INDEX idx_interactions_created ON public.user_interactions(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultants_updated_at BEFORE UPDATE ON public.consultants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for active consultants (commonly used)
CREATE VIEW public.active_consultants AS
SELECT 
  c.*,
  u.email,
  u.profile_image_url,
  u.last_login
FROM public.consultants c
JOIN public.users u ON c.id = u.id
WHERE c.verification_status = 'approved'
  AND c.is_available = true
  AND c.vacation_mode = false
  AND u.is_active = true;

-- Create view for student profiles (for public display)
CREATE VIEW public.student_profiles AS
SELECT
  u.id,
  u.email,
  u.profile_image_url,
  s.name,
  s.bio,
  s.current_school,
  s.school_type,
  s.interests,
  s.preferred_colleges,
  s.created_at
FROM public.users u
JOIN public.students s ON u.id = s.id
WHERE u.user_type = 'student'
  AND u.is_active = true;

-- Comments for documentation
COMMENT ON TABLE public.users IS 'Core user table extending Supabase auth';
COMMENT ON TABLE public.students IS 'Student-specific profile information';
COMMENT ON TABLE public.consultants IS 'Consultant-specific profile and verification data';
COMMENT ON TABLE public.verification_queue IS 'Queue for manual consultant verification';
COMMENT ON TABLE public.user_interactions IS 'Tracks user interactions for recommendation system';

COMMENT ON COLUMN public.consultants.services_preview IS 'Quick preview of services and min prices for browse cards';
COMMENT ON COLUMN public.consultants.rush_multipliers IS 'JSON object mapping price multipliers to delivery hours';
COMMENT ON COLUMN public.students.credit_balance IS 'Current credit balance (2 cents per dollar spent)';