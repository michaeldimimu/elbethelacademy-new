# Email Setup Guide

This guide explains how to configure the email service for sending invitation and welcome emails in the ElBethel Academy application.

## Features

- ✅ **Invitation Emails**: Automatically sent when admins invite new users
- ✅ **Welcome Emails**: Sent when users successfully accept invitations
- ✅ **Multiple Providers**: Support for Gmail, Outlook, and custom SMTP
- ✅ **Professional Templates**: HTML email templates with responsive design
- ✅ **Error Handling**: Graceful fallback when email is not configured
- ✅ **Testing Tools**: Admin endpoints to test email configuration

## Quick Setup

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:

   - Go to Google Account settings → Security → App passwords
   - Select "Mail" and generate a password
   - Copy the 16-character password

3. **Update .env file**:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM_NAME=ElBethel Academy
```

### Option 2: Outlook/Hotmail

1. **Update .env file**:

```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_FROM_NAME=ElBethel Academy
```

### Option 3: Custom SMTP

1. **Update .env file**:

```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=ElBethel Academy
```

## Environment Variables

### Required Variables

| Variable         | Description                | Example                    |
| ---------------- | -------------------------- | -------------------------- |
| `EMAIL_SERVICE`  | Email provider             | `gmail`, `outlook`, `smtp` |
| `EMAIL_USER`     | SMTP username/email        | `admin@gmail.com`          |
| `EMAIL_PASSWORD` | SMTP password/app password | `abcd efgh ijkl mnop`      |

### Optional Variables

| Variable          | Description          | Default                  |
| ----------------- | -------------------- | ------------------------ |
| `EMAIL_FROM`      | Sender email address | Uses `EMAIL_USER`        |
| `EMAIL_FROM_NAME` | Sender name          | `ElBethel Academy`       |
| `SMTP_HOST`       | SMTP server host     | Required for custom SMTP |
| `SMTP_PORT`       | SMTP server port     | `587`                    |
| `SMTP_SECURE`     | Use SSL/TLS          | `false`                  |

## Testing Email Configuration

### 1. Check Email Status

Visit the admin dashboard and check the email status in the invitation management section.

### 2. Send Test Email

Use the admin interface to send a test email:

```bash
# API endpoint to test email
POST /api/invitations/test-email
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### 3. Check Logs

Monitor server logs for email-related messages:

- ✅ `Email service configured successfully`
- ❌ `Email not configured - invitation emails will not be sent`
- 📧 `Sending invitation email to user@example.com...`

## Email Templates

### Invitation Email Features

- **Professional Design**: Modern, responsive HTML template
- **Role Information**: Clear display of assigned role
- **Expiration Warning**: Prominent expiry date and time
- **Security Note**: Information about invitation security
- **One-Click Accept**: Direct link to invitation acceptance page

### Welcome Email Features

- **Account Confirmation**: Confirms successful account creation
- **Account Details**: Shows username, email, and assigned role
- **Quick Sign-In**: Direct link to sign-in page
- **Getting Started**: Helpful next steps for new users

## Troubleshooting

### Common Issues

#### 1. Gmail Authentication Error

**Problem**: `Invalid login: 534-5.7.9 Application-specific password required`

**Solution**:

- Enable 2-Factor Authentication
- Generate App Password (not your regular password)
- Use the 16-character app password in `EMAIL_PASSWORD`

#### 2. Outlook Authentication Error

**Problem**: Authentication failures with Outlook

**Solution**:

- Ensure account allows SMTP access
- Check if account requires app-specific passwords
- Try using the full email address as username

#### 3. SMTP Connection Timeout

**Problem**: Connection timeout errors

**Solution**:

- Verify SMTP host and port settings
- Check firewall settings
- Ensure SMTP server allows external connections

#### 4. Emails Going to Spam

**Problem**: Invitation emails end up in spam folders

**Solution**:

- Use a custom domain with proper SPF/DKIM records
- Include clear sender information
- Use professional email templates (already implemented)

### Debug Steps

1. **Check Configuration**:

```bash
# Check email status endpoint
GET /api/invitations/email-status
```

2. **Test SMTP Connection**:

```bash
# Send test email
POST /api/invitations/test-email
{
  "email": "your-test@email.com"
}
```

3. **Monitor Logs**:

```bash
# Watch server logs
npm run dev:server:watch
```

## Development vs Production

### Development Setup

For development, you can:

- Use your personal Gmail with app password
- Leave email disabled (invitations work without emails)
- Use Ethereal email for testing (fake SMTP service)

### Production Setup

For production, you should:

- Use a professional domain email
- Configure proper SMTP with authentication
- Set up SPF and DKIM records for better deliverability
- Use environment-specific configuration

### Environment-Specific Configuration

```bash
# Development
EMAIL_SERVICE=gmail
EMAIL_USER=dev@gmail.com

# Staging
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.staging-domain.com

# Production
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.yourdomain.com
EMAIL_FROM=noreply@yourdomain.com
```

## Security Considerations

### Email Security

- **App Passwords**: Use app-specific passwords, not main account passwords
- **Environment Variables**: Never commit email credentials to version control
- **SMTP Authentication**: Always use authenticated SMTP for production
- **TLS Encryption**: Enable TLS for secure email transmission

### Template Security

- **No User Input**: Email templates don't include unsanitized user input
- **Secure Links**: Invitation links use cryptographically secure tokens
- **Expiration**: All invitation links expire after 7 days

## Advanced Configuration

### Custom Email Templates

To customize email templates, edit:

- `src/templates/emailTemplates.ts` - Template content and styling
- Update `EmailTemplates.getInvitationEmailHTML()` method

### Multiple Email Providers

For different email types, you can extend the configuration:

```typescript
// Example: Different providers for different email types
const invitationEmailConfig = getEmailConfig("invitations");
const notificationEmailConfig = getEmailConfig("notifications");
```

### Email Queue (Future Enhancement)

For high-volume scenarios, consider adding:

- Redis-based email queue
- Retry mechanisms for failed emails
- Rate limiting for email sending

## Testing Checklist

Before deploying:

- [ ] Email service configuration is valid
- [ ] Test emails are received successfully
- [ ] Invitation emails contain correct links
- [ ] Welcome emails are sent after account creation
- [ ] Email templates render correctly on mobile devices
- [ ] Spam filters don't block emails
- [ ] Error handling works when email service is down

## Support

If you encounter issues:

1. Check server logs for error messages
2. Verify environment variable configuration
3. Test with a simple SMTP service first
4. Ensure email provider allows SMTP access
5. Check network/firewall settings

The system is designed to work gracefully without email - invitations will still function, but users will need to manually share invitation links.
