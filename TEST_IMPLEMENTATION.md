# Testing Your Guide System Implementation

## Step 1: Verify Database Setup

Run these queries in Supabase SQL Editor:

```sql
-- Check all guide tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%guide%';

-- Check if functions were created
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%guide%';
```

## Step 2: Create Test Data

1. First, get a real student ID:
```sql
SELECT id, name, email FROM students LIMIT 5;
```

2. Copy one of the IDs and update TEST_GUIDE_DATA.sql

3. Run the updated TEST_GUIDE_DATA.sql

## Step 3: Test in the App

### Mobile App Testing:
1. **Navigate to Profile Tab**
   - You should see the "Guides" stat card (if you set guides_published > 0 for your test user)
   - You should see "Your Guide Impact" section if is_guide_contributor = true

2. **Test Guide Creation**
   - From Profile, tap "Create guide →" or "Create New Guide"
   - Fill out the form
   - Save as draft or publish

3. **Browse Guides**
   - Go to Guides tab (it might not be visible yet - see note below)
   - Search and filter should work
   - Tap a guide to view it

4. **Manage Your Guides**
   - From Profile, tap "Manage Guides"
   - View your published and draft guides
   - Edit or delete guides

### Web App Testing:
1. **API Routes**
   ```bash
   # Test guide listing
   curl http://localhost:3000/api/guides
   
   # Test search
   curl http://localhost:3000/api/guides?q=personal+statement
   ```

## Step 4: Common Issues & Solutions

### Issue: "Guides" tab not showing
The tab was added but might need to be positioned:

```typescript
// In tabs.tsx, make sure Guides is in the right position
// You might want to replace one of the existing tabs temporarily
```

### Issue: Navigation errors
```typescript
// The navigation is already set up in index.tsx
// Just make sure components are imported correctly
```

### Issue: Empty guide list
- Make sure you ran the test data SQL
- Check that status = 'published' for test guides
- Verify the student ID matches your logged-in user

### Issue: Colors/Theme not working
- The theme system is already integrated
- Just make sure imports match the existing pattern

## Step 5: Verify Everything Works

✅ **Database**: All tables created
✅ **Navigation**: Can navigate to all guide screens  
✅ **Create**: Can create new guides
✅ **Browse**: Can see and search guides
✅ **View**: Can read guides and see comments
✅ **Manage**: Can edit/delete own guides
✅ **Profile**: Shows guide stats

## What's Next?

1. **Style Adjustments**: Tweak colors to match your theme
2. **Add Images**: Implement image upload for guides
3. **Email Notifications**: Notify authors of comments
4. **Analytics**: Build detailed analytics dashboard
5. **Moderation Queue**: Build admin interface for review