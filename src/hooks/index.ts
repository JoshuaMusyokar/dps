import { useCallback, useEffect, useState } from "react";
import { dummyStats, dummyRevenueData, dummyTransactions } from "../data/dummy";
import type { DashboardStats, RevenueData, Transaction } from "../types";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  selectIsAuthenticated,
  selectPermissions as selectUserPermissions, // Updated selector name
  selectRoles as selectUserRoles, // Updated selector name
  hasPermission as checkPermissionSelector,
  hasRole as checkRoleSelector,
  hasRouteAccess as checkRouteAccessSelector,
  hasAccess as checkAccessSelector, // New enhanced function
  isAuthenticatedWithValidToken,
  hasAccess,
  hasRole,
} from "../store/slices/auth-slice";
import { useSyncUserPermissions } from "./user";
// Enhanced Navigation Access Hook
interface NavigationItem {
  requiredPermission?: string;
  requiredRole?: string;
  requiredAction?: string;
  route?: string;
}

export const useNavigationAccess = () => {
  const authState = useSelector((state: RootState) => state.auth);

  // Keep user permissions synced
  useSyncUserPermissions();

  const hasAccessToNavItem = useCallback(
    (item: NavigationItem): boolean => {
      // If no requirements, allow access
      if (!item.requiredPermission && !item.requiredRole) {
        return true;
      }

      // Use the enhanced hasAccess function that supports OR logic
      return checkAccessSelector(
        { auth: authState },
        {
          permission: item.requiredPermission,
          role: item.requiredRole,
          route: item.route,
          action: item.requiredAction,
        }
      );
    },
    [authState]
  );

  const hasPermissionWithAction = useCallback(
    (permissionName: string, action?: string): boolean => {
      return checkPermissionSelector(
        { auth: authState },
        permissionName,
        action
      );
    },
    [authState]
  );

  const hasRoleAccess = useCallback(
    (roleName: string): boolean => {
      return hasRole({ auth: authState }, roleName);
    },
    [authState]
  );

  return {
    hasAccessToNavItem,
    hasPermissionWithAction,
    hasRoleAccess,
    hasAccess: (options: Parameters<typeof hasAccess>[1]) =>
      hasAccess({ auth: authState }, options),
  };
};

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({} as DashboardStats);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      setStats(dummyStats);
      setRevenueData(dummyRevenueData);
      setTransactions(dummyTransactions.slice(0, 5)); // Show only 5 recent transactions
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const applyFilters = (filters: any) => {
    setIsLoading(true);
    // Simulate filtered data
    setTimeout(() => {
      let filtered = [...dummyTransactions];

      if (filters.status) {
        filtered = filtered.filter((t) => t.status === filters.status);
      }

      if (filters.paymentMethod) {
        filtered = filtered.filter(
          (t) => t.paymentMethod === filters.paymentMethod
        );
      }

      if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        filtered = filtered.filter((t) => {
          const date = new Date(t.date);
          return date >= start && date <= end;
        });
      }

      setTransactions(filtered.slice(0, 5));
      setIsLoading(false);
    }, 800);
  };

  return { stats, revenueData, transactions, isLoading, applyFilters };
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Enhanced useAuth hook with action support and auto-sync
export const useAuth = () => {
  // Get all necessary state from Redux at the top level of the hook
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const permissions = useAppSelector(selectUserPermissions); // Updated to user-specific
  const roles = useAppSelector(selectUserRoles); // Updated to user-specific

  // Pre-fetch the state object once
  const state = useAppSelector((state) => state.auth);

  // Check if authenticated with valid token (not expired)
  const isAuthValid = useAppSelector(isAuthenticatedWithValidToken);

  // Enhanced functions with action support
  const hasPermission = (
    permissionName: string,
    requiredAction?: string
  ): boolean => {
    return checkPermissionSelector(
      { auth: state },
      permissionName,
      requiredAction
    );
  };

  const hasRole = (roleName: string): boolean => {
    return checkRoleSelector({ auth: state }, roleName);
  };

  const hasRouteAccess = (route: string, requiredAction?: string): boolean => {
    return checkRouteAccessSelector({ auth: state }, route, requiredAction);
  };

  // New enhanced access function with OR logic
  const hasAccess = (options: {
    permission?: string;
    role?: string;
    route?: string;
    action?: string;
  }): boolean => {
    return checkAccessSelector({ auth: state }, options);
  };

  return {
    isAuthenticated,
    permissions,
    roles,
    isAuthValid,
    hasPermission, // Now supports action parameter
    hasRole,
    hasRouteAccess, // Now supports action parameter
    hasAccess, // New OR logic function
  };
};

// Alternative: Use the new comprehensive navigation hook
export const useEnhancedAuth = () => {
  // This hook automatically syncs user permissions and provides enhanced access control
  const {
    hasAccessToNavItem,
    hasPermissionWithAction,
    hasRoleAccess,
    hasAccess,
  } = useNavigationAccess();

  // Still get basic auth state
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const permissions = useAppSelector(selectUserPermissions);
  const roles = useAppSelector(selectUserRoles);
  const isAuthValid = useAppSelector(isAuthenticatedWithValidToken);

  return {
    isAuthenticated,
    permissions,
    roles,
    isAuthValid,

    // Enhanced access control functions
    hasAccessToNavItem, // For navigation items with OR logic
    hasPermissionWithAction, // Permission with action support
    hasRoleAccess, // Role-based access
    hasAccess, // Generic access with OR logic

    // Backward compatibility aliases
    hasPermission: hasPermissionWithAction,
    hasRole: hasRoleAccess,
  };
};

// Usage examples:
/*
const MyComponent = () => {
  const { 
    hasPermission, 
    hasRole, 
    hasAccess, 
    hasAccessToNavItem 
  } = useEnhancedAuth();
  
  // Check specific permission with action
  const canEditUsers = hasPermission('user_management', 'write');
  const canViewUsers = hasPermission('user_management', 'read');
  const canViewUsersAnyAction = hasPermission('user_management'); // Any action
  
  // Check role
  const isAdmin = hasRole('admin');
  
  // Check with OR logic - user needs EITHER permission OR role
  const canAccessDashboard = hasAccess({
    permission: 'dashboard_view',
    role: 'admin',
    action: 'read'
  });
  
  // Navigation item access with OR logic
  const canViewReports = hasAccessToNavItem({
    requiredPermission: 'reports_view',
    requiredRole: 'manager',
    requiredAction: 'read'
  });
  
  return (
    <div>
      {canEditUsers && <EditUserButton />}
      {canViewUsers && <ViewUsersTable />}
      {isAdmin && <AdminPanel />}
      {canAccessDashboard && <Dashboard />}
      {canViewReports && <ReportsSection />}
    </div>
  );
};
*/
