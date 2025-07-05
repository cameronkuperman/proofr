# RLS Migration Order

Run these migrations in the Supabase SQL editor in this exact order:

## Already Completed:
1. ✅ `001_initial_schema.sql` - Creates basic tables
2. ✅ `002_services_and_bookings.sql` - Creates service-related tables

## Run These Next (in order):
3. `003a_enable_rls.sql` - Enables RLS on all tables
4. `003b_user_policies.sql` - Basic user/student/consultant policies
5. `003c_services_bookings_policies.sql` - Services and bookings policies
6. `003d_remaining_policies.sql` - Remaining policies and view update
7. `003e_verification_protection.sql` - Triggers for data protection

## DO NOT RUN:
- ❌ `003_rls_policies.sql` (original - has errors)
- ❌ `003_rls_policies_fixed.sql` (still has OLD reference issues)
- ❌ `004_show_all_consultants.sql` (already included in 003d)

## Key Changes:
- **ALL consultants are visible** - verification only adds checkmark
- Consultants can start working immediately
- No OLD references in RLS policies (moved to triggers)
- Split into smaller files for easier debugging

## After Running:
Your browse page will show all consultants regardless of verification status!