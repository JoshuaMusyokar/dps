import {
  Bell,
  Search,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Palette,
  ClipboardCheck,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { logout } from "../../store/slices/auth-slice";
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from "react";
import Avatar from "../ui/Avatar";
import { useEnhancedAuth } from "../../hooks"; // Updated import

// Import all your sidebar icons
import {
  ChartBarIcon,
  CreditCardIcon,
  CogIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  ClipboardList,
  Fingerprint,
  KeyRound,
  MonitorDot,
  UserCog,
} from "lucide-react";

// Theme Context (unchanged)
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return (saved as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Enhanced NavigationItem interface with multiple permissions/roles support
type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface NavigationItem {
  path: string;
  name: string;
  icon: IconComponent;
  // Support for multiple permissions (OR logic)
  requiredPermissions?: string[];
  // Support for multiple roles (OR logic)
  requiredRoles?: string[];
  // Support for actions
  requiredAction?: string;
  // Support for route-based access
  routeAccess?: string;
  badge?: string;
  // Legacy support (will be converted to arrays)
  requiredPermission?: string;
  requiredRole?: string;
}

interface NavigationGroups {
  [key: string]: string[];
}

// Enhanced navigation items configuration with multiple permissions/roles
const navigationItems: NavigationItem[] = [
  {
    path: "/",
    name: "Dashboard",
    icon: ChartBarIcon,
  },
  {
    path: "/transactions",
    name: "Transactions",
    icon: CreditCardIcon,
    requiredPermissions: ["view_transactions", "manage_transactions"],
    requiredRoles: ["Administrator", "Transaction Manager"],
    requiredAction: "read",
    badge: "New",
  },
  {
    path: "/customers",
    name: "Customers",
    icon: UsersIcon,
    requiredPermissions: ["Manage Users", "view_customers"],
    requiredAction: "read",
  },
  {
    path: "/trx-monitor",
    name: "Transaction Monitoring",
    icon: MonitorDot,
    requiredPermissions: ["monitor_transactions", "view_transactions"],
    requiredRoles: ["Administrator", "Monitor"],
    requiredAction: "read",
  },
  {
    path: "/business-registration",
    name: "Merchant Onboarding",
    icon: ClipboardList,
    requiredPermissions: ["manage_merchants", "onboard_merchants"],
    requiredRoles: ["Onboarding", "Administrator"],
    requiredAction: "write",
  },
  {
    path: "/onboardings",
    name: "Onboarding List",
    icon: ClipboardCheck,
    requiredPermissions: ["manage_merchants"],
    requiredRoles: ["Administrator"],
    requiredAction: "read",
  },
  {
    path: "/api",
    name: "API Keys & Integration",
    icon: KeyRound,
    requiredPermissions: ["Manage API Keys", "view_api_keys"],
    requiredRoles: ["Administrator", "Developer"],
    requiredAction: "read",
  },
  {
    path: "/settings",
    name: "Settings",
    icon: CogIcon,
    requiredPermissions: ["manage_settings", "view_settings"],
    requiredRoles: ["admin", "Administrator"],
    requiredAction: "read",
  },
  {
    path: "/rbac-1",
    name: "RBAC v1",
    icon: UserCog,
    requiredPermissions: ["Manage API Keys", "manage_rbac"],
    requiredRoles: ["Administrator", "Security Admin"],
  },
  {
    path: "/rbac",
    name: "RBAC",
    icon: UserCog,
    requiredPermissions: ["Manage API Keys", "manage_rbac"],
    requiredRoles: ["Administrator", "Security Admin"],
  },
  {
    path: "/2fa",
    name: "2FA",
    icon: Fingerprint,
    requiredPermissions: ["manage_security", "view_security"],
    requiredRoles: ["Administrator", "Security Admin"],
    requiredAction: "read",
  },
];

// Group navigation items by category (unchanged)
const navigationGroups: NavigationGroups = {
  Main: ["/", "/transactions", "/customers"],
  Management: ["/trx-monitor", "/business-registration"],
  System: ["/api", "/settings", "/rbac", "/rbac-1"],
  Security: ["/2fa"],
};

const getGroupForPath = (path: string): string => {
  for (const [group, paths] of Object.entries(navigationGroups)) {
    if (paths.includes(path)) return group;
  }
  return "Other";
};

// Enhanced Glassmorphism Button Component (unchanged)
const GlassButton = ({
  children,
  onClick,
  className = "",
  variant = "default",
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "primary" | "danger";
  [key: string]: any;
}) => {
  const baseClasses =
    "relative overflow-hidden backdrop-blur-lg border transition-all duration-300 transform hover:scale-105 active:scale-95";

  const variants = {
    default:
      "bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10",
    primary:
      "bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-primary-300/30 dark:border-primary-400/30 hover:from-primary-500/30 hover:to-accent-500/30",
    danger: "bg-red-500/10 border-red-300/30 hover:bg-red-500/20",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Enhanced Navigation Item Component (unchanged)
const NavItem = ({
  item,
  isActive,
  isCollapsed,
  isMobileView,
  onClick,
}: {
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
  isMobileView: boolean;
  onClick?: () => void;
}) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={`
        group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-xl 
        transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
        ${
          isActive
            ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25 dark:shadow-primary-400/20"
            : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-primary-400"
        }
        ${isCollapsed && !isMobileView ? "justify-center" : ""}
      `}
      title={isCollapsed && !isMobileView ? item.name : ""}
    >
      <div className="relative">
        <Icon
          className={`${
            isCollapsed && !isMobileView ? "mx-auto" : "mr-3"
          } h-5 w-5 transition-transform duration-300 group-hover:scale-110`}
        />
        {isActive && (
          <div className="absolute -inset-1 bg-white/20 rounded-lg blur animate-pulse" />
        )}
      </div>

      {(!isCollapsed || isMobileView) && (
        <div className="flex items-center justify-between flex-1">
          <span className="truncate">{item.name}</span>
          {item.badge && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-accent-500/20 text-accent-700 dark:text-accent-300 rounded-full">
              {item.badge}
            </span>
          )}
        </div>
      )}

      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-accent-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </NavLink>
  );
};

// Enhanced access control function that supports multiple permissions and roles
const checkNavigationAccess = (
  item: NavigationItem,
  hasAccess: (options: any) => boolean,
  hasPermissionWithAction: (permission: string, action?: string) => boolean,
  hasRoleAccess: (role: string) => boolean
): boolean => {
  // If no requirements, allow access
  if (
    !item.requiredPermissions &&
    !item.requiredRoles &&
    !item.requiredPermission &&
    !item.requiredRole &&
    !item.routeAccess
  ) {
    console.log("here 1");
    return true;
  }

  console.log("here 2");
  // Convert legacy single permission/role to arrays for consistency
  const permissions =
    item.requiredPermissions ||
    (item.requiredPermission ? [item.requiredPermission] : []);
  const roles =
    item.requiredRoles || (item.requiredRole ? [item.requiredRole] : []);

  // Check if user has ANY of the required permissions (OR logic)
  const hasAnyPermission =
    permissions.length === 0 ||
    permissions.some((permission) =>
      hasPermissionWithAction(permission, item.requiredAction)
    );

  // Check if user has ANY of the required roles (OR logic)
  const hasAnyRole =
    roles.length === 0 || roles.some((role) => hasRoleAccess(role));

  // Check route access if specified
  // const hasRoutePermission =
  //   !item.routeAccess ||
  //   hasAccess({
  //     route: item.routeAccess,
  //     action: item.requiredAction,
  //   });

  // Grant access if user has ANY required permission OR ANY required role OR route access
  // This is the key change: OR logic instead of AND logic
  const hasPermissionAccess = hasAnyPermission;
  const hasRoleBasedAccess = hasAnyRole;
  console.log(
    "check",
    hasPermissionAccess,
    hasRoleBasedAccess
    // hasRoutePermission
  );

  return hasPermissionAccess || hasRoleBasedAccess;
};

// Main layout component with enhanced access control
export const ResponsiveLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Use enhanced auth hook with auto-sync and multiple permission support
  const { hasAccess, hasPermissionWithAction, hasRoleAccess } =
    useEnhancedAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Enhanced access checking function with multiple permissions/roles support
  const hasAccessToNavItem = useCallback(
    (item: NavigationItem): boolean => {
      return checkNavigationAccess(
        item,
        hasAccess,
        hasPermissionWithAction,
        hasRoleAccess
      );
    },
    [hasAccess, hasPermissionWithAction, hasRoleAccess]
  );

  // Group navigation items with enhanced access control
  const groupedNavItems = useMemo(() => {
    const groupedItems: Record<string, NavigationItem[]> = {};

    navigationItems.forEach((item) => {
      if (hasAccessToNavItem(item)) {
        const group = getGroupForPath(item.path);
        if (!groupedItems[group]) groupedItems[group] = [];
        groupedItems[group].push(item);
      }
    });

    // Filter out empty groups
    return Object.fromEntries(
      Object.entries(groupedItems).filter(([_, items]) => items.length > 0)
    );
  }, [hasAccessToNavItem]);

  // Debug: Log accessible items for troubleshooting
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("User permissions:", user);
      console.log("Accessible navigation items:", Object.keys(groupedNavItems));
      console.log(
        "Total accessible items:",
        Object.values(groupedNavItems).flat().length
      );
    }
  }, [groupedNavItems, user]);

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Sidebar */}
      <div
        className={`
          ${
            isMobileView
              ? "fixed inset-0 z-50 transform transition-all duration-500 ease-out"
              : "relative"
          }
          ${
            isMobileView && !isMobileMenuOpen
              ? "-translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }
          ${
            !isMobileView && isCollapsed
              ? "w-20"
              : !isMobileView
              ? "w-72"
              : "w-full md:w-72"
          }
        `}
      >
        {/* Mobile Overlay */}
        {isMobileView && isMobileMenuOpen && (
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Sidebar Content */}
        <div
          className={`
            ${
              isMobileView
                ? "absolute inset-y-0 left-0 max-w-sm w-full"
                : "h-full"
            }
            flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50 shadow-2xl
          `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/10 dark:border-gray-700/50">
            <div
              className={`flex items-center ${
                isCollapsed && !isMobileView
                  ? "justify-center w-full"
                  : "justify-start"
              }`}
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl blur opacity-20 animate-pulse" />
                <h1 className="relative text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
                  {isCollapsed && !isMobileView ? "D" : "DPS"}
                </h1>
              </div>
            </div>

            {isMobileView ? (
              <GlassButton
                onClick={toggleMobileMenu}
                className="p-2 rounded-xl"
                variant="default"
              >
                <X className="h-5 w-5" />
              </GlassButton>
            ) : (
              <GlassButton
                onClick={toggleSidebar}
                className="p-2 rounded-xl"
                variant="default"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </GlassButton>
            )}
          </div>

          {/* Navigation Section with Enhanced Access Control */}
          <div className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-200 dark:scrollbar-thumb-gray-600">
            <nav className="space-y-8">
              {Object.entries(groupedNavItems).map(([group, items]) => (
                <div key={group} className="space-y-2">
                  {(!isCollapsed || isMobileView) && (
                    <div className="flex items-center px-3 mb-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                      <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {group}
                      </p>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                    </div>
                  )}
                  {items.map((item) => (
                    <NavItem
                      key={item.path}
                      item={item}
                      isActive={location.pathname === item.path}
                      isCollapsed={isCollapsed}
                      isMobileView={isMobileView}
                      onClick={isMobileView ? toggleMobileMenu : undefined}
                    />
                  ))}
                </div>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="flex-shrink-0 p-4 border-t border-white/10 dark:border-gray-700/50">
            <GlassButton
              onClick={handleLogout}
              className={`w-full p-3 rounded-xl flex items-center ${
                isCollapsed && !isMobileView ? "justify-center" : ""
              }`}
              variant="danger"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              {(!isCollapsed || isMobileView) && (
                <span className="ml-3 font-medium">Sign out</span>
              )}
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Main Content Area - Rest remains the same */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Enhanced Mobile-First Responsive Topbar */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-700/50 shadow-lg">
          <div className="flex h-16 sm:h-18 items-center justify-between px-3 sm:px-4 md:px-6">
            {/* Left Side - Mobile First */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              {/* Mobile Menu Button */}
              {isMobileView && (
                <GlassButton
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-xl flex-shrink-0"
                  variant="default"
                >
                  <Menu className="h-5 w-5" />
                </GlassButton>
              )}

              {/* Title Section - Responsive */}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent truncate">
                  {isMobileView ? "DPS" : "Dashboard"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate hidden sm:block">
                  Welcome back, {user?.first_name || "User"}
                </p>
              </div>
            </div>

            {/* Right Side - Mobile Optimized */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
              {/* Desktop Search Bar */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-64 xl:w-80 pl-11 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-white/20 dark:border-gray-600/30 rounded-2xl text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
                  placeholder="Search anything..."
                />
              </div>

              {/* Mobile Search Button */}
              <GlassButton
                className="p-2 sm:p-3 rounded-xl lg:hidden"
                variant="default"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </GlassButton>

              {/* Theme Toggle */}
              <GlassButton
                onClick={toggleTheme}
                className="p-2 sm:p-3 rounded-xl"
                variant="default"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </GlassButton>

              {/* Notifications */}
              <GlassButton
                className="p-2 sm:p-3 rounded-xl relative"
                variant="default"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse" />
              </GlassButton>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <GlassButton
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-1.5 sm:p-2 rounded-xl"
                    variant="primary"
                  >
                    <Avatar user={user} size={isMobileView ? "md" : "lg"} />
                  </GlassButton>

                  {/* Mobile-Optimized Dropdown */}
                  {isDropdownOpen && (
                    <>
                      {/* Mobile Backdrop */}
                      {isMobileView && (
                        <div
                          className="fixed inset-0 bg-black/20 z-40"
                          onClick={() => setIsDropdownOpen(false)}
                        />
                      )}

                      <div
                        className={`
                absolute right-0 mt-3 rounded-2xl shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 divide-y divide-gray-100 dark:divide-gray-700 z-50 transform transition-all duration-300 scale-100 opacity-100
                ${isMobileView ? "w-56" : "w-64"}
              `}
                      >
                        <div className="p-3 sm:p-4">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user?.first_name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                        <div className="py-1 sm:py-2">
                          <button
                            onClick={() => {
                              navigate("/settings");
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center transition-colors duration-200"
                          >
                            <Settings className="mr-3 h-4 w-4" />
                            <span>Settings</span>
                          </button>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors duration-200"
                          >
                            <LogOut className="mr-3 h-4 w-4" />
                            <span>Log out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  {isMobileView ? (
                    <GlassButton
                      onClick={() => navigate("/login")}
                      className="p-2 sm:p-3 rounded-xl"
                      variant="primary"
                    >
                      <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                    </GlassButton>
                  ) : (
                    <>
                      <GlassButton
                        onClick={() => navigate("/login")}
                        className="px-3 sm:px-4 py-2 rounded-xl flex items-center text-sm"
                        variant="default"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </GlassButton>
                      <GlassButton
                        onClick={() => navigate("/register")}
                        className="px-3 sm:px-4 py-2 rounded-xl flex items-center text-sm"
                        variant="primary"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                      </GlassButton>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
