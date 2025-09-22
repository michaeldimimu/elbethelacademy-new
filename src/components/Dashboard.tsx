import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Permission } from "../types/roles";

export default function Dashboard() {
  const { user, loading, signOut, hasPermission, isAdmin, isSuperAdmin } =
    useAuth();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Load role-specific data
    const loadData = async () => {
      try {
        const response = await fetch("/api/profile", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setApiData(data);
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                ElBethel Academy
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {user.role.replace("_", " ").toUpperCase()}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* User Information Card */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              User Information
            </h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.username}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">
                  {user.role.replace("_", " ")}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Role-based Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Admin Panel */}
            {isAdmin && (
              <div className="bg-white shadow rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Admin Panel
                </h4>
                <div className="space-y-3">
                  {hasPermission(Permission.CREATE_USER) && (
                    <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-sm text-blue-700 transition-colors">
                      Manage Users
                    </button>
                  )}
                  {hasPermission(Permission.VIEW_ANALYTICS) && (
                    <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-sm text-blue-700 transition-colors">
                      View Reports
                    </button>
                  )}
                  {isSuperAdmin && (
                    <button className="w-full text-left px-4 py-2 bg-red-50 hover:bg-red-100 rounded-md text-sm text-red-700 transition-colors">
                      Super Admin Settings
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Teacher Panel */}
            {hasPermission(Permission.CREATE_COURSE) && (
              <div className="bg-white shadow rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Teaching Tools
                </h4>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-sm text-green-700 transition-colors">
                    Manage Courses
                  </button>
                  {hasPermission(Permission.GRADE_ASSIGNMENTS) && (
                    <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-sm text-green-700 transition-colors">
                      Grade Assignments
                    </button>
                  )}
                  {hasPermission(Permission.VIEW_GRADES) && (
                    <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-sm text-green-700 transition-colors">
                      Student Progress
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Student Panel */}
            {hasPermission(Permission.READ_COURSE) &&
              !hasPermission(Permission.CREATE_COURSE) && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    My Learning
                  </h4>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-sm text-purple-700 transition-colors">
                      My Courses
                    </button>
                    {hasPermission(Permission.SUBMIT_ASSIGNMENTS) && (
                      <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-sm text-purple-700 transition-colors">
                        Submit Assignment
                      </button>
                    )}
                    {hasPermission(Permission.VIEW_GRADES) && (
                      <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-sm text-purple-700 transition-colors">
                        View Grades
                      </button>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* API Data Display */}
          {apiData && (
            <div className="bg-white shadow rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Protected API Data
              </h4>
              <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
                {JSON.stringify(apiData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
