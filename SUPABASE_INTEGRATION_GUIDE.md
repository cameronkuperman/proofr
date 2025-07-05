# Supabase Integration Guide for Proofr

## Table of Contents
1. [Overview](#overview)
2. [Database Schema Setup](#database-schema-setup)
3. [Authentication Implementation](#authentication-implementation)
4. [Current Progress](#current-progress)
5. [Next Steps](#next-steps)

## Overview

This guide documents the complete Supabase integration for Proofr, including database schema, authentication, and feature implementation.

### Project Goals
- Implement Google and email authentication
- Create separate tables for students and consultants
- Enable profile management with images
- Build messaging system using Supabase Realtime
- Implement credits/rewards system
- Add rush delivery options
- Create analytics tracking

### Current Status
- ✅ Requirements gathered
- ✅ Database schema designed
- 🔄 Creating migration files
- ⏳ Authentication implementation
- ⏳ Profile system integration
- ⏳ Existing features migration

## Database Schema Setup

### Step 1: Enable Required Extensions

First, go to your Supabase dashboard > SQL Editor and run:

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable range types for budget ranges
CREATE EXTENSION IF NOT EXISTS "btree_gist";
```

### Step 2: Create Storage Buckets

In Supabase Dashboard > Storage, create these buckets:

1. **profile-images** (Public bucket)
   - Max file size: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp
   
2. **verification-documents** (Private bucket)
   - Max file size: 10MB
   - Allowed MIME types: image/*, application/pdf
   
3. **service-attachments** (Private bucket)
   - Max file size: 50MB
   - Allowed MIME types: image/*, application/pdf, text/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document

### Step 3: Create Core Tables

Run these migrations in order:

#### Migration 001: Core User Tables

```sql
-- Create enum types
CREATE TYPE user_type AS ENUM ('student', 'consultant');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded');
CREATE TYPE delivery_type AS ENUM ('async', 'scheduled', 'flexible');

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
  bio TEXT,
  current_school TEXT,
  school_type TEXT CHECK (school_type IN ('high-school', 'college')),
  grade_level TEXT CHECK (grade_level IN ('senior', 'junior', 'sophomore', 'freshman', 'transfer')),
  target_application_year INTEGER,
  preferred_colleges TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  pain_points TEXT[] DEFAULT '{}',
  budget_range INT4RANGE,
  credit_balance NUMERIC(10,2) DEFAULT 0 CHECK (credit_balance >= 0),
  lifetime_credits_earned NUMERIC(10,2) DEFAULT 0,
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
  bio TEXT, -- short bio for cards
  long_bio TEXT, -- detailed bio for profile
  current_college TEXT,
  colleges_attended JSONB DEFAULT '[]',
  major TEXT,
  graduation_year INTEGER,
  
  -- Verification
  verification_status verification_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.users(id),
  verification_method TEXT,
  edu_email TEXT,
  auto_verified BOOLEAN DEFAULT false,
  
  -- Availability
  is_available BOOLEAN DEFAULT true,
  vacation_mode BOOLEAN DEFAULT false,
  vacation_message TEXT,
  
  -- Services preview (for browse cards)
  services_preview JSONB DEFAULT '{}',
  
  -- Rush delivery
  supports_rush_delivery BOOLEAN DEFAULT true,
  rush_multipliers JSONB DEFAULT '{"1.5x": 24, "2x": 12, "3x": 6}',
  
  -- Stats (denormalized for performance)
  rating NUMERIC(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_earnings NUMERIC(10,2) DEFAULT 0,
  response_time_hours NUMERIC(4,1),
  
  -- Settings
  timezone TEXT DEFAULT 'America/New_York',
  calendly_url TEXT,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_type ON public.users(user_type);
CREATE INDEX idx_students_school ON public.students(current_school);
CREATE INDEX idx_consultants_college ON public.consultants(current_college);
CREATE INDEX idx_consultants_status ON public.consultants(verification_status);
CREATE INDEX idx_consultants_available ON public.consultants(is_available, vacation_mode);
```

## Authentication Implementation

### Step 1: Configure Auth Providers

In Supabase Dashboard > Authentication > Providers:

1. **Email Provider**
   - Enable Email provider
   - Set up email templates for confirmation and recovery

2. **Google Provider**
   - Enable Google provider
   - Add your OAuth credentials:
     - Client ID: [Your Google OAuth Client ID]
     - Client Secret: [Your Google OAuth Client Secret]
   - Redirect URL: Copy the URL provided by Supabase

### Step 2: Update Environment Variables

Add these to your `.env.local` files:

```bash
# Already in your codebase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Add these new ones
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 3: Create Auth Helper Functions

Create `/lib/auth-helpers.ts`:

```typescript
import { supabase } from './supabase'

export async function signUpWithEmail(
  email: string,
  password: string,
  userType: 'student' | 'consultant',
  additionalData: any
) {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError

  // 2. Create user profile
  const { error: profileError } = await supabase
    .from('users')
    .insert({
      id: authData.user!.id,
      email,
      user_type: userType,
      auth_provider: ['email'],
    })

  if (profileError) throw profileError

  // 3. Create type-specific profile
  const table = userType === 'student' ? 'students' : 'consultants'
  const { error: typeError } = await supabase
    .from(table)
    .insert({
      id: authData.user!.id,
      ...additionalData,
    })

  if (typeError) throw typeError

  return authData
}

export async function signInWithGoogle(userType: 'student' | 'consultant') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?type=${userType}`,
    },
  })

  if (error) throw error
  return data
}
```

## Current Progress

### ✅ Completed
1. Requirements gathering
2. Database schema design  
3. Documentation structure
4. Created migration 001 - Core user tables
5. Created migration 002 - Services and bookings
6. Created migration 003 - RLS policies for security
7. Updated browse consultants page to fetch from Supabase
8. Implemented auth helpers for signup/signin
9. Updated SignUpScreen with user type selection
10. Created auth callback page for OAuth
11. Updated OnboardingScreen to work with Supabase
12. Created seed data for testing
13. Implemented SignInScreen with Supabase auth
14. Created useConsultantData hook for data fetching
15. Updated consultant dashboard to use real data
16. Created ProtectedRoute component for auth protection

### 🔄 In Progress
1. Testing the complete auth flow
2. Fixing TypeScript errors

### ⏳ Todo
1. Create migrations for messaging, analytics, credits
2. Implement consultant services management
3. Set up real-time subscriptions for messaging
4. Implement booking system
5. Add credits/rewards functionality
6. Create student dashboard
7. Implement search with Typesense

## Important Implementation Notes

### Discount Protection
The booking system includes multiple safeguards against negative pricing:
1. Database constraint: `CHECK (final_price >= 0)`
2. Constraint: `CHECK (discount_amount < final_price)`
3. Maximum discount caps for percentage discounts
4. Validation in application logic before database insertion

### Auto-Verification Logic
For consultant verification:
```sql
IF edu_email_domain = university_domain THEN
  auto_verified = true
  verification_status = 'approved'
ELSE
  Upload document → verification_queue → manual review
END IF
```

### Credits System
- Students earn 2¢ credit per $1 spent (2% cashback)
- Credits stored as `credits_earned` in bookings table
- Automatically calculated using GENERATED column
- Credit balance tracked in students table with CHECK constraint >= 0

## Next Steps

### Immediate Actions Required

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Save your project URL and anon key

2. **Run Initial Migrations**
   - Copy the SQL from Step 3 above
   - Paste in Supabase SQL Editor
   - Execute the migrations

3. **Configure Storage**
   - Create the three buckets mentioned above
   - Set appropriate permissions

### What You Need to Do Now

1. **Test the Authentication Flow**:
   - Run the seed data SQL to add test consultants
   - Try signing up as both student and consultant
   - Test the onboarding flow
   - Check if consultants appear on the browse page

2. **Configure Google OAuth** (if not done):
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add redirect URL from Supabase
   - Update Supabase auth settings

3. **Next Implementation Steps**:
   - Should I create the sign-in page?
   - Add RLS policies for security?
   - Continue with messaging system?
   - Implement consultant services setup?

### Files Updated So Far

1. **Database**:
   - `/supabase/migrations/001_initial_schema.sql` - Core tables
   - `/supabase/migrations/002_services_and_bookings.sql` - Services system
   - `/supabase/migrations/003_rls_policies.sql` - Security policies
   - `/supabase/seed_data.sql` - Test data

2. **Authentication**:
   - `/lib/auth-helpers.ts` - Auth functions for signup/signin
   - `/packages/app/features/auth/screens/SignUpScreen.web.tsx` - Supabase signup
   - `/packages/app/features/auth/screens/SignInScreen.web.tsx` - Supabase signin
   - `/apps/next/app/auth/callback/page.tsx` - OAuth callback handler

3. **Onboarding**:
   - `/packages/app/features/onboarding/components/OnboardingScreen.tsx` - Profile completion

4. **Browse Page**:
   - `/apps/next/app/browse/page.tsx` - Fetches consultants from Supabase

5. **Consultant Dashboard**:
   - `/lib/hooks/useConsultantData.ts` - Data fetching hook
   - `/apps/next/app/consultant-dashboard/components/DashboardMain.tsx` - Real data integration
   - `/apps/next/app/consultant-dashboard/page.tsx` - Protected route

6. **Security**:
   - `/lib/components/ProtectedRoute.tsx` - Route protection component

### Testing Instructions

1. **Run Migrations**:
   ```sql
   -- In Supabase SQL Editor, run in order:
   -- 1. 001_initial_schema.sql
   -- 2. 002_services_and_bookings.sql
   -- 3. 003_rls_policies.sql
   -- 4. seed_data.sql (for test data)
   ```

2. **Test Sign Up**:
   - Go to `/sign-up`
   - Select user type (student/consultant)
   - Complete registration
   - Should redirect to `/onboarding`

3. **Test Onboarding**:
   - Complete profile information
   - Students → redirect to `/browse`
   - Consultants → redirect to `/consultant-dashboard`

4. **Test Browse Page**:
   - Should show seeded consultants
   - Filters should work (once we add more data)

### Notes on Discount Protection

The discount system includes these safeguards:
- Discounts stored as positive values (e.g., 20 for 20% off)
- Final price calculation: `base_price * (1 - discount/100) * rush_multiplier`
- Database constraint: `CHECK (final_price >= 0)`
- Application logic will validate: `discount_amount < final_price`

---

## Migration Files Organization

All migrations will be numbered and stored in `/supabase/migrations/`:
- `001_initial_schema.sql` - Core tables
- `002_services_and_bookings.sql` - Service system
- `003_messaging_system.sql` - Chat functionality
- `004_analytics_tables.sql` - Analytics tracking
- `005_credits_and_rewards.sql` - Credits system
- `006_rls_policies.sql` - Security policies

Continue to next section? [Y/N]