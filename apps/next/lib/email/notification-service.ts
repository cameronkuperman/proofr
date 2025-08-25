import { supabase } from '../../../../lib/supabase';
import { sendEmailWithRetry, EmailEvent } from './brevo-client';
import { 
  loadTemplate, 
  getDefaultTemplate, 
  renderTemplate, 
  validateTemplateVariables,
  EmailTemplate 
} from './templates';

export interface NotificationOptions {
  userId: string;
  emailType: string;
  templateId: string;
  templateData: Record<string, any>;
  bookingId?: string;
  messageId?: string;
}

export interface NotificationResult {
  success: boolean;
  notificationId?: string;
  error?: string;
}

/**
 * Queue an email notification in the database
 */
export async function queueNotification(options: NotificationOptions): Promise<NotificationResult> {
  try {
    // Call the database function to queue notification
    const { data, error } = await supabase.rpc('queue_email_notification', {
      p_user_id: options.userId,
      p_email_type: options.emailType,
      p_template_id: options.templateId,
      p_template_data: options.templateData,
      p_booking_id: options.bookingId || null,
      p_message_id: options.messageId || null
    });
    
    if (error) {
      console.error('Failed to queue notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true,
      notificationId: data
    };
  } catch (error) {
    console.error('Error queueing notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Process pending email notifications
 */
export async function processPendingNotifications(): Promise<void> {
  try {
    // Fetch pending notifications
    const { data: notifications, error } = await supabase
      .from('email_notifications')
      .select('*')
      .in('status', ['pending', 'failed'])
      .lt('retry_count', 3)
      .or('next_retry_at.is.null,next_retry_at.lte.now()')
      .limit(10);
    
    if (error) {
      console.error('Failed to fetch pending notifications:', error);
      return;
    }
    
    // Process each notification
    for (const notification of notifications || []) {
      await processNotification(notification);
    }
  } catch (error) {
    console.error('Error processing notifications:', error);
  }
}

/**
 * Process a single notification
 */
async function processNotification(notification: any): Promise<void> {
  try {
    // Update status to sending
    await supabase
      .from('email_notifications')
      .update({ status: 'sending' })
      .eq('id', notification.id);
    
    // Load template
    let template = loadTemplate(notification.template_id);
    if (!template) {
      template = getDefaultTemplate(notification.template_id);
    }
    
    // Validate template variables
    const validation = validateTemplateVariables(template, notification.template_data);
    if (!validation.valid) {
      throw new Error(`Missing template variables: ${validation.missing.join(', ')}`);
    }
    
    // Render subject
    const subject = renderTemplate(template.subject, notification.template_data);
    
    // Render content
    let htmlContent: string | undefined;
    let textContent: string | undefined;
    
    if (template.htmlTemplate) {
      htmlContent = renderTemplate(template.htmlTemplate, notification.template_data);
    }
    
    if (template.textTemplate) {
      textContent = renderTemplate(template.textTemplate, notification.template_data);
    }
    
    // Send email with retry
    const result = await sendEmailWithRetry({
      to: notification.email_address,
      subject,
      htmlContent,
      textContent,
      tags: [notification.email_type, `user_${notification.user_id}`]
    });
    
    if (result.success) {
      // Update notification as sent
      await supabase
        .from('email_notifications')
        .update({
          status: 'sent',
          brevo_message_id: result.messageId,
          sent_at: new Date().toISOString()
        })
        .eq('id', notification.id);
    } else {
      // Update retry count and next retry time
      const retryCount = notification.retry_count + 1;
      const nextRetryAt = new Date(Date.now() + Math.pow(2, retryCount) * 60000); // Exponential backoff
      
      await supabase
        .from('email_notifications')
        .update({
          status: retryCount >= 3 ? 'failed' : 'pending',
          retry_count: retryCount,
          next_retry_at: retryCount < 3 ? nextRetryAt.toISOString() : null,
          error_message: result.error
        })
        .eq('id', notification.id);
    }
  } catch (error) {
    console.error('Error processing notification:', error);
    
    // Mark as failed
    await supabase
      .from('email_notifications')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('id', notification.id);
  }
}

/**
 * Handle Brevo webhook events
 */
export async function handleEmailEvent(event: EmailEvent): Promise<void> {
  try {
    const updates: any = {};
    
    switch (event.event) {
      case 'opened':
        updates.opened_at = new Date(event.timestamp * 1000).toISOString();
        break;
      case 'clicked':
        updates.clicked_at = new Date(event.timestamp * 1000).toISOString();
        break;
      case 'bounce':
      case 'spam':
        updates.status = 'bounced';
        updates.error_message = event.reason || event.event;
        break;
    }
    
    if (Object.keys(updates).length > 0) {
      await supabase
        .from('email_notifications')
        .update(updates)
        .eq('brevo_message_id', event.messageId);
    }
  } catch (error) {
    console.error('Error handling email event:', error);
  }
}

/**
 * Get user's email preferences
 */
export async function getUserEmailPreferences(userId: string): Promise<any> {
  const { data, error } = await supabase
    .from('email_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Failed to get email preferences:', error);
    return null;
  }
  
  return data;
}

/**
 * Update user's email preferences
 */
export async function updateEmailPreferences(
  userId: string,
  preferences: Partial<any>
): Promise<boolean> {
  const { error } = await supabase
    .from('email_preferences')
    .upsert({
      user_id: userId,
      ...preferences,
      updated_at: new Date().toISOString()
    });
  
  if (error) {
    console.error('Failed to update email preferences:', error);
    return false;
  }
  
  return true;
}

/**
 * Send test email (for development)
 */
export async function sendTestEmail(
  to: string,
  templateId: string,
  sampleData?: Record<string, any>
): Promise<NotificationResult> {
  try {
    // Load template
    let template = loadTemplate(templateId);
    if (!template) {
      template = getDefaultTemplate(templateId);
    }
    
    // Use sample data or defaults
    const templateData = sampleData || {
      student_name: 'John Doe',
      consultant_name: 'Jane Smith',
      service_title: 'Essay Review',
      price: '50',
      delivery_date: new Date().toLocaleDateString(),
      booking_id: 'test-booking-123',
      earnings: '40',
      sender_name: 'Test User',
      message_preview: 'This is a test message preview',
      conversation_id: 'test-conv-123'
    };
    
    // Render content
    const subject = renderTemplate(template.subject, templateData);
    const htmlContent = template.htmlTemplate 
      ? renderTemplate(template.htmlTemplate, templateData)
      : undefined;
    const textContent = template.textTemplate
      ? renderTemplate(template.textTemplate, templateData)
      : undefined;
    
    // Send email
    const result = await sendEmailWithRetry({
      to,
      subject,
      htmlContent,
      textContent,
      tags: ['test', templateId]
    });
    
    return {
      success: result.success,
      error: result.error
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}