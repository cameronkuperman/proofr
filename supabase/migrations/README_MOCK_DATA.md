# 📊 Mock Bookings Data Migration

## What This Migration Does

This migration (`20240123_mock_bookings_data.sql`) creates realistic booking data for testing the bookings page. It's **safe to run** and won't break anything because:

1. ✅ Uses `ON CONFLICT DO NOTHING` - won't create duplicates
2. ✅ Uses actual IDs from your database - no foreign key errors
3. ✅ Wrapped in a transaction - all or nothing
4. ✅ Only updates consultant stats for newly created bookings

## Data Created

### 🗓️ Active Bookings
- **Upcoming Sessions**: 3 confirmed bookings in the next week
- **In Progress**: 1 essay review being worked on
- **Pending**: 1 booking awaiting consultant confirmation

### 📝 Booking History
- **Rated Sessions**: 3 completed bookings with 4-5 star ratings
- **Unrated Sessions**: 2 completed bookings that need ratings (triggers the rating prompt)

### 👥 Group Sessions
- **Essay Workshop**: 3/5 spots filled, happening in 2 days
- **SAT Math Bootcamp**: 2/8 spots filled, happening in 4 days
- Automatically joins some students to these sessions

### 💾 Saved & Waitlists
- **Saved Consultants**: Top-rated consultants saved by students
- **Waitlists**: Queue positions for popular consultants

## How to Apply This Migration

### Option 1: Through Supabase Dashboard
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy the entire contents of `20240123_mock_bookings_data.sql`
4. Paste and click "Run"

### Option 2: Using Supabase CLI
```bash
cd /path/to/proofr
supabase db push
```

## Student Accounts to Test With

The migration uses these real student IDs from your database:

1. **Main Student** (ibm@gmail.com)
   - ID: `338feabe-39f2-492a-93e4-ee746bf727b7`
   - Has: Upcoming sessions, completed sessions, saved consultants

2. **Secondary Student** (icecam000001@gmail.com)
   - ID: `e4bf552b-5275-40f9-a598-3793d8a1f4e9`
   - Has: Interview prep booking, some history

3. **Other Students** with various bookings:
   - claire.bell@gmail.com
   - felix.morgan@gmail.com
   - maya.cook@gmail.com

## What You'll See in the App

### Active Tab
- Tomorrow's essay review with Amanda (Brown)
- Interview prep in 3 days with Kevin (UPenn)
- Strategy session next week with Jessica (Columbia)
- An in-progress essay review
- A pending booking awaiting confirmation

### History Tab
- "Rate your recent sessions!" prompt with 2 unrated bookings
- Several completed sessions with ratings
- "+5 credits for detailed reviews" incentive

### Saved Tab
- Multiple saved consultants from top schools
- Waitlist positions for popular consultants
- Price tracking (the component has mock price changes)

## Verification Queries

After running the migration, verify it worked:

```sql
-- Count bookings by status
SELECT status, COUNT(*) 
FROM bookings 
WHERE created_at > NOW() - INTERVAL '1 minute'
GROUP BY status;

-- Check group session participants
SELECT b.service_type, COUNT(gsp.id) as participants
FROM bookings b
LEFT JOIN group_session_participants gsp ON b.id = gsp.booking_id
WHERE b.is_group_session = true
GROUP BY b.id, b.service_type;
```

## Troubleshooting

### If you get "service_id cannot be null" errors
Some consultants might not have services set up. The migration handles this by only inserting bookings where services exist.

### To clean up and start over
```sql
-- Remove all bookings created by this migration
DELETE FROM group_session_participants 
WHERE joined_at > NOW() - INTERVAL '1 day';

DELETE FROM bookings 
WHERE created_at > NOW() - INTERVAL '30 days'
  AND prompt_text LIKE '%Common App%'
  OR prompt_text LIKE '%Group workshop%';

DELETE FROM saved_consultants 
WHERE saved_at > NOW() - INTERVAL '30 days';

DELETE FROM consultant_waitlist 
WHERE joined_at > NOW() - INTERVAL '30 days';
```

## Navigation Back to Dashboard

The bookings page now includes:
- **Back to Dashboard** button with arrow
- Top navigation bar with quick links
- User email display
- Profile avatar button

Access the bookings page from:
- Student Dashboard → "Orders" button
- Student Dashboard → "View all →" link in Active Bookings section
- Direct URL: `/bookings`