import { NextRequest, NextResponse } from 'next/server';
import { processPendingNotifications, sendTestEmail } from '../../../../lib/email/notification-service';
import { supabase } from '../../../../../../lib/supabase';

/**
 * POST /api/emails/send
 * Process pending email notifications or send test email
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Check for test email request (development only)
    if (process.env.NODE_ENV === 'development' && body.test) {
      const { to, templateId, sampleData } = body;
      
      if (!to || !templateId) {
        return NextResponse.json(
          { error: 'Missing required fields: to, templateId' },
          { status: 400 }
        );
      }
      
      const result = await sendTestEmail(to, templateId, sampleData);
      
      return NextResponse.json(result);
    }
    
    // Process pending notifications
    await processPendingNotifications();
    
    return NextResponse.json({ 
      success: true,
      message: 'Notifications processed' 
    });
  } catch (error) {
    console.error('Error in /api/emails/send:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/emails/send
 * Get email notification status
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const notificationId = searchParams.get('id');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    let query = supabase
      .from('email_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (notificationId) {
      query = query.eq('id', notificationId);
    }
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      notifications: data
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch notifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}