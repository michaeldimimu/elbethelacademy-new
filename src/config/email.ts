import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

class EmailConfiguration {
  private static instance: EmailConfiguration;
  private transporter: Transporter | null = null;
  private isConfigured: boolean = false;

  private constructor() {}

  public static getInstance(): EmailConfiguration {
    if (!EmailConfiguration.instance) {
      EmailConfiguration.instance = new EmailConfiguration();
    }
    return EmailConfiguration.instance;
  }

  public initialize(): boolean {
    try {
      const config = this.getEmailConfig();

      if (!config) {
        console.log(
          "⚠️ Email not configured - invitation emails will not be sent"
        );
        return false;
      }

      this.transporter = nodemailer.createTransport(config);
      this.isConfigured = true;

      console.log("✅ Email service configured successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to configure email service:", error);
      this.isConfigured = false;
      return false;
    }
  }

  private getEmailConfig(): EmailConfig | null {
    const emailService = process.env.EMAIL_SERVICE;

    // Gmail configuration
    if (emailService === "gmail") {
      const user = process.env.EMAIL_USER;
      const pass = process.env.EMAIL_PASSWORD;

      if (!user || !pass) {
        console.error(
          "❌ Gmail configuration incomplete - EMAIL_USER and EMAIL_PASSWORD required"
        );
        return null;
      }

      return {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user, pass },
      };
    }

    // Outlook/Hotmail configuration
    if (emailService === "outlook") {
      const user = process.env.EMAIL_USER;
      const pass = process.env.EMAIL_PASSWORD;

      if (!user || !pass) {
        console.error(
          "❌ Outlook configuration incomplete - EMAIL_USER and EMAIL_PASSWORD required"
        );
        return null;
      }

      return {
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: { user, pass },
      };
    }

    // Custom SMTP configuration
    if (emailService === "smtp") {
      const host = process.env.SMTP_HOST;
      const port = parseInt(process.env.SMTP_PORT || "587");
      const secure = process.env.SMTP_SECURE === "true";
      const user = process.env.EMAIL_USER;
      const pass = process.env.EMAIL_PASSWORD;

      if (!host) {
        console.error("❌ SMTP configuration incomplete - SMTP_HOST required");
        return null;
      }

      const config: EmailConfig = {
        host,
        port,
        secure,
      };

      if (user && pass) {
        config.auth = { user, pass };
      }

      return config;
    }

    // Development mode - use Ethereal (fake SMTP)
    if (process.env.NODE_ENV === "development" && emailService === "ethereal") {
      return this.createEtherealConfig();
    }

    return null;
  }

  private createEtherealConfig(): EmailConfig | null {
    try {
      // This would normally use nodemailer.createTestAccount()
      // For now, we'll return null and suggest manual configuration
      console.log(
        "ℹ️ To use Ethereal email testing, please configure manually"
      );
      return null;
    } catch (error) {
      console.error("❌ Failed to create Ethereal test account:", error);
      return null;
    }
  }

  public getTransporter(): Transporter | null {
    return this.transporter;
  }

  public isEmailConfigured(): boolean {
    return this.isConfigured;
  }

  public async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log("✅ Email server connection verified");
      return true;
    } catch (error) {
      console.error("❌ Email server connection failed:", error);
      return false;
    }
  }

  public getFromAddress(): string {
    return (
      process.env.EMAIL_FROM ||
      process.env.EMAIL_USER ||
      "noreply@elbethelacademy.com"
    );
  }

  public getFromName(): string {
    return process.env.EMAIL_FROM_NAME || "ElBethel Academy";
  }
}

export default EmailConfiguration;
