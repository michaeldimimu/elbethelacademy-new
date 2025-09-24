# User Invitation System

This document describes the user invitation system that allows super admins and admins to invite new users with different roles.

## Features

### 🎯 Role-Based Invitations

- **Super Admins** can invite users with any role (super_admin, admin, moderator, teacher, student, guest)
- **Admins** can invite users with roles below admin level (moderator, teacher, student, guest)
- Prevents privilege escalation by restricting invitation permissions

### 🔐 Security Features

- **Secure Token Generation**: Each invitation uses a cryptographically secure random token
- **Time-Limited Invitations**: Invitations expire after 7 days by default
- **One-Time Use**: Invitations can only be accepted once
- **Automatic Cleanup**: Expired invitations are automatically removed from the database
- **Email Validation**: Prevents duplicate users and validates email format

### 📧 Invitation Management

- **Create Invitations**: Send invitations with specified roles
- **View Pending Invitations**: See all active invitations with expiration dates
- **Cancel Invitations**: Revoke pending invitations before they expire
- **Statistics Dashboard**: Track invitation metrics (total, pending, used, expired)
- **Invitation Links**: Secure, shareable links for invitation acceptance

## API Endpoints

### Protected Endpoints (Admin/Super Admin Only)

#### `POST /api/invitations`

Create a new user invitation.

**Request:**

```json
{
  "email": "user@example.com",
  "role": "teacher"
}
```

**Response:**

```json
{
  "message": "Invitation created successfully",
  "invitation": {
    "id": "invitation_id",
    "email": "user@example.com",
    "role": "teacher",
    "invitedBy": {
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    },
    "expiresAt": "2025-01-01T12:00:00.000Z",
    "invitationLink": "http://localhost:3001/invite/abc123token"
  }
}
```

#### `GET /api/invitations`

Get all pending invitations (filtered by user role).

**Response:**

```json
{
  "invitations": [
    {
      "id": "invitation_id",
      "email": "user@example.com",
      "role": "teacher",
      "invitedBy": {
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin"
      },
      "expiresAt": "2025-01-01T12:00:00.000Z",
      "createdAt": "2024-12-25T12:00:00.000Z",
      "invitationLink": "http://localhost:3001/invite/abc123token"
    }
  ],
  "count": 1
}
```

#### `DELETE /api/invitations/:id`

Cancel a pending invitation.

**Response:**

```json
{
  "message": "Invitation cancelled successfully"
}
```

#### `GET /api/invitations/stats`

Get invitation statistics.

**Response:**

```json
{
  "total": 10,
  "pending": 3,
  "used": 6,
  "expired": 1
}
```

### Public Endpoints

#### `GET /api/invitations/token/:token`

Get invitation details by token (for the acceptance page).

**Response:**

```json
{
  "email": "user@example.com",
  "role": "teacher",
  "invitedBy": {
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  },
  "expiresAt": "2025-01-01T12:00:00.000Z",
  "token": "abc123token"
}
```

#### `POST /api/invitations/token/:token/accept`

Accept an invitation and create a user account.

**Request:**

```json
{
  "username": "newuser",
  "password": "securepassword123",
  "name": "New User"
}
```

**Response:**

```json
{
  "message": "Account created successfully",
  "user": {
    "id": "user_id",
    "username": "newuser",
    "email": "user@example.com",
    "name": "New User",
    "role": "teacher",
    "isActive": true,
    "createdAt": "2024-12-25T12:00:00.000Z"
  }
}
```

## Database Schema

### Invitation Model

```typescript
{
  email: string,              // Invited user's email
  role: UserRole,             // Role to assign to the new user
  token: string,              // Secure random token (32 bytes hex)
  invitedBy: ObjectId,        // Reference to admin who sent invitation
  invitedByDetails: {         // Snapshot of inviter details
    name: string,
    email: string,
    role: UserRole
  },
  expiresAt: Date,            // Expiration timestamp (7 days default)
  isUsed: boolean,            // Whether invitation has been accepted
  usedAt?: Date,              // When invitation was accepted
  createdAt: Date,            // Creation timestamp
  updatedAt: Date             // Last modification timestamp
}
```

