# Proofr Database Schema

## Overview
This document describes the complete database schema for Proofr, a marketplace connecting students with college consultants.

## Tables

### users
Base authentication and user table.
- `id` (uuid, PK): User's unique identifier
- `email` (text, UNIQUE): User's email address
- `phone` (text): Optional phone number
- `user_type` (enum): Either 'student' or 'consultant'
- `profile_image_url` (text): URL to profile image
- `auth_provider` (text[]): Array of auth providers used
- `is_active` (boolean): Whether account is active
- `last_login` (timestamp): Last login time
- `created_at` (timestamp): Account creation time
- `updated_at` (timestamp): Last update time

### students
Student profiles, extends users table.
- `id` (uuid, PK, FK->users.id): Same as user id
- `name` (text): Student's full name
- `bio` (text): Short bio
- `current_school` (text): Current school name
- `school_type` (enum): 'high-school' or 'college'
- `grade_level` (enum): 'senior', 'junior', 'sophomore', 'freshman', 'transfer'
- `target_application_year` (integer): Year applying to college (2024-2030)
- `preferred_colleges` (text[]): Array of target schools
- `interests` (text[]): Academic/career interests
- `pain_points` (text[]): Areas needing help
- `budget_range` (int4range): Min/max budget range
- `credit_balance` (numeric): Current credit balance
- `lifetime_credits_earned` (numeric): Total credits earned
- `onboarding_completed` (boolean): Finished onboarding
- `onboarding_step` (integer): Current onboarding step
- `metadata` (jsonb): Additional data
- `created_at` (timestamp): Profile creation time
- `updated_at` (timestamp): Last update time

### consultants
Consultant profiles, extends users table.
- `id` (uuid, PK, FK->users.id): Same as user id
- `name` (text): Consultant's full name
- `bio` (text): Short bio (profile preview)
- `long_bio` (text): Detailed bio
- `current_college` (text): Current university
- `colleges_attended` (jsonb): Array of previous colleges
- `major` (text): Field of study
- `graduation_year` (integer): Expected/actual graduation (2020-2030)
- `verification_status` (enum): 'pending', 'approved', 'rejected'
- `verified_at` (timestamp): Verification date
- `verified_by` (uuid, FK->users.id): Admin who verified
- `verification_method` (enum): 'edu_email', 'manual', 'document'
- `edu_email` (text): Educational email
- `auto_verified` (boolean): Auto-verified via edu email
- `is_available` (boolean): Currently accepting bookings
- `vacation_mode` (boolean): On vacation
- `vacation_message` (text): Message when on vacation
- `services_preview` (jsonb): Quick preview of services/prices
- `supports_rush_delivery` (boolean): Offers rush service
- `rush_multipliers` (jsonb): Rush pricing (e.g., {"1.5x": 24, "2x": 12, "3x": 6})
- `rating` (numeric): Average rating (0-5)
- `total_reviews` (integer): Number of reviews
- `total_bookings` (integer): Total completed bookings
- `total_earnings` (numeric): Lifetime earnings
- `response_time_hours` (numeric): Average response time
- `timezone` (text): Consultant's timezone
- `calendly_url` (text): Calendly scheduling link
- `profile_views` (integer): Profile view count
- `last_active` (timestamp): Last activity
- `metadata` (jsonb): Additional data
- `created_at` (timestamp): Profile creation time
- `updated_at` (timestamp): Last update time

### services
Services offered by consultants.
- `id` (uuid, PK): Service ID
- `consultant_id` (uuid, FK->consultants.id): Consultant offering service
- `service_type` (text): Type of service
- `title` (text): Service title
- `description` (text): Detailed description
- `prices` (numeric[]): Array of price tiers
- `price_descriptions` (text[]): Description for each price tier
- `delivery_type` (enum): 'async', 'scheduled', 'instant'
- `standard_turnaround_hours` (integer): Normal delivery time
- `duration_minutes` (integer): For scheduled sessions
- `rush_available` (boolean): Can be rushed
- `rush_turnarounds` (jsonb): Rush delivery options
- `max_active_orders` (integer): Concurrent order limit
- `is_active` (boolean): Service is available
- `allows_group_sessions` (boolean): Allows multiple students
- `max_group_size` (integer): Max students per group
- `total_bookings` (integer): Times booked
- `avg_rating` (numeric): Average rating
- `metadata` (jsonb): Additional data
- `created_at` (timestamp): Service creation time
- `updated_at` (timestamp): Last update time

