import fs from 'fs';
import path from 'path';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlTemplate?: string;
  textTemplate?: string;
  requiredVariables: string[];
}

// Template registry
const templates: Map<string, EmailTemplate> = new Map();

// Template IDs
export const TEMPLATE_IDS = {
  BOOKING_CONFIRMATION: 'booking_confirmation',
  BOOKING_ACCEPTED: 'booking_accepted',
  BOOKING_DECLINED: 'booking_declined',
  SERVICE_COMPLETED: 'service_completed',
  NEW_BOOKING_REQUEST: 'new_booking_request',
  PAYMENT_RECEIVED: 'payment_received',
  NEW_MESSAGE: 'new_message',
  VERIFICATION_APPROVED: 'verification_approved',
  VERIFICATION_REJECTED: 'verification_rejected',
  CREDITS_EARNED: 'credits_earned',
  WAITLIST_AVAILABLE: 'waitlist_available'
} as const;

/**
 * Load email template from file system
 */
export function loadTemplate(templateId: string): EmailTemplate | null {
  // Check cache first
  if (templates.has(templateId)) {
    return templates.get(templateId)!;
  }
  
  try {
    const templateDir = path.join(process.cwd(), 'templates', 'emails');
    const htmlPath = path.join(templateDir, `${templateId}.html`);
    const textPath = path.join(templateDir, `${templateId}.txt`);
    const metaPath = path.join(templateDir, `${templateId}.json`);
    
    // Load metadata
    let metadata: any = {};
    if (fs.existsSync(metaPath)) {
      metadata = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    }
    
    // Load HTML template
    let htmlTemplate: string | undefined;
    if (fs.existsSync(htmlPath)) {
      htmlTemplate = fs.readFileSync(htmlPath, 'utf-8');
    }
    
    // Load text template
    let textTemplate: string | undefined;
    if (fs.existsSync(textPath)) {
      textTemplate = fs.readFileSync(textPath, 'utf-8');
    }
    
    const template: EmailTemplate = {
      id: templateId,
      name: metadata.name || templateId,
      subject: metadata.subject || '',
      htmlTemplate,
      textTemplate,
      requiredVariables: metadata.variables || []
    };
    
    // Cache the template
    templates.set(templateId, template);
    
    return template;
  } catch (error) {
    console.error(`Failed to load template ${templateId}:`, error);
    return null;
  }
}

/**
 * Replace variables in template content
 */
export function renderTemplate(
  content: string,
  variables: Record<string, any>
): string {
  let rendered = content;
  
  // Replace variables in format {{variable_name}}
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    rendered = rendered.replace(regex, String(value || ''));
  });
  
  // Add default variables
  const defaults = {
    current_year: new Date().getFullYear(),
    platform_url: process.env.NEXT_PUBLIC_APP_URL || 'https://proofr.com',
    platform_name: 'Proofr',
    support_email: 'support@proofr.com'
  };
  
  Object.entries(defaults).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    rendered = rendered.replace(regex, String(value));
  });
  
  return rendered;
}

/**
 * Get default email templates (fallback when files don't exist)
 */
