# 📧 Proofr Email Notification System

A comprehensive email notification system built with **Brevo** (formerly SendinBlue) that ensures students and consultants never miss important updates.

## 🎯 Overview

The email notification system automatically sends transactional emails for key events:
- Booking confirmations and updates
- New messages (rate-limited)
- Payment notifications
- Profile verification updates
- Service completions

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Supabase  │────▶│   Next.js    │────▶│    Brevo    │
│  Database   │     │  API Routes  │     │   Email     │
│  Triggers   │     │              │     │   Service   │
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │                     │
       ▼                    ▼                     ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Events    │     │  Processing  │     │   Delivery  │
└─────────────┘     └──────────────┘     └─────────────┘
```

## 🚀 Quick Start

### 1. Set Up Brevo Account

1. Sign up at [Brevo.com](https://www.brevo.com)
2. Navigate to **Settings > API Keys**
3. Create a new API key
4. Copy the API key for your `.env.local` file

### 2. Configure Environment Variables

Create `.env.local` in the root directory:

```env
# Brevo Configuration
BREVO_API_KEY=xkeysib-your-api-key-here
BREVO_SENDER_EMAIL=notifications@proofr.com
BREVO_SENDER_NAME=Proofr

# Application URL
NEXT_PUBLIC_APP_URL=https://proofr.com

# Webhook Security
DATABASE_WEBHOOK_SECRET=your-secret-here
CRON_SECRET=your-cron-secret-here
```

### 3. Run Database Migration

```bash
# Apply the email notification tables migration
npx supabase db push
```

### 4. Set Up Webhooks in Brevo

1. Go to **Transactional > Settings > Webhooks**
2. Add webhook URL: `https://yourapp.com/api/emails/webhook`
3. Select events: `sent`, `delivered`, `opened`, `clicked`, `bounce`, `spam`

### 5. Configure Cron Job

For production, set up a cron job to process pending emails:

```bash
# Vercel cron (vercel.json)
{
  "crons": [{
    "path": "/api/cron/emails",
    "schedule": "* * * * *"
  }]
}
```

## 📨 Email Types

### For Students
- **booking_confirmation** - Sent when booking is created
- **booking_accepted** - Consultant accepts the booking
- **booking_declined** - Booking is cancelled
- **service_completed** - Service is delivered
- **new_message** - New message received (rate-limited to 1 per 5 minutes)
- **credits_earned** - Cashback credits earned
- **waitlist_available** - Spot opens on waitlist

### For Consultants
- **new_booking_request** - New booking received
- **payment_update** - Payment processed
- **profile_update** - Verification status changes
- **review_notification** - New review received
- **new_message** - New message received

## 🎨 Email Templates

Templates are stored in `/apps/next/templates/emails/`

### Template Structure
```
templates/emails/
├── booking_confirmation.html    # HTML template
├── booking_confirmation.json    # Metadata & variables
└── booking_confirmation.txt     # Plain text version (optional)
```

### Template Variables
Templates use Handlebars-style variables:
```html
<p>Hi {{student_name}},</p>
<p>Your booking with {{consultant_name}} is confirmed!</p>
```

### Creating New Templates

1. Create HTML template:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Your styles */
  </style>
</head>
<body>
  <h1>{{subject}}</h1>
  <p>{{content}}</p>
</body>
</html>
```

2. Create metadata file:
```json
{
  "name": "Template Name",
  "subject": "Email subject with {{variables}}",
  "variables": ["var1", "var2"],
  "description": "When this email is sent"
}
```

## 🔧 API Endpoints

### Send Test Email (Development Only)
```bash
POST /api/emails/send
{
  "test": true,
  "to": "test@example.com",
  "templateId": "booking_confirmation",
  "sampleData": {
    "student_name": "John Doe",
    "consultant_name": "Jane Smith"
  }
}
```

### Process Pending Notifications
```bash
GET /api/cron/emails
Authorization: Bearer YOUR_CRON_SECRET
```

### Check Notification Status
```bash
GET /api/emails/send?userId=USER_ID&status=pending
```

## 🔄 Database Triggers

The system uses PostgreSQL triggers to automatically queue emails:

```sql
-- Example: Booking creation trigger
CREATE TRIGGER notify_on_booking_events
AFTER INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION notify_booking_event();
```

## 👤 User Preferences

Users can manage their email preferences at `/settings`

### Preference Options
- Booking confirmations
- Status updates
- New messages
- Marketing emails
- Weekly digest

### Checking Preferences
```javascript
const preferences = await getUserEmailPreferences(userId);
if (preferences.booking_confirmations) {
  // Send email
}
```

## 🔍 Monitoring & Debugging

### View Email Logs
```sql
-- Check recent email notifications
SELECT * FROM email_notifications 
WHERE created_at > NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;

-- Check failed emails
SELECT * FROM email_notifications 
WHERE status = 'failed'
ORDER BY created_at DESC;
```

### Retry Failed Emails
```sql
-- Reset failed emails for retry
UPDATE email_notifications 
SET status = 'pending', 
    retry_count = 0,
    next_retry_at = NOW()
WHERE status = 'failed' 
  AND retry_count < 3;
```

### Check User Preferences
```sql
-- View user's email preferences
SELECT * FROM email_preferences 
WHERE user_id = 'USER_ID';
```

## 🚨 Troubleshooting

### Emails Not Sending

1. **Check API Key**: Verify BREVO_API_KEY is set correctly
2. **Check Logs**: Look for errors in Next.js console
3. **Check Database**: Verify notifications are being queued
```sql
SELECT * FROM email_notifications 
WHERE status = 'pending';
```

### Emails Going to Spam

1. **Verify Domain**: Set up SPF, DKIM, DMARC records
2. **Check Content**: Avoid spam trigger words
3. **Test Score**: Use mail-tester.com to check spam score

### Rate Limiting Issues

The system implements rate limiting for message notifications:
- 1 email per recipient per 5 minutes for messages
- No limit for transactional emails (bookings, payments)

## 📊 Analytics

Track email performance in Brevo dashboard:
- Open rates
- Click rates
- Bounce rates
- Unsubscribe rates

## 🔐 Security

### Webhook Validation
```javascript
// Verify webhook signature
const signature = req.headers.get('x-brevo-signature');
if (!verifySignature(signature, body, secret)) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### Environment Variables
- Never commit `.env.local` to version control
- Use different API keys for development/production
- Rotate secrets regularly

## 🧪 Testing

### Local Testing
```bash
# Send test email
curl -X POST http://localhost:3000/api/emails/send \
  -H "Content-Type: application/json" \
  -d '{
    "test": true,
    "to": "your-email@example.com",
    "templateId": "booking_confirmation",
    "sampleData": {
      "student_name": "Test Student",
      "consultant_name": "Test Consultant",
      "service_title": "Essay Review",
      "price": "50",
      "delivery_date": "2025-01-25",
      "booking_id": "test-123"
    }
  }'
```

### Integration Testing
```javascript
// Test email queueing
const result = await queueNotification({
  userId: 'test-user-id',
  emailType: 'booking_confirmation',
  templateId: 'booking_confirmation',
  templateData: { /* ... */ }
});

expect(result.success).toBe(true);
```

## 📚 Additional Resources

- [Brevo API Documentation](https://developers.brevo.com/reference)
- [Supabase Database Webhooks](https://supabase.com/docs/guides/database/webhooks)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🤝 Support

For issues or questions:
1. Check this documentation
2. Review error logs in Supabase and Vercel
3. Contact support@proofr.com

---

**Remember**: Always test email flows in development before deploying to production!