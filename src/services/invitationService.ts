// Service for managing user invitations
export interface Invitation {
  id: string;
  email: string;
  role: string;
  invitedBy: {
    name: string;
    email: string;
    role: string;
  };
  expiresAt: string;
  createdAt: string;
  invitationLink: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  used: number;
  expired: number;
}

export interface CreateInvitationRequest {
  email: string;
  role: string;
}

export interface AcceptInvitationRequest {
  username: string;
  password: string;
  name: string;
}

class InvitationService {
  private baseUrl = "/api/invitations";

  // Create a new invitation
  async createInvitation(
    request: CreateInvitationRequest
  ): Promise<{ invitation: Invitation }> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases with user-friendly messages
      switch (response.status) {
        case 400:
          if (data.error?.includes('user with this email already exists')) {
            throw new Error(`A user with email "${request.email}" is already registered in the system.`);
          } else if (data.error?.includes('invitation for this email and role already exists')) {
            throw new Error(`An invitation has already been sent to "${request.email}" for the ${request.role} role.`);
          } else if (data.error?.includes('valid email address')) {
            throw new Error(`Please provide a valid email address.`);
          } else if (data.error?.includes('Email and role are required')) {
            throw new Error('Both email and role are required fields.');
          } else if (data.error?.includes('Invalid role')) {
            throw new Error(`"${request.role}" is not a valid role. Please select a valid role.`);
          }
          break;
        case 401:
          throw new Error('You need to be logged in to send invitations.');
        case 403:
          if (data.error?.includes("don't have permission")) {
            const availableRoles = data.invitableRoles?.join(', ') || 'your permitted roles';
            throw new Error(`You don't have permission to invite users with the "${request.role}" role. You can only invite: ${availableRoles}.`);
          }
          throw new Error('You don\'t have permission to send invitations.');
        case 500:
          throw new Error('Server error occurred while sending the invitation. Please try again.');
        default:
          break;
      }
      
      // Fallback to the original error message
      throw new Error(data.error || data.message || "Failed to create invitation");
    }

    return data;
  }

  // Get all pending invitations
  async getInvitations(): Promise<{
    invitations: Invitation[];
    count: number;
  }> {
    const response = await fetch(this.baseUrl, {
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch invitations");
    }

    return data;
  }

  // Get invitation statistics
  async getStats(): Promise<InvitationStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch invitation stats");
    }

    return data;
  }

  // Get invitation details by token (public endpoint)
  async getInvitationByToken(token: string): Promise<{
    email: string;
    role: string;
    invitedBy: {
      name: string;
      email: string;
      role: string;
    };
    expiresAt: string;
    token: string;
  }> {
    const response = await fetch(`${this.baseUrl}/token/${token}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch invitation");
    }

    return data;
  }

  // Accept invitation and create user account (public endpoint)
  async acceptInvitation(
    token: string,
    request: AcceptInvitationRequest
  ): Promise<{
    user: {
      id: string;
      username: string;
      email: string;
      name: string;
      role: string;
      isActive: boolean;
      createdAt: string;
    };
  }> {
    const response = await fetch(`${this.baseUrl}/token/${token}/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to accept invitation");
    }

    return data;
  }

  // Cancel/revoke an invitation
  async cancelInvitation(invitationId: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/${invitationId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to cancel invitation");
    }

    return data;
  }
}

export const invitationService = new InvitationService();
