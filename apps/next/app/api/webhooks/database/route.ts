import { NextRequest, NextResponse } from 'next/server';
import { queueNotification } from '../../../../lib/email/notification-service';
import { supabase } from '../../../../../../lib/supabase';

/**
 * POST /api/webhooks/database
 * Handle database events from Supabase triggers
 */
export async function POST(req: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.DATABASE_WEBHOOK_SECRET;
    
    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { event, data } = body;
    
    console.log('Database webhook received:', event);
    
    // Handle different event types
    switch (event) {
      case 'booking.created':
        await handleBookingCreated(data);
        break;
        
      case 'booking.updated':
        await handleBookingUpdated(data);
        break;
        
      case 'message.created':
        await handleMessageCreated(data);
        break;
        
      case 'consultant.verified':
        await handleConsultantVerified(data);
        break;
        
      case 'payment.processed':
        await handlePaymentProcessed(data);
        break;
        
      default:
        console.log('Unknown event type:', event);
    }
    
    return NextResponse.json({ 
      success: true,
      event 
    });
  } catch (error) {
    console.error('Error processing database webhook:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function handleBookingCreated(booking: any) {
  try {
    // Get additional data
    const [consultantResult, studentResult, serviceResult] = await Promise.all([
      supabase.from('consultants').select('name').eq('id', booking.consultant_id).single(),
      supabase.from('students').select('name').eq('id', booking.student_id).single(),
      supabase.from('services').select('title, service_type').eq('id', booking.service_id).single()
    ]);
    
    const templateData = {
      booking_id: booking.id,
      student_name: studentResult.data?.name || 'Student',
      consultant_name: consultantResult.data?.name || 'Consultant',
      service_title: serviceResult.data?.title || 'Service',
      service_type: serviceResult.data?.service_type,
      price: booking.final_price,
      delivery_date: new Date(booking.promised_delivery_at).toLocaleDateString(),
      earnings: (booking.final_price * 0.8).toFixed(2)
    };
    
    // Queue notifications for both parties
    await Promise.all([
      queueNotification({
        userId: booking.student_id,
        emailType: 'booking_confirmation',
        templateId: 'booking_confirmation',
        templateData,
        bookingId: booking.id
      }),
      queueNotification({
        userId: booking.consultant_id,
        emailType: 'new_booking_request',
        templateId: 'new_booking_request',
        templateData,
        bookingId: booking.id
      })
    ]);
  } catch (error) {
    console.error('Error handling booking created:', error);
  }
}

async function handleBookingUpdated(data: any) {
  const { old_record, new_record } = data;
  
  // Check for status changes
  if (old_record.status !== new_record.status) {
    try {
      // Get additional data
      const [consultantResult, studentResult, serviceResult] = await Promise.all([
        supabase.from('consultants').select('name').eq('id', new_record.consultant_id).single(),
        supabase.from('students').select('name').eq('id', new_record.student_id).single(),
        supabase.from('services').select('title, service_type').eq('id', new_record.service_id).single()
      ]);
      
      const templateData = {
        booking_id: new_record.id,
        student_name: studentResult.data?.name || 'Student',
        consultant_name: consultantResult.data?.name || 'Consultant',
        service_title: serviceResult.data?.title || 'Service',
        price: new_record.final_price,
        status: new_record.status
      };
      
      switch (new_record.status) {
        case 'confirmed':
          await queueNotification({
            userId: new_record.student_id,
            emailType: 'booking_accepted',
            templateId: 'booking_accepted',
            templateData,
            bookingId: new_record.id
          });
          break;
          
        case 'completed':
          await Promise.all([
            queueNotification({
              userId: new_record.student_id,
              emailType: 'service_completed',
              templateId: 'service_completed',
              templateData: {
                ...templateData,
                deliverables: new_record.deliverables
              },
              bookingId: new_record.id
            }),
            queueNotification({
              userId: new_record.consultant_id,
              emailType: 'payment_update',
              templateId: 'payment_received',
              templateData: {
                ...templateData,
                earnings: (new_record.final_price * 0.8).toFixed(2)
              },
              bookingId: new_record.id
            })
          ]);
          break;
          
        case 'cancelled':
          await queueNotification({
            userId: new_record.student_id,
            emailType: 'booking_declined',
            templateId: 'booking_declined',
            templateData: {
              ...templateData,
              reason: new_record.cancellation_reason || 'No reason provided'
            },
            bookingId: new_record.id
          });
          break;
      }
    } catch (error) {
      console.error('Error handling booking update:', error);
    }
  }
}

async function handleMessageCreated(message: any) {
  try {
    // Get conversation details
    const { data: conversation } = await supabase
      .from('conversations')
      .select('student_id, consultant_id')
      .eq('id', message.conversation_id)
      .single();
    
    if (!conversation) return;
    
    // Determine recipient
    const recipientId = message.sender_id === conversation.student_id
      ? conversation.consultant_id
      : conversation.student_id;
    
    // Get sender name
    const { data: sender } = await supabase
      .from('users')
      .select('id, user_type')
      .eq('id', message.sender_id)
      .single();
    
    let senderName = 'User';
    if (sender?.user_type === 'student') {
      const { data } = await supabase
        .from('students')
        .select('name')
        .eq('id', sender.id)
        .single();
      senderName = data?.name || 'Student';
    } else if (sender?.user_type === 'consultant') {
      const { data } = await supabase
        .from('consultants')
        .select('name')
        .eq('id', sender.id)
        .single();
      senderName = data?.name || 'Consultant';
    }
    
    // Queue notification
    await queueNotification({
      userId: recipientId,
      emailType: 'new_message',
      templateId: 'new_message',
      templateData: {
        sender_name: senderName,
        message_preview: message.content.substring(0, 100),
        conversation_id: message.conversation_id
      },
      messageId: message.id
    });
  } catch (error) {
    console.error('Error handling message created:', error);
  }
}

async function handleConsultantVerified(consultant: any) {
  try {
    await queueNotification({
      userId: consultant.id,
      emailType: 'profile_update',
      templateId: consultant.verification_status === 'approved' 
        ? 'verification_approved' 
        : 'verification_rejected',
      templateData: {
        consultant_name: consultant.name
      }
    });
  } catch (error) {
    console.error('Error handling consultant verification:', error);
  }
}

async function handlePaymentProcessed(payment: any) {
  try {
    const { data: consultant } = await supabase
      .from('consultants')
      .select('name')
      .eq('id', payment.consultant_id)
      .single();
    
    await queueNotification({
      userId: payment.consultant_id,
      emailType: 'payment_update',
      templateId: 'payment_received',
      templateData: {
        consultant_name: consultant?.name || 'Consultant',
        amount: payment.amount,
        booking_id: payment.booking_id
      }
    });
  } catch (error) {
    console.error('Error handling payment processed:', error);
  }
}

/**
 * GET /api/webhooks/database
 * Health check endpoint
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/webhooks/database',
    accepts: [
      'booking.created',
      'booking.updated',
      'message.created',
      'consultant.verified',
      'payment.processed'
    ]
  });
}