export function getDefaultTemplate(templateId: string): EmailTemplate {
  const defaultTemplates: Record<string, EmailTemplate> = {
    [TEMPLATE_IDS.BOOKING_CONFIRMATION]: {
      id: TEMPLATE_IDS.BOOKING_CONFIRMATION,
      name: 'Booking Confirmation',
      subject: 'Your booking with {{consultant_name}} is confirmed!',
      htmlTemplate: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { background: white; padding: 20px; border: 1px solid #ddd; }
            .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi {{student_name}},</p>
              <p>Great news! Your booking with <strong>{{consultant_name}}</strong> has been confirmed.</p>
              <h3>Booking Details:</h3>
              <ul>
                <li><strong>Service:</strong> {{service_title}}</li>
                <li><strong>Price:</strong> ${{price}}</li>
                <li><strong>Expected Delivery:</strong> {{delivery_date}}</li>
              </ul>
              <p>Your consultant will begin working on your request shortly. You'll receive another notification when the service is completed.</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="{{platform_url}}/bookings/{{booking_id}}" class="button">View Booking</a>
              </p>
            </div>
            <div class="footer">
              <p>© {{current_year}} Proofr. All rights reserved.</p>
              <p><a href="{{platform_url}}/settings/notifications">Manage Email Preferences</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
      textTemplate: `
Booking Confirmed!

Hi {{student_name}},

Great news! Your booking with {{consultant_name}} has been confirmed.

Booking Details:
- Service: {{service_title}}
- Price: ${{price}}
- Expected Delivery: {{delivery_date}}

Your consultant will begin working on your request shortly. You'll receive another notification when the service is completed.

View your booking: {{platform_url}}/bookings/{{booking_id}}

© {{current_year}} Proofr. All rights reserved.
Manage Email Preferences: {{platform_url}}/settings/notifications
      `,
      requiredVariables: ['student_name', 'consultant_name', 'service_title', 'price', 'delivery_date', 'booking_id']
    },
    
    [TEMPLATE_IDS.NEW_BOOKING_REQUEST]: {
      id: TEMPLATE_IDS.NEW_BOOKING_REQUEST,
      name: 'New Booking Request',
      subject: 'New booking from {{student_name}}!',
      htmlTemplate: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10B981; color: white; padding: 20px; text-align: center; }
            .content { background: white; padding: 20px; border: 1px solid #ddd; }
            .button { display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Booking Request!</h1>
            </div>
            <div class="content">
              <p>Hi {{consultant_name}},</p>
              <p>You have a new booking request from <strong>{{student_name}}</strong>!</p>
              <h3>Booking Details:</h3>
              <ul>
                <li><strong>Service:</strong> {{service_title}}</li>
                <li><strong>Price:</strong> ${{price}}</li>
                <li><strong>Your Earnings:</strong> ${{earnings}} (after 20% platform fee)</li>
                <li><strong>Delivery Required By:</strong> {{delivery_date}}</li>
              </ul>
              <p style="text-align: center; margin: 30px 0;">
                <a href="{{platform_url}}/consultant-dashboard" class="button">View in Dashboard</a>
              </p>
            </div>
            <div class="footer">
              <p>© {{current_year}} Proofr. All rights reserved.</p>
              <p><a href="{{platform_url}}/settings/notifications">Manage Email Preferences</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
      textTemplate: `
New Booking Request!

Hi {{consultant_name}},

You have a new booking request from {{student_name}}!

Booking Details:
- Service: {{service_title}}
- Price: ${{price}}
- Your Earnings: ${{earnings}} (after 20% platform fee)
- Delivery Required By: {{delivery_date}}

View in Dashboard: {{platform_url}}/consultant-dashboard

© {{current_year}} Proofr. All rights reserved.
Manage Email Preferences: {{platform_url}}/settings/notifications
      `,
      requiredVariables: ['consultant_name', 'student_name', 'service_title', 'price', 'earnings', 'delivery_date']
    },
    
    [TEMPLATE_IDS.NEW_MESSAGE]: {
      id: TEMPLATE_IDS.NEW_MESSAGE,
      name: 'New Message',
      subject: 'New message from {{sender_name}}',
      htmlTemplate: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6366F1; color: white; padding: 20px; text-align: center; }
            .content { background: white; padding: 20px; border: 1px solid #ddd; }
            .message-preview { background: #f5f5f5; padding: 15px; border-left: 3px solid #6366F1; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: #6366F1; color: white; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Message</h1>
            </div>
            <div class="content">
              <p>You have a new message from <strong>{{sender_name}}</strong>:</p>
              <div class="message-preview">
                {{message_preview}}...
              </div>
              <p style="text-align: center; margin: 30px 0;">
                <a href="{{platform_url}}/messages/{{conversation_id}}" class="button">Read Full Message</a>
              </p>
            </div>
            <div class="footer">
              <p>© {{current_year}} Proofr. All rights reserved.</p>
              <p><a href="{{platform_url}}/settings/notifications">Manage Email Preferences</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
      textTemplate: `
New Message

You have a new message from {{sender_name}}:

"{{message_preview}}..."

Read Full Message: {{platform_url}}/messages/{{conversation_id}}

© {{current_year}} Proofr. All rights reserved.
Manage Email Preferences: {{platform_url}}/settings/notifications
      `,
      requiredVariables: ['sender_name', 'message_preview', 'conversation_id']
    }
  };
  
  return defaultTemplates[templateId] || {
    id: templateId,
    name: 'Default Template',
    subject: 'Notification from Proofr',
    htmlTemplate: '<p>You have a new notification from Proofr.</p>',
    textTemplate: 'You have a new notification from Proofr.',
    requiredVariables: []
  };
}

/**
 * Validate that all required variables are provided
 */
export function validateTemplateVariables(
  template: EmailTemplate,
  variables: Record<string, any>
): { valid: boolean; missing: string[] } {
  const missing = template.requiredVariables.filter(
    varName => !(varName in variables) || variables[varName] === undefined
  );
  
  return {
    valid: missing.length === 0,
    missing
  };
}