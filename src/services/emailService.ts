import EmailConfiguration from "../config/email.js";
import { EmailTemplates } from "../templates/emailTemplates.js";
import type { InvitationEmailData } from "../templates/emailTemplates.js";
import { UserRole } from "../types/roles.js";

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface WelcomeEmailData {
  name: string;
  email: string;
  role: UserRole;
  username: string;
}

class EmailService {
  private static instance: EmailService;
  private emailConfig: EmailConfiguration;
  private isEnabled: boolean = false;

  private constructor() {
    this.emailConfig = EmailConfiguration.getInstance();
    this.isEnabled = this.emailConfig.initialize();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public isEmailEnabled(): boolean {
    return this.isEnabled && this.emailConfig.isEmailConfigured();
  }

  public async sendInvitationEmail(
    data: InvitationEmailData
  ): Promise<EmailSendResult> {
    if (!this.isEmailEnabled()) {
      console.log("⚠️ Email not configured - invitation email not sent");
      return {
        success: false,
        error: "Email service not configured",
      };
    }

    const transporter = this.emailConfig.getTransporter();
    if (!transporter) {
      return {
        success: false,
        error: "Email transporter not available",
      };
    }

    try {
      const fromAddress = this.emailConfig.getFromAddress();
      const fromName = this.emailConfig.getFromName();
      const roleName = this.formatRoleName(data.role);

      const mailOptions = {
        from: `"${fromName}" <${fromAddress}>`,
        to: data.email,
        subject: `🎓 You're invited to join ${fromName} as a ${roleName}`,
        text: EmailTemplates.getInvitationEmailText(data),
        html: EmailTemplates.getInvitationEmailHTML(data),
      };

      console.log(`📧 Sending invitation email to ${data.email}...`);

      const result = await transporter.sendMail(mailOptions);

      console.log(`✅ Invitation email sent successfully to ${data.email}`, {
        messageId: result.messageId,
        response: result.response,
      });

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error: any) {
      console.error(
        `❌ Failed to send invitation email to ${data.email}:`,
        error
      );

      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }
  }

  public async sendWelcomeEmail(
    data: WelcomeEmailData
  ): Promise<EmailSendResult> {
    if (!this.isEmailEnabled()) {
      console.log("⚠️ Email not configured - welcome email not sent");
      return {
        success: false,
        error: "Email service not configured",
      };
    }

    const transporter = this.emailConfig.getTransporter();
    if (!transporter) {
      return {
        success: false,
        error: "Email transporter not available",
      };
    }

    try {
      const fromAddress = this.emailConfig.getFromAddress();
      const fromName = this.emailConfig.getFromName();

      const mailOptions = {
        from: `"${fromName}" <${fromAddress}>`,
        to: data.email,
        subject: `🎉 Welcome to ${fromName}! Your account is ready`,
        html: EmailTemplates.getWelcomeEmailHTML(data),
      };

      console.log(`📧 Sending welcome email to ${data.email}...`);

      const result = await transporter.sendMail(mailOptions);

      console.log(`✅ Welcome email sent successfully to ${data.email}`, {
        messageId: result.messageId,
      });

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error: any) {
      console.error(`❌ Failed to send welcome email to ${data.email}:`, error);

      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }
  }

  public async sendTestEmail(toEmail: string): Promise<EmailSendResult> {
    if (!this.isEmailEnabled()) {
      return {
        success: false,
        error: "Email service not configured",
      };
    }

    const transporter = this.emailConfig.getTransporter();
    if (!transporter) {
      return {
        success: false,
        error: "Email transporter not available",
      };
    }

    try {
      const fromAddress = this.emailConfig.getFromAddress();
      const fromName = this.emailConfig.getFromName();

      const mailOptions = {
        from: `"${fromName}" <${fromAddress}>`,
        to: toEmail,
        subject: `📧 Test Email from ${fromName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <h2 style="color: #4f46e5;">Email Test Successful! ✅</h2>
            <p>This is a test email from <strong>${fromName}</strong> email service.</p>
            <p><strong>Sent to:</strong> ${toEmail}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">
              If you received this email, your email configuration is working correctly!
            </p>
          </div>
        `,
      };

      const result = await transporter.sendMail(mailOptions);

      console.log(`✅ Test email sent successfully to ${toEmail}`);

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error: any) {
      console.error(`❌ Failed to send test email to ${toEmail}:`, error);

      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }
  }

  public async verifyEmailConfiguration(): Promise<boolean> {
    if (!this.isEmailEnabled()) {
      console.log("⚠️ Email service not enabled");
      return false;
    }

    try {
      const isVerified = await this.emailConfig.verifyConnection();
      if (isVerified) {
        console.log("✅ Email configuration verified successfully");
      } else {
        console.log("❌ Email configuration verification failed");
      }
      return isVerified;
    } catch (error) {
      console.error("❌ Email configuration verification error:", error);
      return false;
    }
  }

  public getEmailStatus(): {
    enabled: boolean;
    configured: boolean;
    fromAddress: string;
    fromName: string;
  } {
    return {
      enabled: this.isEnabled,
      configured: this.emailConfig.isEmailConfigured(),
      fromAddress: this.emailConfig.getFromAddress(),
      fromName: this.emailConfig.getFromName(),
    };
  }

  private formatRoleName(role: UserRole): string {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
}

export default EmailService;
