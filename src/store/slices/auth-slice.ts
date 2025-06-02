// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PermissionOnAuth, Role, UserDetails } from "../../types";
import { RootState } from "..";

interface AuthState {
  token: string | null;
  user: UserDetails | null;
  permissions: PermissionOnAuth[];
  roles: Role[];
  issuedAt: string | null;
  expiryAt: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("access_token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,
  issuedAt: localStorage.getItem("issuedAt"),
  permissions: JSON.parse(localStorage.getItem("permissions") ?? "[]"),
  roles: JSON.parse(localStorage.getItem("roles") ?? "[]"),
  expiryAt: localStorage.getItem("expiryAt"),
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: UserDetails;
        token: string;
        issuedAt: string;
        expiryAt: string;
        permissions: PermissionOnAuth[];
      }>
    ) => {
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("access_token", action.payload.token);

      localStorage.setItem("issuedAt", action.payload.issuedAt);
      localStorage.setItem("expiryAt", action.payload.expiryAt);
      localStorage.setItem(
        "permissions",
        JSON.stringify(action.payload.permissions)
      );

      state.token = action.payload.token;
      state.issuedAt = action.payload.issuedAt;
      state.expiryAt = action.payload.expiryAt;
      state.permissions = action.payload.permissions;
      state.isAuthenticated = true;
    },
    // Add action to sync roles from RBAC slice
    syncRolesFromRBAC: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
      localStorage.setItem("roles", JSON.stringify(action.payload));
    },
    // Update user's permissions based on their role changes
    updateUserPermissions: (
      state,
      action: PayloadAction<PermissionOnAuth[]>
    ) => {
      state.permissions = action.payload;
      localStorage.setItem("permissions", JSON.stringify(action.payload));
    },

    // Update user's roles when their role assignments change
    updateUserRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
      localStorage.setItem("roles", JSON.stringify(action.payload));
    },
    // Add action to sync permissions from RBAC slice
    syncPermissionsFromRBAC: (
      state,
      action: PayloadAction<PermissionOnAuth[]>
    ) => {
      state.permissions = action.payload;
      localStorage.setItem("permissions", JSON.stringify(action.payload));
    },
    clearCredentials: (state) => {
      state.token = null;
      state.issuedAt = null;
      state.expiryAt = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("issuedAt");
      localStorage.removeItem("expiryAt");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
    },
    logout: (state) => {
      state.token = null;
      state.issuedAt = null;
      state.expiryAt = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("issuedAt");
      localStorage.removeItem("expiryAt");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  logout,
  updateUserPermissions,
  updateUserRoles,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectPermissions = (state: { auth: AuthState }) =>
  state.auth.permissions;
export const selectRoles = (state: { auth: AuthState }) => state.auth.roles;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
// Enhanced Auth helper functions with action support
export const hasPermission = (
  state: { auth: AuthState },
  permissionName: string,
  requiredAction?: string
): boolean => {
  if (state.auth.permissions.length < 0) {
    return false;
  }
  // console.log("permsss check", state.auth.permissions);
  return state.auth.permissions.some((p) => {
    // console.log("perm check", p, permissionName);
    const nameMatches = p.permission_name.trim() === permissionName;
    if (!requiredAction) return nameMatches;

    // Check if the permission has the required action
    return nameMatches && p.action === requiredAction;
  });
};

export const hasRole = (
  state: { auth: AuthState },
  roleName: string
): boolean => {
  return state.auth.roles.some((r) => r.role_name.trim() === roleName);
};

export const hasRouteAccess = (
  state: { auth: AuthState },
  route: string,
  requiredAction?: string
): boolean => {
  return state.auth.permissions.some((p) => {
    const routeMatches = p.route === route;
    if (!requiredAction) return routeMatches;

    return routeMatches && p.action === requiredAction;
  });
};

// Enhanced access control - allows access if EITHER permission OR role exists
export const hasAccess = (
  state: { auth: AuthState },
  options: {
    permission?: string;
    role?: string;
    route?: string;
    action?: string;
  }
): boolean => {
  const { permission, role, route, action } = options;

  let hasPermissionAccess = false;
  let hasRoleAccess = false;

  // Check permission access
  if (permission) {
    hasPermissionAccess = hasPermission(state, permission, action);
  }

  // Check role access
  if (role) {
    hasRoleAccess = hasRole(state, role);
  }

  // Check route access
  if (route && !permission) {
    hasPermissionAccess = hasRouteAccess(state, route, action);
  }

  // Return true if either permission or role grants access
  return hasPermissionAccess || hasRoleAccess;
};

// Utility functions
export const isTokenValid = () => {
  const expiryAt = localStorage.getItem("expiryAt");
  return expiryAt && new Date(expiryAt) > new Date();
};

// Utility function to check if user is authenticated with a valid token
export const isAuthenticatedWithValidToken = (state: RootState): boolean => {
  return !!(state.auth.isAuthenticated && isTokenValid());
};
