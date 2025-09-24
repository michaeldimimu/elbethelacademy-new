// Define available roles in the system
export const UserRole = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MODERATOR: "moderator",
  TEACHER: "teacher",
  STUDENT: "student",
  GUEST: "guest",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Define permissions that can be assigned to roles
export const Permission = {
  // User management
  CREATE_USER: "create_user",
  READ_USER: "read_user",
  UPDATE_USER: "update_user",
  DELETE_USER: "delete_user",
  MANAGE_ROLES: "manage_roles",
  INVITE_USERS: "invite_users",

  // Content management
  CREATE_COURSE: "create_course",
  READ_COURSE: "read_course",
  UPDATE_COURSE: "update_course",
  DELETE_COURSE: "delete_course",

  // Academic operations
  GRADE_ASSIGNMENTS: "grade_assignments",
  VIEW_GRADES: "view_grades",
  SUBMIT_ASSIGNMENTS: "submit_assignments",

  // System administration
  ACCESS_ADMIN_PANEL: "access_admin_panel",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_SYSTEM_SETTINGS: "manage_system_settings",

  // Communication
  SEND_ANNOUNCEMENTS: "send_announcements",
  ACCESS_MESSAGING: "access_messaging",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

// Role-Permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // Super admin has all permissions
    ...Object.values(Permission),
  ],

  [UserRole.ADMIN]: [
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.MANAGE_ROLES,
    Permission.INVITE_USERS,
    Permission.CREATE_COURSE,
    Permission.READ_COURSE,
    Permission.UPDATE_COURSE,
    Permission.DELETE_COURSE,
    Permission.ACCESS_ADMIN_PANEL,
    Permission.VIEW_ANALYTICS,
    Permission.SEND_ANNOUNCEMENTS,
    Permission.ACCESS_MESSAGING,
    Permission.VIEW_GRADES,
  ],

  [UserRole.MODERATOR]: [
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.READ_COURSE,
    Permission.UPDATE_COURSE,
    Permission.ACCESS_ADMIN_PANEL,
    Permission.SEND_ANNOUNCEMENTS,
    Permission.ACCESS_MESSAGING,
    Permission.VIEW_GRADES,
  ],

  [UserRole.TEACHER]: [
    Permission.READ_USER,
    Permission.CREATE_COURSE,
    Permission.READ_COURSE,
    Permission.UPDATE_COURSE,
    Permission.GRADE_ASSIGNMENTS,
    Permission.VIEW_GRADES,
    Permission.SEND_ANNOUNCEMENTS,
    Permission.ACCESS_MESSAGING,
  ],

  [UserRole.STUDENT]: [
    Permission.READ_COURSE,
    Permission.SUBMIT_ASSIGNMENTS,
    Permission.VIEW_GRADES,
    Permission.ACCESS_MESSAGING,
  ],

  [UserRole.GUEST]: [Permission.READ_COURSE],
};

// Helper function to check if a role has a specific permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

// Helper function to check if a role has any of the specified permissions
export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

// Helper function to check if a role has all of the specified permissions
export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

// Get all permissions for a role
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Check if a role is admin-level (admin or super_admin)
export function isAdminRole(role: UserRole): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN;
}

// Check if a role is staff-level (admin, moderator, or teacher)
export function isStaffRole(role: UserRole): boolean {
  return (
    role === UserRole.SUPER_ADMIN ||
    role === UserRole.ADMIN ||
    role === UserRole.MODERATOR ||
    role === UserRole.TEACHER
  );
}

// Role hierarchy - higher number means higher privilege
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.GUEST]: 0,
  [UserRole.STUDENT]: 1,
  [UserRole.TEACHER]: 2,
  [UserRole.MODERATOR]: 3,
  [UserRole.ADMIN]: 4,
  [UserRole.SUPER_ADMIN]: 5,
};

// Check if one role is higher than another
export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
}

// Check if one role is higher or equal to another
export function isHigherOrEqualRole(role1: UserRole, role2: UserRole): boolean {
  return ROLE_HIERARCHY[role1] >= ROLE_HIERARCHY[role2];
}
