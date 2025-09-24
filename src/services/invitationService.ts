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
      throw new Error(data.error || "Failed to create invitation");
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