### bookings
Transactions between students and consultants.
- `id` (uuid, PK): Booking ID
- `student_id` (uuid, FK->students.id): Student who booked
- `consultant_id` (uuid, FK->consultants.id): Consultant providing service
- `service_id` (uuid, FK->services.id): Service being booked
- `base_price` (numeric): Original price
- `price_tier` (text): Which price tier was selected
- `rush_multiplier` (numeric): 1, 1.5, 2, or 3
- `discount_code` (text): Applied discount code
- `discount_amount` (numeric): Discount amount
- `final_price` (numeric): Price after rush/discount
- `prompt_text` (text): Student's request/prompt
- `essay_text` (text): Essay content (if applicable)
- `requirements_text` (text): Additional requirements
- `google_doc_link` (text): Link to Google Doc
- `uploaded_files` (jsonb): Array of uploaded files
- `is_rush` (boolean): Rush delivery requested
- `promised_delivery_at` (timestamp): Delivery deadline
- `delivered_at` (timestamp): Actual delivery time
- `deliverables` (jsonb): Links/files delivered
- `scheduled_at` (timestamp): For scheduled sessions
- `calendly_event_url` (text): Calendly event link
- `meeting_link` (text): Zoom/Meet link
- `status` (enum): 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'
- `completed_at` (timestamp): Completion time
- `cancelled_at` (timestamp): Cancellation time
- `cancelled_by` (uuid, FK->users.id): Who cancelled
- `cancellation_reason` (text): Why cancelled
- `credits_earned` (numeric): Credits earned (2% of final_price)
- `rating` (integer): 1-5 star rating
- `review_text` (text): Written review
- `reviewed_at` (timestamp): Review time
- `is_group_session` (boolean): Group booking
- `max_participants` (integer): Max for group
- `current_participants` (integer): Current enrolled
- `refund_requested` (boolean): Refund requested
- `refund_reason` (text): Refund justification
- `refund_status` (enum): 'pending', 'approved', 'rejected', 'processed'
- `refund_amount` (numeric): Amount to refund
- `refunded_at` (timestamp): Refund time
- `metadata` (jsonb): Additional data
- `created_at` (timestamp): Booking creation time
- `updated_at` (timestamp): Last update time

### user_interactions
Tracks user behavior and engagement.
- `id` (uuid, PK): Interaction ID
- `student_id` (uuid, FK->students.id): Student involved
- `consultant_id` (uuid, FK->consultants.id): Consultant involved
- `interaction_type` (enum): 'view_profile', 'view_service', 'search', 'contact_initiated', 'booking_created', 'booking_completed'
- `service_type` (text): Type of service viewed/searched
- `rating` (integer): Rating given (for completed bookings)
- `session_id` (text): Web session ID
- `created_at` (timestamp): Interaction time

### consultant_waitlist
Waitlist for unavailable consultants.
- `id` (uuid, PK): Waitlist entry ID
- `consultant_id` (uuid, FK->consultants.id): Consultant with waitlist
- `student_id` (uuid, FK->students.id): Student on waitlist
- `service_id` (uuid, FK->services.id): Service interested in
- `position` (integer): Position in queue
- `notified` (boolean): Student was notified
- `notified_at` (timestamp): Notification time
- `expires_at` (timestamp): When spot expires
- `created_at` (timestamp): Added to waitlist

### group_session_participants
Tracks students in group sessions.
- `id` (uuid, PK): Participant ID
- `booking_id` (uuid, FK->bookings.id): Group booking
- `student_id` (uuid, FK->students.id): Participating student
- `joined_at` (timestamp): When joined

### discount_codes
Promotional discount codes.
- `id` (uuid, PK): Discount code ID
- `code` (text, UNIQUE): The discount code
- `description` (text): Code description
- `discount_type` (enum): 'percentage' or 'fixed'
- `discount_value` (numeric): Amount/percentage off
- `minimum_purchase` (numeric): Min purchase required
- `maximum_discount` (numeric): Max discount amount
- `valid_from` (timestamp): Start date
- `valid_until` (timestamp): Expiration date
- `max_uses` (integer): Total use limit
- `used_count` (integer): Times used
- `max_uses_per_user` (integer): Per-user limit
- `consultant_id` (uuid, FK->consultants.id): Consultant-specific code
- `specific_services` (uuid[]): Limited to certain services
- `created_by` (uuid, FK->users.id): Who created code
- `is_active` (boolean): Code is active
- `created_at` (timestamp): Creation time
- `updated_at` (timestamp): Last update

### discount_usage
Tracks discount code usage.
- `id` (uuid, PK): Usage ID
- `discount_code_id` (uuid, FK->discount_codes.id): Code used
- `booking_id` (uuid, FK->bookings.id, UNIQUE): Booking with discount
- `user_id` (uuid, FK->users.id): User who used code
- `discount_applied` (numeric): Amount discounted
- `created_at` (timestamp): Usage time

### verification_queue
Consultant verification requests.
- `id` (uuid, PK): Request ID
- `consultant_id` (uuid, FK->consultants.id): Consultant to verify
- `edu_email` (text): Educational email
- `university_name` (text): University name
- `document_type` (enum): 'assignment', 'acceptance_letter', 'transcript', 'student_id'
- `document_url` (text): Uploaded document
- `auto_verify_eligible` (boolean): Can be auto-verified
- `status` (enum): 'pending', 'approved', 'rejected'
- `reviewed_by` (uuid, FK->users.id): Admin who reviewed
- `reviewed_at` (timestamp): Review time
- `admin_notes` (text): Review notes
- `created_at` (timestamp): Request time

### student_guides
Student-created guides and resources.
- `id` (uuid, PK): Guide ID
- `author_id` (uuid, FK->students.id): Student author
- `title` (varchar(200)): Guide title
- `slug` (varchar(250), UNIQUE): URL-friendly slug
- `description` (text): Guide description
- `category` (enum): 'essays', 'interviews', 'test_prep', 'applications', 'financial_aid', 'extracurriculars', 'research', 'international', 'transfer', 'gap_year', 'other'
- `difficulty` (enum): 'beginner', 'intermediate', 'advanced'
- `content` (jsonb): Rich content with sections, text, images, examples
- `table_of_contents` (jsonb): Auto-generated TOC
- `read_time` (integer): Estimated reading time in minutes
- `word_count` (integer): Total word count
- `status` (enum): 'draft', 'pending_review', 'published', 'flagged', 'archived'
- `moderation_notes` (text): AI/manual moderation feedback
- `moderation_score` (decimal): AI quality score (0-1)
- `reviewed_at` (timestamp): Moderation review time
- `published_at` (timestamp): Publication time
- `view_count` (integer): Total views
- `helpful_count` (integer): Users who found it helpful
- `bookmark_count` (integer): Total bookmarks
- `share_count` (integer): Total shares
- `avg_rating` (decimal): Average rating (1-5)
- `tags` (text[]): Search tags
- `meta_description` (varchar(160)): SEO description
- `featured` (boolean): Featured guide
- `featured_order` (integer): Order in featured list
- `version` (integer): Version number
- `last_major_update` (timestamp): Last significant update
- `created_at` (timestamp): Creation time
- `updated_at` (timestamp): Last update time

### guide_sections
Structured sections within guides.
- `id` (uuid, PK): Section ID
- `guide_id` (uuid, FK->student_guides.id): Parent guide
- `title` (varchar(200)): Section title
- `slug` (varchar(250)): URL slug
- `order_index` (integer): Display order
- `content` (jsonb): Rich content
- `parent_section_id` (uuid, FK->guide_sections.id): Parent section (nested)
- `depth` (integer): Nesting depth
- `created_at` (timestamp): Creation time
- `updated_at` (timestamp): Last update time

### guide_interactions
User engagement with guides.
- `id` (uuid, PK): Interaction ID
- `guide_id` (uuid, FK->student_guides.id): Guide
- `user_id` (uuid, FK->users.id): User
- `viewed` (boolean): Has viewed
- `viewed_at` (timestamp): View time
- `read_progress` (decimal): Reading progress (0-100%)
- `bookmarked` (boolean): Is bookmarked
- `bookmarked_at` (timestamp): Bookmark time
- `found_helpful` (boolean): Found helpful
- `rating` (integer): Rating (1-5)
- `rated_at` (timestamp): Rating time
- `personal_notes` (text): Private notes
- `shared` (boolean): Has shared
- `shared_at` (timestamp): Share time
- `share_medium` (varchar(50)): Share platform
- `created_at` (timestamp): First interaction
- `updated_at` (timestamp): Last update

### guide_comments
Comments and feedback on guides.
- `id` (uuid, PK): Comment ID
- `guide_id` (uuid, FK->student_guides.id): Guide
- `user_id` (uuid, FK->users.id): Commenter
- `content` (text): Comment text
- `is_question` (boolean): Is a question
- `parent_comment_id` (uuid, FK->guide_comments.id): Parent (threading)
- `flagged` (boolean): Flagged for review
- `hidden` (boolean): Hidden by moderation
- `helpful_count` (integer): Helpful votes
- `created_at` (timestamp): Comment time
- `updated_at` (timestamp): Last edit

