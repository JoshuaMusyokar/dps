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
  Home,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { useNavigate, NavLink } from "react-router-dom";
import { logout } from "../../store/slices/auth-slice";
import { useState, useEffect } from "react";
import Avatar from "../ui/Avatar";

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

// Define types for our component props and data structures
type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface NavigationItem {
  path: string;
  name: string;
  icon: IconComponent;
}

interface NavigationGroups {
  [key: string]: string[];
}

// Navigation items configuration
const navigationItems: NavigationItem[] = [
  { path: "/", name: "Dashboard", icon: ChartBarIcon },
  { path: "/transactions", name: "Transactions", icon: CreditCardIcon },
  { path: "/customers", name: "Customers", icon: UsersIcon },
  { path: "/trx-monitor", name: "Transaction Monitoring", icon: MonitorDot },
  {
    path: "/business-registration",
    name: "Merchant Onboarding",
    icon: ClipboardList,
  },
  { path: "/api", name: "API Keys & Integration", icon: KeyRound },
  { path: "/settings", name: "Settings", icon: CogIcon },
  { path: "/rbac", name: "RBAC", icon: UserCog },
  { path: "/2fa", name: "2FA", icon: Fingerprint },
];

// Group navigation items by category
const navigationGroups: NavigationGroups = {
  Main: ["/", "/transactions", "/customers"],
  Management: ["/trx-monitor", "/business-registration"],
  System: ["/api", "/setting", "/rbac"],
  Security: ["/2fa"],
};

// Helper function to get group for path
const getGroupForPath = (path: string): string => {
  for (const [group, paths] of Object.entries(navigationGroups)) {
    if (paths.includes(path)) return group;
  }
  return "Other";
};

// Group the navigation items
const groupedNavItems: Record<string, NavigationItem[]> = {};
navigationItems.forEach((item) => {
  const group = getGroupForPath(item.path);
  if (!groupedNavItems[group]) groupedNavItems[group] = [];
  groupedNavItems[group].push(item);
});

// Combined layout component with responsive behavior
export const ResponsiveLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize(); // Set initial state
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

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar - Hidden on mobile unless menu is open */}
      <div
        className={`
            ${
              isMobileView
                ? "fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out"
                : "relative"
            }
            ${
              isMobileView && !isMobileMenuOpen
                ? "-translate-x-full"
                : "translate-x-0"
            }
            ${
              !isMobileView && isCollapsed
                ? "w-20"
                : !isMobileView
                ? "w-64"
                : "w-full md:w-64"
            }
          `}
      >
        {/* Overlay for mobile */}
        {isMobileView && isMobileMenuOpen && (
          <div
            className="absolute inset-0 bg-gray-600 bg-opacity-75"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Sidebar Content */}
        <div
          className={`
            ${
              isMobileView
                ? "absolute inset-y-0 left-0 max-w-xs w-full"
                : "h-full"
            }
            flex flex-col bg-white border-r border-gray-200 shadow-sm
          `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-5">
            <div
              className={`flex items-center ${
                isCollapsed && !isMobileView
                  ? "justify-center w-full"
                  : "justify-start"
              }`}
            >
              <h1 className="text-xl font-bold text-indigo-600">
                {isCollapsed && !isMobileView ? "D" : "DPS"}
              </h1>
            </div>

            {/* Close button only on mobile */}
            {isMobileView ? (
              <button
                onClick={toggleMobileMenu}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            ) : (
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </button>
            )}
          </div>

          {/* Navigation Section */}
          <div className="h-0 flex-1 flex flex-col pt-2 pb-4 overflow-y-auto scrollbar-thin">
            <nav className="flex-1 px-2 space-y-6">
              {Object.entries(groupedNavItems).map(([group, items]) => (
                <div key={group} className="space-y-1">
                  {(!isCollapsed || isMobileView) && (
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
                        onClick={isMobileView ? toggleMobileMenu : undefined}
                        className={({ isActive }) =>
                          `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-150
                            ${
                              isActive
                                ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }
                            ${
                              isCollapsed && !isMobileView
                                ? "justify-center"
                                : ""
                            }`
                        }
                        title={isCollapsed && !isMobileView ? item.name : ""}
                      >
                        <Icon
                          className={`${
                            isCollapsed && !isMobileView ? "mx-auto" : "mr-3"
                          } h-5 w-5`}
                        />
                        {(!isCollapsed || isMobileView) && (
                          <span>{item.name}</span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              className={`flex-shrink-0 w-full group block ${
                isCollapsed && !isMobileView ? "justify-center" : ""
              }`}
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <div
                className={`flex items-center ${
                  isCollapsed && !isMobileView ? "justify-center" : ""
                }`}
              >
                <div>
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                </div>
                {(!isCollapsed || isMobileView) && (
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

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container flex h-16 items-center justify-between px-4">
            {/* Left Side - Title and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {isMobileView && (
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 -ml-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
              <h1 className="text-lg font-medium text-gray-900">Dashboard</h1>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-4">
              {/* Search - Only visible on larger screens */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search..."
                />
              </div>

              {/* Mobile search button */}
              {isMobileView && (
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Search className="h-5 w-5" />
                </button>
              )}

              {/* Notifications */}
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* User dropdown */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  >
                    <Avatar user={user} size="lg" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.first_name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            navigate("/settings");
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center">
                  {/* On mobile, show simplified login buttons */}
                  {isMobileView ? (
                    <button
                      onClick={() => navigate("/login")}
                      className="p-2 rounded-md hover:bg-gray-100"
                    >
                      <LogIn className="h-5 w-5" />
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate("/login")}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </button>
                      <button
                        onClick={() => navigate("/register")}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

// Usage example:
// import { ResponsiveLayout } from './path/to/ResponsiveLayout';
//
// function App() {
//   return (
//     <ResponsiveLayout>
//       {/* Your page content goes here */}
//       <h1>Hello World</h1>
//     </ResponsiveLayout>
//   );
// }
