import React, { useState, useEffect } from "react";
import { UserRole } from "../../types/roles";
import type {
  Invitation,
  InvitationStats,
} from "../../services/invitationService";
import { invitationService } from "../../services/invitationService";
import { useAuth } from "../../contexts/AuthContext";

interface InviteUserFormData {
  email: string;
  role: UserRole;
}

const InvitationManagement: React.FC = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [stats, setStats] = useState<InvitationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteForm, setInviteForm] = useState<InviteUserFormData>({
    email: "",
    role: UserRole.STUDENT,
  });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [invitableRoles, setInvitableRoles] = useState<UserRole[]>([]);
  const [emailServiceStatus, setEmailServiceStatus] = useState<{
    configured: boolean;
    provider?: string;
    error?: string;
  } | null>(null);
  const [showTestEmailForm, setShowTestEmailForm] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testEmailLoading, setTestEmailLoading] = useState(false);

  // Load email service status
  const loadEmailStatus = async () => {
    try {
      const response = await fetch(`/api/invitations/email-status`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const status = await response.json();
        setEmailServiceStatus(status);
      } else {
        console.error('Failed to load email status:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading email status:', error);
    }
  };

  // Load current user's invitable roles
  const loadInvitableRoles = () => {
    if (!user) return;

    // Determine invitable roles based on user role
    if (user.role === UserRole.SUPER_ADMIN) {
      setInvitableRoles(Object.values(UserRole));
    } else if (user.role === UserRole.ADMIN) {
      setInvitableRoles([
        UserRole.MODERATOR,
        UserRole.TEACHER,
        UserRole.STUDENT,
        UserRole.GUEST,
      ]);
    } else {
      setInvitableRoles([]);
    }
  };

  // Load invitations and stats
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [invitationsData, statsData] = await Promise.all([
        invitationService.getInvitations(),
        invitationService.getStats(),
      ]);

      setInvitations(invitationsData.invitations);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || "Failed to load invitations");
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Send test email
  const handleSendTestEmail = async () => {
    if (!testEmail.trim()) return;
    
    setTestEmailLoading(true);
    try {
      const response = await fetch('/api/invitations/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: testEmail }),
      });

      if (response.ok) {
        setSuccessMessage('Test email sent successfully!');
        setTestEmail('');
        setShowTestEmailForm(false);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send test email');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send test email');
      setTimeout(() => setError(null), 3000);
    } finally {
      setTestEmailLoading(false);
    }
  };

  // Handle form submission
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Client-side validation
    const email = inviteForm.email.trim();
    if (!email) {
      setError('Email address is required.');
      setInviteLoading(false);
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setInviteLoading(false);
      return;
    }

    if (!inviteForm.role) {
      setError('Please select a role for the invitation.');
      setInviteLoading(false);
      return;
    }

    try {
      await invitationService.createInvitation({ 
        email: email, 
        role: inviteForm.role 
      });
      setSuccessMessage(
        `Invitation sent successfully to ${email}! They will receive an email with a registration link.`
      );
      setInviteForm({ email: "", role: UserRole.STUDENT });
      setShowInviteForm(false);
      loadData(); // Reload data to show new invitation
    } catch (err: any) {
      setError(err.message || "Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  // Handle invitation deletion
  const handleDeleteInvitation = async (invitationId: string) => {
    if (!confirm("Are you sure you want to delete this invitation?")) return;

    try {
      await invitationService.cancelInvitation(invitationId);
      setSuccessMessage("Invitation deleted successfully");
      loadData(); // Reload data
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete invitation");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle invitation resending - not available in current service
  const handleResendInvitation = async (_invitationId: string) => {
    try {
      // For now, just show a message that this feature is not implemented
      setError("Resend functionality not yet implemented");
      setTimeout(() => setError(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to resend invitation");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Format role for display
  const formatRole = (role: UserRole): string => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    loadData();
    loadInvitableRoles();
    loadEmailStatus();
  }, [user]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading invitations...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Invitation Management
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTestEmailForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Test Email
          </button>
          <button
            onClick={() => setShowInviteForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Send Invitation
          </button>
        </div>
      </div>

      {/* Email Service Status */}
      {emailServiceStatus && (
        <div className={`p-4 rounded-lg border ${
          emailServiceStatus.configured 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              emailServiceStatus.configured ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <span className="font-medium">
              Email Service: {emailServiceStatus.configured ? 'Configured' : 'Not Configured'}
            </span>
            {emailServiceStatus.provider && (
              <span className="text-sm text-gray-600">
                ({emailServiceStatus.provider})
              </span>
            )}
          </div>
          {emailServiceStatus.error && (
            <div className="text-sm text-red-600 mt-1">
              {emailServiceStatus.error}
            </div>
          )}
        </div>
      )}

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Unable to send invitation</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Sent</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.total}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-semibold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Accepted</h3>
            <p className="text-2xl font-semibold text-green-600">
              {stats.used}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Expired</h3>
            <p className="text-2xl font-semibold text-red-600">
              {stats.expired}
            </p>
          </div>
        </div>
      )}

      {/* Invitations Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Recent Invitations
          </h2>
        </div>
        {invitations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No invitations found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invitations.map((invitation) => (
                  <tr key={invitation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invitation.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatRole(invitation.role as UserRole)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invitation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleResendInvitation(invitation.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Resend
                        </button>
                        <button
                          onClick={() => handleDeleteInvitation(invitation.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Test Email Modal */}
      {showTestEmailForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Send Test Email
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Email Address
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowTestEmailForm(false);
                    setTestEmail('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendTestEmail}
                  disabled={testEmailLoading || !testEmail.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {testEmailLoading ? "Sending..." : "Send Test"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Send Invitation
            </h3>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The user will receive an email with a registration link
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={inviteForm.role}
                  onChange={(e) =>
                    setInviteForm({
                      ...inviteForm,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {invitableRoles.map((role) => (
                    <option key={role} value={role}>
                      {formatRole(role)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select the role this user will have in the system
                </p>
              </div>
              
              {/* Show current error in modal if any */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteForm(false);
                    setInviteForm({ email: "", role: UserRole.STUDENT });
                    setError(null); // Clear any errors when closing
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading || !inviteForm.email.trim()}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors min-w-[120px]"
                >
                  {inviteLoading ? "Sending..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitationManagement;