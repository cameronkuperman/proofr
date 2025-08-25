import { NextRequest, NextResponse } from 'next/server';
import { parseBrevoWebhook } from '../../../../lib/email/brevo-client';
import { handleEmailEvent } from '../../../../lib/email/notification-service';

/**
 * POST /api/emails/webhook
 * Handle Brevo webhook events for email tracking
 */
export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature (optional but recommended)
    const signature = req.headers.get('x-brevo-signature');
    if (process.env.BREVO_WEBHOOK_SECRET && signature) {
      // TODO: Implement signature verification
      // This requires the webhook secret from Brevo dashboard
    }
    
    const body = await req.json();
    
    // Parse the webhook event
    const event = parseBrevoWebhook(body);
    
    if (!event) {
      console.error('Invalid webhook payload:', body);
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }
    
    // Handle the event
    await handleEmailEvent(event);
    
    // Always return 200 to acknowledge receipt
    return NextResponse.json({ 
      success: true,
      event: event.event,
      messageId: event.messageId
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Still return 200 to prevent retries
    return NextResponse.json({ 
      success: false,
      error: 'Webhook processing failed'
    });
  }
}

/**
 * GET /api/emails/webhook
 * Health check endpoint for webhook configuration
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/emails/webhook',
    accepts: ['sent', 'delivered', 'opened', 'clicked', 'bounce', 'spam', 'unsubscribe']
  });
}