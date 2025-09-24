import { UserRole } from "../types/roles.js";

export interface InvitationEmailData {
  email: string;
  role: UserRole;
  invitedBy: {
    name: string;
    email: string;
    role: UserRole;
  };
  invitationLink: string;
  expiresAt: Date;
  organizationName?: string;
}

export class EmailTemplates {
  private static organizationName = "ElBethel Academy";
  private static primaryColor = "#4f46e5";
  private static secondaryColor = "#6366f1";

  static getInvitationEmailHTML(data: InvitationEmailData): string {
    const roleName = this.formatRoleName(data.role);
    const expiryDate = data.expiresAt.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const expiryTime = data.expiresAt.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation to join ${this.organizationName}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, ${this.primaryColor}, ${
      this.secondaryColor
    });
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #1f2937;
        }
        .invitation-details {
            background-color: #f1f5f9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid ${this.primaryColor};
        }
        .detail-row {
            display: flex;
            margin-bottom: 10px;
        }
        .detail-label {
            font-weight: bold;
            color: #374151;
            min-width: 120px;
        }
        .detail-value {
            color: #6b7280;
        }
        .role-badge {
            background-color: ${this.primaryColor};
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .cta-section {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background-color: #fef3c7;
            border-radius: 8px;
        }
        .cta-button {
            display: inline-block;
            background-color: ${this.primaryColor};
            color: white;
            text-decoration: none;
            padding: 14px 30px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background-color: ${this.secondaryColor};
        }
        .expiry-warning {
            background-color: #fee2e2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            text-align: center;
            font-size: 14px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
            font-size: 14px;
            color: #6b7280;
        }
        .security-note {
            background-color: #e0f2fe;
            border: 1px solid #81d4fa;
            color: #0277bd;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .detail-row {
                flex-direction: column;
            }
            .detail-label {
                margin-bottom: 5px;
                min-width: auto;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${this.organizationName}</h1>
            <p>You're invited to join our learning community</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello,
            </div>
            
            <p>Great news! <strong>${
              data.invitedBy.name
            }</strong> has invited you to join <strong>${
      this.organizationName
    }</strong> as a ${roleName}.</p>
            
            <div class="invitation-details">
                <div class="detail-row">
                    <div class="detail-label">Your Role:</div>
                    <div class="detail-value"><span class="role-badge">${roleName}</span></div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Invited by:</div>
                    <div class="detail-value">${
                      data.invitedBy.name
                    } (${this.formatRoleName(data.invitedBy.role)})</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Email:</div>
                    <div class="detail-value">${data.email}</div>
                </div>
            </div>
            
            <div class="cta-section">
                <p style="margin: 0 0 15px 0; font-size: 16px; color: #374151;">
                    <strong>Ready to get started?</strong><br>
                    Click the button below to accept your invitation and create your account.
                </p>
                <a href="${
                  data.invitationLink
                }" class="cta-button">Accept Invitation & Create Account</a>
            </div>
            
            <div class="expiry-warning">
                <strong>⏰ Time Sensitive:</strong> This invitation expires on <strong>${expiryDate}</strong> at <strong>${expiryTime}</strong>
            </div>
            
            <div class="security-note">
                <strong>🔒 Security Note:</strong> This invitation is specifically for ${
                  data.email
                }. 
                If you didn't expect this invitation or believe this is a mistake, please contact ${
                  data.invitedBy.name
                } at ${data.invitedBy.email}.
            </div>
            
            <p style="margin-top: 30px;">
                If you're unable to click the button above, you can copy and paste this link into your browser:
            </p>
            <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px;">
                ${data.invitationLink}
            </p>
        </div>
        
        <div class="footer">
            <p><strong>${this.organizationName}</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If you need assistance, please contact our support team.</p>
        </div>
    </div>
</body>
</html>`;
  }

  static getInvitationEmailText(data: InvitationEmailData): string {
    const roleName = this.formatRoleName(data.role);
    const expiryDate = data.expiresAt.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const expiryTime = data.expiresAt.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    return `
INVITATION TO JOIN ${this.organizationName.toUpperCase()}

Hello,

${data.invitedBy.name} has invited you to join ${
      this.organizationName
    } as a ${roleName}.

INVITATION DETAILS:
- Your Role: ${roleName}
- Invited by: ${data.invitedBy.name} (${this.formatRoleName(
      data.invitedBy.role
    )})
- Email: ${data.email}

ACCEPT YOUR INVITATION:
To accept this invitation and create your account, please visit:
${data.invitationLink}

IMPORTANT: This invitation expires on ${expiryDate} at ${expiryTime}

SECURITY NOTE:
This invitation is specifically for ${
      data.email
    }. If you didn't expect this invitation or believe this is a mistake, please contact ${
      data.invitedBy.name
    } at ${data.invitedBy.email}.

---
${this.organizationName}
This is an automated message. Please do not reply to this email.
If you need assistance, please contact our support team.
`;
  }

  static getWelcomeEmailHTML(userData: {
    name: string;
    email: string;
    role: UserRole;
    username: string;
  }): string {
    const roleName = this.formatRoleName(userData.role);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${this.organizationName}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, ${this.primaryColor}, ${
      this.secondaryColor
    });
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
        }
        .welcome-badge {
            background-color: #10b981;
            color: white;
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            display: inline-block;
            margin-bottom: 20px;
        }
        .user-info {
            background-color: #f1f5f9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .cta-section {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background-color: #ecfdf5;
            border-radius: 8px;
        }
        .cta-button {
            display: inline-block;
            background-color: ${this.primaryColor};
            color: white;
            text-decoration: none;
            padding: 14px 30px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to ${this.organizationName}!</h1>
        </div>
        
        <div class="content">
            <div class="welcome-badge">Account Created Successfully</div>
            
            <p>Dear ${userData.name},</p>
            
            <p>Congratulations! Your account has been successfully created and you are now a member of our learning community.</p>
            
            <div class="user-info">
                <h3 style="margin-top: 0;">Your Account Details:</h3>
                <p><strong>Name:</strong> ${userData.name}</p>
                <p><strong>Email:</strong> ${userData.email}</p>
                <p><strong>Username:</strong> ${userData.username}</p>
                <p><strong>Role:</strong> ${roleName}</p>
            </div>
            
            <div class="cta-section">
                <p style="margin: 0 0 15px 0; font-size: 16px;">
                    <strong>Ready to explore?</strong><br>
                    Sign in to your account and start your learning journey.
                </p>
                <a href="${
                  process.env.FRONTEND_URL || "http://localhost:5173"
                }/signin" class="cta-button">Sign In to Your Account</a>
            </div>
            
            <p>If you have any questions or need assistance getting started, don't hesitate to reach out to our support team.</p>
            
            <p>Welcome aboard!</p>
        </div>
        
        <div class="footer">
            <p><strong>${this.organizationName}</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`;
  }

  private static formatRoleName(role: UserRole): string {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
}
