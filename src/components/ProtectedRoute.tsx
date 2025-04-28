import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks";
import {
  hasPermission,
  hasRole,
  hasRouteAccess,
  selectIsAuthenticated,
} from "../store/slices/auth-slice";

interface ProtectedRouteProps {
  requiredPermission?: string;
  requiredRole?: string;
  path?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermission,
  requiredRole,
  path,
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  //   const isLoading = useAppSelector(selectIsLoadin);
  const location = useLocation();
  const routePath = path || location.pathname;
  const hasAccess = useAppSelector((state) => {
    const permissionCheck =
      !requiredPermission || hasPermission(state, requiredPermission);
    const roleCheck = !requiredRole || hasRole(state, requiredRole);
    const routeCheck = !path || hasRouteAccess(state, routePath);
    return permissionCheck && roleCheck && routeCheck;
  });

  //   if (isLoading) {
  //     return <div>Loading...</div>;
  //   }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
