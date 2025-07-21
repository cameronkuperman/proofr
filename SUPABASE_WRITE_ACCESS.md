# Supabase Write Access Setup

## Current Issue
You're connected as `supabase_read_only_user` which prevents inserting mock data. Here's how to fix it:

## Option 1: Use Supabase Dashboard (Easiest)
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the migration file content
4. Click "Run"

## Option 2: Use Supabase CLI with Proper Permissions
```bash
# Apply the migration
supabase migration up

# Or if you haven't linked your project yet:
supabase link --project-ref your-project-ref
supabase db push
```

## Option 3: Connect with Write Permissions via CLI
```bash
# Get your database URL with write permissions
supabase db url

# This will give you a connection string like:
# postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Then run the migration:
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" -f supabase/migrations/20250119_comprehensive_mock_data.sql
```

## Option 4: Set Up Service Role for MCP
If you want me to have write access through MCP:

1. **Get your service role key** (has full database access):
   ```bash
   supabase status
   # Look for "service_role key"
   ```

2. **Update your MCP configuration** in `.mcp.json`:
   ```json
   {
     "supabase": {
       "url": "https://[PROJECT-REF].supabase.co",
       "service_role_key": "[YOUR-SERVICE-ROLE-KEY]"
     }
   }
   ```

   ⚠️ **Security Warning**: The service role key bypasses RLS. Only use in development!

3. **Alternative: Create a specific database role**:
   ```sql
   -- Run this in Supabase SQL Editor as postgres user
   CREATE ROLE mock_data_writer WITH LOGIN PASSWORD 'secure-password';
   GRANT INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO mock_data_writer;
   GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO mock_data_writer;
   ```

## Quick Fix for Now
Since the migration file is already created, the easiest approach is:

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy the content from `/supabase/migrations/20250119_comprehensive_mock_data.sql`
4. Paste and run it

The migration has been fixed to handle the `credits_earned` generated column properly!