### guide_resources
Downloadable resources attached to guides.
- `id` (uuid, PK): Resource ID
- `guide_id` (uuid, FK->student_guides.id): Parent guide
- `title` (varchar(200)): Resource title
- `description` (text): Resource description
- `resource_type` (varchar(50)): 'template', 'checklist', 'worksheet', 'example', etc.
- `file_url` (text): Download URL
- `file_name` (varchar(255)): Original filename
- `file_size` (integer): Size in bytes
- `mime_type` (varchar(100)): File MIME type
- `download_count` (integer): Total downloads
- `requires_account` (boolean): Login required
- `order_index` (integer): Display order
- `created_at` (timestamp): Upload time
- `updated_at` (timestamp): Last update

### guide_relations
Related guides and learning paths.
- `id` (uuid, PK): Relation ID
- `from_guide_id` (uuid, FK->student_guides.id): Source guide
- `to_guide_id` (uuid, FK->student_guides.id): Target guide
- `relation_type` (varchar(50)): 'prerequisite', 'next_step', 'related', 'alternative'
- `order_index` (integer): Order in relation type
- `created_at` (timestamp): Relation created

### guide_service_links
Links between guides and consultant services.
- `id` (uuid, PK): Link ID
- `guide_id` (uuid, FK->student_guides.id): Guide
- `service_id` (uuid, FK->services.id): Service
- `consultant_id` (uuid, FK->consultants.id): Consultant
- `link_text` (varchar(200)): CTA text
- `link_type` (varchar(50)): 'author_service', 'recommended', 'sponsored'
- `click_count` (integer): Total clicks
- `conversion_count` (integer): Clicks that converted
- `created_at` (timestamp): Link created

### guide_collections
Curated collections of guides.
- `id` (uuid, PK): Collection ID
- `creator_id` (uuid, FK->users.id): Creator
- `title` (varchar(200)): Collection title
- `slug` (varchar(250), UNIQUE): URL slug
- `description` (text): Collection description
- `is_official` (boolean): Proofr-curated
- `is_learning_path` (boolean): Sequential learning
- `is_public` (boolean): Public visibility
- `subscriber_count` (integer): Total subscribers
- `created_at` (timestamp): Creation time
- `updated_at` (timestamp): Last update

### collection_guides
Guides within collections.
- `id` (uuid, PK): Entry ID
- `collection_id` (uuid, FK->guide_collections.id): Collection
- `guide_id` (uuid, FK->student_guides.id): Guide
- `order_index` (integer): Position in collection
- `added_at` (timestamp): When added

## Key Relationships
1. `students.id` -> `users.id` (1:1)
2. `consultants.id` -> `users.id` (1:1)
3. `services.consultant_id` -> `consultants.id` (M:1)
4. `bookings.student_id` -> `students.id` (M:1)
5. `bookings.consultant_id` -> `consultants.id` (M:1)
6. `bookings.service_id` -> `services.id` (M:1)
7. `user_interactions.student_id` -> `students.id` (M:1)
8. `user_interactions.consultant_id` -> `consultants.id` (M:1)
9. `consultant_waitlist.consultant_id` -> `consultants.id` (M:1)
10. `consultant_waitlist.student_id` -> `students.id` (M:1)
11. `group_session_participants.booking_id` -> `bookings.id` (M:1)
12. `group_session_participants.student_id` -> `students.id` (M:1)
13. `student_guides.author_id` -> `students.id` (M:1)
14. `guide_sections.guide_id` -> `student_guides.id` (M:1)
15. `guide_interactions.guide_id` -> `student_guides.id` (M:1)
16. `guide_interactions.user_id` -> `users.id` (M:1)
17. `guide_comments.guide_id` -> `student_guides.id` (M:1)
18. `guide_resources.guide_id` -> `student_guides.id` (M:1)
19. `guide_relations.from_guide_id` -> `student_guides.id` (M:1)
20. `guide_relations.to_guide_id` -> `student_guides.id` (M:1)
21. `guide_service_links.guide_id` -> `student_guides.id` (M:1)
22. `guide_service_links.service_id` -> `services.id` (M:1)
23. `guide_collections.creator_id` -> `users.id` (M:1)
24. `collection_guides.collection_id` -> `guide_collections.id` (M:1)
25. `collection_guides.guide_id` -> `student_guides.id` (M:1)

## Business Rules
- Consultants keep 80% of earnings (20% platform fee)
- Students earn 2% cashback as credits on completed bookings
- Rush multipliers: 1.5x (24hr), 2x (12hr), 3x (6hr)
- Ratings are 1-5 stars
- Verification required for consultants to be active
- Group sessions have participant limits
- Student guides are free to create and access
- Guides undergo AI moderation before publishing
- Students can link consultant services in their guides
- Both students and consultants can create guides
- Guide authors are credited on their profiles