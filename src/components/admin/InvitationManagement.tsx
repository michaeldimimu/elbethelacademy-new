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
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    loadData();
    loadInvitableRoles();
  }, [user]);

  // Handle invite form submission
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await invitationService.createInvitation({
        email: inviteForm.email,
        role: inviteForm.role,
      });

      setSuccessMessage(`Invitation sent successfully to ${inviteForm.email}`);
      setInviteForm({ email: "", role: UserRole.STUDENT });
      setShowInviteForm(false);

      // Reload data to show new invitation
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  // Handle canceling invitation
  const handleCancelInvitation = async (invitationId: string) => {
    if (!confirm("Are you sure you want to cancel this invitation?")) {
      return;
    }

    try {
      await invitationService.cancelInvitation(invitationId);
      setSuccessMessage("Invitation cancelled successfully");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to cancel invitation");
    }
  };

  // Copy invitation link to clipboard
  const copyInvitationLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      setSuccessMessage("Invitation link copied to clipboard");
      setTimeout(() => setSuccessMessage(null), 3000);
    });
  };

  if (!user) {
    return <div className="flex justify-center p-8">Loading user data...</div>;
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Invitations</h2>
        <button
          onClick={() => setShowInviteForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Invite New User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total</h3>
            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600">Pending</h3>
            <p className="text-2xl font-bold text-yellow-900">
              {stats.pending}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Accepted</h3>
            <p className="text-2xl font-bold text-green-900">{stats.used}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-600">Expired</h3>
            <p className="text-2xl font-bold text-red-900">{stats.expired}</p>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Invite New User</h3>
            <form onSubmit={handleInviteSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={inviteForm.role}
                  onChange={(e) =>
                    setInviteForm({
                      ...inviteForm,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {invitableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() +
                        role.slice(1).replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={inviteLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={inviteLoading}
                >
                  {inviteLoading ? "Sending..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invitations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                Invited By
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {invitation.role.charAt(0).toUpperCase() +
                      invitation.role.slice(1).replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {invitation.invitedBy.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(invitation.expiresAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() =>
                      copyInvitationLink(invitation.invitationLink)
                    }
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => handleCancelInvitation(invitation.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invitations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No pending invitations
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationManagement;
