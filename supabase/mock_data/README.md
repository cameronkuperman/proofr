# Mock Data for Proofr

This directory contains CSV files with realistic mock data for the Proofr marketplace.

## Files

- **users.csv** - Base user accounts (65 total: 15 consultants, 50 students)
- **consultants.csv** - Consultant profiles with verification, ratings, and earnings
- **students.csv** - Student profiles with preferences and credit balances
- **services.csv** - Services offered by consultants (31 services)
- **bookings.csv** - Transactions between students and consultants
- **user_interactions.csv** - User behavior tracking (views, searches, bookings)
- **consultant_waitlist.csv** - Waitlist entries for unavailable consultants
- **group_session_participants.csv** - Participants in group tutoring sessions
- **discount_codes.csv** - Empty (no mock data)
- **discount_usage.csv** - Empty (no mock data)
- **verification_queue.csv** - Empty (no mock data)

## Loading Data

To import this data into your Supabase database:

1. Use Supabase Dashboard > Table Editor > Import CSV
2. Import in this order to respect foreign key constraints:
   1. users.csv
   2. consultants.csv
   3. students.csv
   4. services.csv
   5. bookings.csv
   6. user_interactions.csv
   7. consultant_waitlist.csv
   8. group_session_participants.csv

## Data Characteristics

- **Time Period**: Data spans 50 days, representing several weeks of marketplace operation
- **Consultants**: 15 consultants from top universities (Harvard, Stanford, MIT, Yale, etc.)
- **Students**: 50 students with varied engagement levels
- **Bookings**: Mix of completed, in-progress, pending, and cancelled bookings
- **Pricing**: Realistic pricing with rush delivery options (1.5x, 2x, 3x multipliers)
- **Credits**: Students earn 2% cashback on completed bookings
- **Ratings**: 1-5 star ratings with review text
- **Group Sessions**: Some services allow multiple participants

## Business Rules Reflected

- Consultants keep 80% of earnings (20% platform fee)
- Students earn 2% credits on completed bookings
- Rush delivery available at premium rates
- Consultants can go on vacation mode
- Waitlists for popular consultants
- Group sessions have participant limits