import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  ChartBarIcon,
  CreditCardIcon,
  CogIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import {
  ClipboardList,
  Fingerprint,
  KeyRound,
  MonitorDot,
  UserCog,
} from "lucide-react";
import { useAuth } from "../../hooks"; // Import the useAuth hook

// Define types for our component props and data structures
type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface NavigationItem {
  path: string;
  name: string;
  icon: IconComponent;
  requiredPermission?: string; // Permission required to see this item
  requiredRole?: string; // Role required to see this item
}

interface NavigationGroups {
  [key: string]: string[];
}

// Navigation items configuration with permission requirements
const navigationItems: NavigationItem[] = [
  { path: "/", name: "Dashboard", icon: ChartBarIcon }, // Everyone can see dashboard
  {
    path: "/transactions",
    name: "Transactions",
    icon: CreditCardIcon,
    requiredPermission: "view_transactions",
  },
  {
    path: "/customers",
    name: "Customers",
    icon: UsersIcon,
    requiredPermission: "view_customers",
  },
  {
    path: "/trx-monitor",
    name: "Transaction Monitoring",
    icon: MonitorDot,
    requiredPermission: "monitor_transactions",
  },
  {
    path: "/business-registration",
    name: "Merchant Onboarding",
    icon: ClipboardList,
    requiredPermission: "manage_merchants",
  },
  {
    path: "/api",
    name: "API Keys & Integration",
    icon: KeyRound,
    requiredPermission: "manage_api_keys",
  },
  {
    path: "/setting",
    name: "Settings",
    icon: CogIcon,
    requiredPermission: "manage_settings",
  },
  {
    path: "/rbac",
    name: "RBAC",
    icon: UserCog,
    requiredRole: "admin", // Only admins can manage roles and permissions
  },
  {
    path: "/2fa",
    name: "2FA",
    icon: Fingerprint,
    requiredPermission: "manage_security",
  },
];

// Group navigation items by category
const navigationGroups: NavigationGroups = {
  Main: ["/", "/transactions", "/customers"],
  Management: ["/trx-monitor", "/business-registration"],
  System: ["/api", "/setting", "/rbac"],
  Security: ["/2fa"],
};

interface SidebarProps {
  initialCollapsed?: boolean;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  initialCollapsed = false,
  onSignOut = () => {}, // Default empty function
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(initialCollapsed);
  const { hasPermission, hasRole } = useAuth(); // Use the auth hook to check permissions
  const [debug, setDebug] = useState<Array<string>>([]);

  // Add useEffect for debugging
  useEffect(() => {
    console.log("Debug info:", debug);
  }, [debug]);

  const toggleSidebar = (): void => setIsCollapsed(!isCollapsed);

  // Function to check if the user has access to a navigation item
  const hasAccessToNavItem = (item: NavigationItem): boolean => {
    // If no permission or role is required, allow access
    if (!item.requiredPermission && !item.requiredRole) {
      return true;
    }

    // Check permission if required
    if (item.requiredPermission) {
      const hasPermResult = hasPermission(item.requiredPermission);
      console.log(
        `Permission check for ${item.name}: ${item.requiredPermission} = ${hasPermResult}`
      );
      setDebug((prev) => [
        ...prev,
        `Permission ${item.requiredPermission} = ${hasPermResult}`,
      ]);

      if (!hasPermResult) return false;
    }

    // Check role if required
    if (item.requiredRole) {
      const hasRoleResult = hasRole(item.requiredRole);
      console.log(
        `Role check for ${item.name}: ${item.requiredRole} = ${hasRoleResult}`
      );
      setDebug((prev) => [
        ...prev,
        `Role ${item.requiredRole} = ${hasRoleResult}`,
      ]);

      if (!hasRoleResult) return false;
    }

    return true;
  };

  // Function to get the group name for a path
  const getGroupForPath = (path: string): string => {
    for (const [group, paths] of Object.entries(navigationGroups)) {
      if (paths.includes(path)) return group;
    }
    return "Other";
  };

  // Filter and group the navigation items based on permissions
  const groupedNavItems = React.useMemo(() => {
    console.log("Computing navigation items");
    const groupedItems: Record<string, NavigationItem[]> = {};

    navigationItems.forEach((item) => {
      console.log(`Checking access for nav item: ${item.name}`);

      // Only include items the user has access to
      const access = hasAccessToNavItem(item);
      console.log(`Access result for ${item.name}: ${access}`);

      if (access) {
        const group = getGroupForPath(item.path);
        if (!groupedItems[group]) groupedItems[group] = [];
        groupedItems[group].push(item);
      }
    });

    // Filter out empty groups
    return Object.fromEntries(
      Object.entries(groupedItems).filter(([_, items]) => items.length > 0)
    );
  }, [hasPermission, hasRole]); // Re-compute when permission/role checking functions change

  return (
    <div
      className={`relative flex flex-shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col w-full h-full border-r border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-5">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center w-full" : "justify-start"
            }`}
          >
            <h1 className="text-xl font-bold text-indigo-600">
              {isCollapsed ? "D" : "DPS"}
            </h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="h-0 flex-1 flex flex-col pt-2 pb-4 overflow-y-auto scrollbar-thin">
          <nav className="flex-1 px-2 space-y-6">
            {Object.entries(groupedNavItems).map(([group, items]) => (
              <div key={group} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {group}
                  </p>
                )}
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-150
                        ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }
                        ${isCollapsed ? "justify-center" : ""}`
                      }
                      title={isCollapsed ? item.name : ""}
                    >
                      <Icon
                        className={`${
                          isCollapsed ? "mx-auto" : "mr-3"
                        } h-5 w-5`}
                      />
                      {!isCollapsed && <span>{item.name}</span>}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <button
            className={`flex-shrink-0 w-full group block ${
              isCollapsed ? "justify-center" : ""
            }`}
            onClick={onSignOut}
            aria-label="Sign out"
          >
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <div>
                <ArrowLeftOnRectangleIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
              </div>
              {!isCollapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Sign out
                  </p>
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
