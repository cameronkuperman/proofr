# Booking Request System - Test Guide

## ✅ Completed Features

### 1. Database Schema
- ✅ `booking_requests` table with status workflow
- ✅ `booking_text_inputs` for pasted content
- ✅ `booking_file_uploads` for file tracking
- ✅ `booking_doc_links` for Google Docs
- ✅ `booking_request_messages` for chat
- ✅ RLS policies for security

### 2. Student Features
- ✅ **Appointments Page** (`/appointments`)
  - Form for service purpose and requirements
  - Three input methods: text, file upload, Google Doc links
  - Side panel showing material summary
  - Auto-save functionality for drafts
  - Review modal before submission

- ✅ **My Requests Page** (`/student-dashboard/requests`)
  - View all booking requests
  - Filter by status (draft, pending, active, completed)
  - See request details and status
  - Continue drafts or view active requests

### 3. Consultant Features
- ✅ **Requests Dashboard** (`/consultant-dashboard/requests`)
  - Review incoming requests
  - Accept with price quote
  - Reject with reason
  - Start discussion before accepting
  - View all submitted materials

- ✅ **Book Now Integration**
  - Updated consultant profiles with "Book Now" buttons
  - Direct navigation to appointments page
  - Service pre-selection

### 4. Status Workflow
```
draft → pending_review → in_discussion → accepted → paid → completed
                      ↘                ↗
                         rejected
```

## Testing Instructions

### Test 1: Create a Booking Request (Student)
1. Navigate to `/browse`
2. Click on any consultant
3. Click "Book Now" on any service
4. You'll be redirected to `/appointments?consultant=[id]&service=[id]`
5. Fill in:
   - Purpose of Service
   - Additional Requirements (optional)
   - Deadline (optional)
   - Add some text content or Google Doc links
6. Click "Review & Submit"
7. Confirm in the modal
8. You'll be redirected to `/student-dashboard/requests`

### Test 2: Review Requests (Consultant)
1. Sign in as a consultant
2. Navigate to `/consultant-dashboard/requests`
3. You'll see pending requests
4. Click "Review Request"
5. View the details and materials
6. Either:
   - Start Discussion (to ask questions)
   - Accept with price quote
   - Reject with reason

### Test 3: Direct Navigation
- `/appointments` - Shows "No Service Selected" message
- `/appointments?consultant=[id]&service=[id]` - Shows booking form
- `/student-dashboard/requests` - Shows all student requests
- `/consultant-dashboard/requests` - Shows consultant's incoming requests

## Known Limitations (To Be Implemented)

1. **File Upload Storage**: Currently simulated - needs Supabase Storage bucket setup
2. **Chat Interface**: Placeholder UI - needs real-time messaging implementation
3. **Payment Integration**: Acceptance triggers payment flow (not implemented)
4. **Auto-deletion**: 30-day file deletion needs cron job

## Quick Fix for File Uploads

To enable real file uploads, run this in Supabase SQL Editor:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'booking-uploads',
  'booking-uploads',
  false,
  262144000, -- 250MB
  ARRAY['application/pdf', 'text/plain', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);
```

## Database Migration Applied
✅ Migration `010_booking_requests_system_fixed.sql` successfully applied

## File Structure
```
/appointments                          # Booking form page
/student-dashboard/requests           # Student's requests
/consultant-dashboard/requests        # Consultant's incoming requests

packages/app/features/booking-request/
├── screens/
│   ├── BookingRequestScreen.web.tsx
│   ├── StudentRequestsScreen.web.tsx
│   └── ConsultantRequestsScreen.web.tsx
├── components/
│   ├── BookingRequestForm.web.tsx
│   ├── UploadStatusPanel.web.tsx
│   ├── ReviewConfirmationModal.web.tsx
│   ├── RequestCard.web.tsx
│   └── ConsultantRequestModal.web.tsx
└── types/
    └── booking-request.types.ts
```

## Success Metrics
- ✅ Page loads without errors
- ✅ Forms are interactive
- ✅ Navigation works between pages
- ✅ Data persists in database
- ✅ Status workflow functions correctly
- ✅ RLS policies protect data