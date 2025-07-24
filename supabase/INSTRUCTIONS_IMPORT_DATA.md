# 📚 Instructions for Importing Bookings Mock Data to Supabase

## Prerequisites
Make sure you have:
1. Access to your Supabase project dashboard
2. The SQL editor open in Supabase
3. Some existing users, students, and consultants in your database

## Step 1: Check Existing Data
First, run these queries in the Supabase SQL editor to see what data you already have:

```sql
-- Check existing users
SELECT id, email, user_type FROM users ORDER BY created_at DESC LIMIT 20;

-- Check existing students  
SELECT id, name, email FROM students ORDER BY created_at DESC LIMIT 20;

-- Check existing consultants
SELECT id, name, university FROM consultants ORDER BY created_at DESC LIMIT 15;

-- Check existing services
SELECT s.id, s.name, c.name as consultant_name, s.allows_group_sessions 
FROM services s 
JOIN consultants c ON s.consultant_id = c.id 
LIMIT 20;
```

## Step 2: Import the Mock Data
1. Open the `seed_bookings_data.sql` file
2. Copy the entire contents
3. Paste it into the Supabase SQL editor
4. Click "Run" to execute

The script will create:
- ✅ Active bookings (upcoming, in-progress, pending)
- ✅ Completed bookings (some rated, some unrated for rating prompts)
- ✅ Group sessions (available to join and already enrolled)
- ✅ Saved consultants
- ✅ Waitlist entries

## Step 3: Verify the Import
Run these queries to verify everything imported correctly:

### Check Active Bookings
```sql
SELECT 
  b.id,
  b.status,
  b.scheduled_at,
  c.name as consultant_name,
  s.name as student_name,
  b.service_type,
  b.final_price
FROM bookings b
JOIN consultants c ON b.consultant_id = c.id
JOIN students s ON b.student_id = s.id
WHERE b.status IN ('pending', 'confirmed', 'in_progress')
ORDER BY b.scheduled_at;
```

### Check Unrated Bookings (Should Show Count)
```sql
SELECT 
  COUNT(*) as unrated_count,
  STRING_AGG(c.name, ', ') as consultants_to_rate
FROM bookings b
JOIN consultants c ON b.consultant_id = c.id
WHERE b.status = 'completed' AND b.rating IS NULL;
```

### Check Group Sessions
```sql
SELECT 
  b.id,
  b.service_type,
  c.name as consultant_name,
  b.scheduled_at,
  b.current_participants || '/' || b.max_participants as spots,
  b.final_price as price_per_person
FROM bookings b
JOIN consultants c ON b.consultant_id = c.id
WHERE b.is_group_session = true 
  AND b.scheduled_at > NOW()
  AND b.status = 'confirmed';
```

### Check Your Enrolled Group Sessions
```sql
-- Replace 'your-student-id' with an actual student ID
SELECT 
  b.service_type,
  c.name as consultant_name,
  b.scheduled_at,
  COUNT(gsp.id) as total_participants
FROM bookings b
JOIN consultants c ON b.consultant_id = c.id
JOIN group_session_participants gsp ON b.id = gsp.booking_id
WHERE b.is_group_session = true 
  AND gsp.student_id = 'your-student-id'
GROUP BY b.id, b.service_type, c.name, b.scheduled_at;
```

### Check Saved Consultants
```sql
SELECT 
  sc.saved_at,
  c.name,
  c.university,
  c.rating,
  c.hourly_rate
FROM saved_consultants sc
JOIN consultants c ON sc.consultant_id = c.id
WHERE sc.student_id IN (SELECT id FROM students ORDER BY created_at DESC LIMIT 1)
ORDER BY sc.saved_at DESC;
```

## Step 4: Test in the App
1. Go to `/bookings` in your web app
2. You should see:
   - **Active Tab**: Upcoming sessions, in-progress work, and pending bookings
   - **History Tab**: Completed sessions with some showing "Rate your experience" prompts
   - **Saved Tab**: Your saved consultants and any waitlist positions

## Troubleshooting

### If you get foreign key errors:
- Make sure you have users, students, and consultants in your database first
- The script references consultants by name (Sarah, Michael, Emma, etc.) - adjust if your consultant names are different

### If group sessions don't show:
- Check that your services table has `allows_group_sessions = true` for some services
- Run: `UPDATE services SET allows_group_sessions = true, max_group_size = 8 WHERE service_type IN ('essay_review', 'sat_tutoring', 'interview_prep') LIMIT 3;`

### To clean up and start over:
```sql
-- Delete all test bookings
DELETE FROM group_session_participants WHERE booking_id IN (SELECT id FROM bookings WHERE created_at > NOW() - INTERVAL '1 hour');
DELETE FROM bookings WHERE created_at > NOW() - INTERVAL '1 hour';
DELETE FROM saved_consultants WHERE saved_at > NOW() - INTERVAL '1 hour';
DELETE FROM consultant_waitlist WHERE joined_at > NOW() - INTERVAL '1 hour';
```

## Notes
- The script uses relative dates (NOW() + intervals) so bookings will always be relevant
- Credits are automatically calculated at 2% cashback
- Some bookings are intentionally left unrated to trigger the rating prompts
- Group sessions have varying participant counts to show availability