import * as brevo from '@getbrevo/brevo';

// Initialize Brevo configuration
const apiInstance = new brevo.TransactionalEmailsApi();

// Set API key from environment variable
if (process.env.BREVO_API_KEY) {
  const apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: number;
  params?: Record<string, any>;
  attachments?: Array<{
    name: string;
    content: string; // Base64 encoded
  }>;
  tags?: string[];
  bcc?: string[];
  cc?: string[];
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Default sender configuration
const DEFAULT_SENDER = {
  name: process.env.BREVO_SENDER_NAME || 'Proofr',
  email: process.env.BREVO_SENDER_EMAIL || 'notifications@proofr.com'
};

/**
 * Send a transactional email using Brevo
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    // Prepare recipients
    const to = Array.isArray(options.to) 
      ? options.to.map(email => ({ email }))
      : [{ email: options.to }];

    // Create send email object
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.sender = DEFAULT_SENDER;
    sendSmtpEmail.to = to;
    sendSmtpEmail.subject = options.subject;
    
    // Set content based on template or raw HTML/text
    if (options.templateId) {
      sendSmtpEmail.templateId = options.templateId;
      if (options.params) {
        sendSmtpEmail.params = options.params;
      }
    } else {
      if (options.htmlContent) {
        sendSmtpEmail.htmlContent = options.htmlContent;
      }
      if (options.textContent) {
        sendSmtpEmail.textContent = options.textContent;
      }
    }
    
    // Optional fields
    if (options.attachments) {
      sendSmtpEmail.attachment = options.attachments.map(att => ({
        name: att.name,
        content: att.content
      }));
    }
    
    if (options.tags) {
      sendSmtpEmail.tags = options.tags;
    }
    
    if (options.bcc) {
      sendSmtpEmail.bcc = options.bcc.map(email => ({ email }));
    }
    
    if (options.cc) {
      sendSmtpEmail.cc = options.cc.map(email => ({ email }));
    }
    
    if (options.replyTo) {
      sendSmtpEmail.replyTo = { email: options.replyTo };
    }

    // Send the email
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    return {
      success: true,
      messageId: result.body.messageId
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Send email with retry logic
 */
export async function sendEmailWithRetry(
  options: EmailOptions,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<EmailResult> {
  let lastError: string | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      // Exponential backoff
      const delay = delayMs * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    const result = await sendEmail(options);
    
    if (result.success) {
      return result;
    }
    
    lastError = result.error;
    console.log(`Email send attempt ${attempt + 1} failed:`, lastError);
  }
  
  return {
    success: false,
    error: lastError || 'Max retries exceeded'
  };
}

/**
 * Get email template from Brevo
 */
export async function getEmailTemplate(templateId: number) {
  try {
    const result = await apiInstance.getSmtpTemplate(templateId);
    return result.body;
  } catch (error) {
    console.error('Failed to get email template:', error);
    return null;
  }
}

/**
 * Track email event (for webhooks)
 */
export interface EmailEvent {
  event: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounce' | 'spam' | 'unsubscribe';
  messageId: string;
  email: string;
  timestamp: number;
  link?: string;
  reason?: string;
}

export function parseBrevoWebhook(body: any): EmailEvent | null {
  try {
    return {
      event: body.event,
      messageId: body['message-id'],
      email: body.email,
      timestamp: body.ts || Date.now() / 1000,
      link: body.link,
      reason: body.reason
    };
  } catch (error) {
    console.error('Failed to parse Brevo webhook:', error);
    return null;
  }
}