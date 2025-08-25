import { NextRequest, NextResponse } from 'next/server';
import { processPendingNotifications } from '../../../../lib/email/notification-service';

/**
 * GET /api/cron/emails
 * Cron job endpoint to process pending email notifications
 * Should be called every minute by a cron service (Vercel Cron, Railway, etc.)
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret if configured
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Process pending notifications
    await processPendingNotifications();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Email notifications processed'
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process notifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cron/emails
 * Alternative endpoint for services that require POST
 */
export async function POST(req: NextRequest) {
  return GET(req);
}