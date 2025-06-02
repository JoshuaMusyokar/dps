import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  routePath?: string;
}

/**
 * A component that protects routes based on authentication status and optional permissions or roles
 *
 * @param children - The components to render if the user has access
 * @param requiredPermission - Optional permission required to access this route
 * @param requiredRole - Optional role required to access this route
 * @param routePath - Optional specific route path to check access for
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  routePath,
}) => {
  const {
    isAuthenticated,
    isAuthValid,
    hasPermission,
    hasRole,
    hasRouteAccess,
  } = useAuth();
  const location = useLocation();

  // If token is invalid or user is not authenticated, redirect to login
  if (!isAuthValid) {
    // Save the location the user was trying to access for potential redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check specific permission if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check specific role if required
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check specific route access if required
  if (routePath && !hasRouteAccess(routePath)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User has passed all checks, render the protected content
  return <>{children}</>;
};