### Database Indexes

- `{ email: 1, role: 1, isUsed: 1 }` - Prevents duplicate invitations
- `{ token: 1 }` - Fast token lookups
- `{ expiresAt: 1 }` - TTL index for automatic cleanup
- `{ isUsed: 1 }` - Query optimization for pending invitations

## User Interface

### Admin Dashboard Integration

- **Tabbed Interface**: Invitation management integrated into admin dashboard
- **Invitation Form**: Modal dialog for creating new invitations
- **Pending Invitations Table**: List view with actions (copy link, cancel)
- **Statistics Cards**: Visual metrics for invitation status
- **Role Restrictions**: UI adapts based on user permissions

### Invitation Acceptance Page

- **Secure Link Validation**: Verifies token and expiration
- **User Registration Form**: Account creation with validation
- **Error Handling**: Clear messages for invalid/expired invitations
- **Responsive Design**: Mobile-friendly interface

## Permission System

### New Permission

- `INVITE_USERS`: Permission to create and manage user invitations

### Role Assignments

- **Super Admin**: All permissions (can invite any role)
- **Admin**: `INVITE_USERS` permission (can invite moderator, teacher, student, guest)
- **Other Roles**: No invitation permissions

### Helper Functions

```typescript
// Check if user can invite specific role
canInviteRole(currentUserRole: UserRole, targetRole: UserRole): boolean

// Get list of roles current user can invite
getInvitableRoles(currentUserRole: UserRole): UserRole[]
```

## Usage Examples

### 1. Admin Inviting a Teacher

```bash
# Admin creates invitation
curl -X POST http://localhost:3001/api/invitations \
  -H "Content-Type: application/json" \
  -d '{"email": "teacher@school.edu", "role": "teacher"}' \
  --cookie "connect.sid=admin_session"

# Response includes invitation link
# Send link to teacher: http://localhost:3001/invite/abc123token
```

### 2. Teacher Accepting Invitation

```bash
# Teacher visits invitation link
# GET http://localhost:3001/invite/abc123token

# Teacher fills out registration form and submits
curl -X POST http://localhost:3001/api/invitations/token/abc123token/accept \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jsmith",
    "password": "securepass123",
    "name": "John Smith"
  }'
```

### 3. Admin Viewing Invitations

```bash
# Get all pending invitations
curl http://localhost:3001/api/invitations \
  --cookie "connect.sid=admin_session"

# Get invitation statistics
curl http://localhost:3001/api/invitations/stats \
  --cookie "connect.sid=admin_session"
```

## Security Considerations

1. **Token Security**: 256-bit random tokens prevent guessing
2. **Time Limits**: 7-day expiration prevents indefinite access
3. **One-Time Use**: Prevents token reuse after acceptance
4. **Permission Checks**: Multiple validation layers prevent privilege escalation
5. **Input Validation**: Email format, password strength, username requirements
6. **Session Management**: Proper authentication for admin endpoints
7. **Audit Trail**: Track who invited whom and when

## Error Handling

### Common Error Responses

- `400 Bad Request`: Invalid input data or duplicate invitation
- `401 Unauthorized`: Authentication required for protected endpoints
- `403 Forbidden`: Insufficient permissions for action
- `404 Not Found`: Invalid or expired invitation token
- `500 Internal Server Error`: Database or server issues

### Client-Side Error Handling

- Validation feedback on forms
- Clear error messages for users
- Retry mechanisms for network issues
- Graceful degradation for missing features

## Future Enhancements

1. **Email Integration**: Automatically send invitation emails
2. **Custom Expiration**: Allow admins to set custom expiration times
3. **Invitation Templates**: Pre-filled invitations for common roles
4. **Bulk Invitations**: Invite multiple users at once
5. **Invitation History**: Keep audit log of all invitations
6. **Role-Based Templates**: Different invitation messages per role
7. **Integration with LDAP/SSO**: Enterprise authentication support

## Testing

The system includes comprehensive validation:

- Role-based permission checks
- Token security validation
- Expiration handling
- Duplicate prevention
- Input validation
- Error handling

Test with different user roles to verify proper permission enforcement and user flow functionality.
