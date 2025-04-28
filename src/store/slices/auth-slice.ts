// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Permission, Role, UserDetails } from "../../types";

interface AuthState {
  token: string | null;
  user: UserDetails | null;
  permissions: Permission[];
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
  permissions: [],
  roles: [],
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
      }>
    ) => {
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("access_token", action.payload.token);

      localStorage.setItem("issuedAt", action.payload.issuedAt);
      localStorage.setItem("expiryAt", action.payload.expiryAt);

      state.token = action.payload.token;
      state.issuedAt = action.payload.issuedAt;
      state.expiryAt = action.payload.expiryAt;
      state.isAuthenticated = true;
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
    },
  },
});

export const { setCredentials, clearCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectPermissions = (state: { auth: AuthState }) =>
  state.auth.permissions;
export const selectRoles = (state: { auth: AuthState }) => state.auth.roles;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
// Auth helper functions
export const hasPermission = (
  state: { auth: AuthState },
  permissionName: string
): boolean => {
  return state.auth.permissions.some(
    (p) => p.permission_name.trim() === permissionName
  );
};

export const hasRole = (
  state: { auth: AuthState },
  roleName: string
): boolean => {
  return state.auth.roles.some((r) => r.role_name.trim() === roleName);
};

export const hasRouteAccess = (
  state: { auth: AuthState },
  route: string
): boolean => {
  return state.auth.permissions.some((p) => p.route === route);
};

// Utility function to check token expiry
export const isTokenValid = () => {
  const expiryAt = localStorage.getItem("expiryAt");
  return expiryAt && new Date(expiryAt) > new Date();
};
