import {
  Bell,
  Search,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Settings,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";

import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/auth-slice";
import { useState } from "react";
import Avatar from "../ui/Avatar";

export const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Title/Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-medium text-gray-900">Dashboard</h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {/* Search - Hidden on mobile */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
            />
          </div>

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
      </div>
    </header>
  );
};
