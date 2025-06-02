import React from "react";
import { Shield, Lock, User } from "lucide-react";

// Shimmer animation component
const Shimmer = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] ${className}`}
    style={{
      animation: "shimmer 1.5s ease-in-out infinite",
    }}
  >
    <style>
      {`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}
    </style>
  </div>
);

// Card skeleton component
const CardSkeleton = ({ height = "h-24", showActions = true }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-soft dark:shadow-glass-dark">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <Shimmer className={`${height} w-3/4 rounded mb-3`} />
        <Shimmer className="h-4 w-full rounded mb-2" />
        <Shimmer className="h-4 w-2/3 rounded" />
      </div>
      {showActions && (
        <div className="flex space-x-2 ml-4">
          <Shimmer className="h-8 w-16 rounded" />
          <Shimmer className="h-8 w-16 rounded" />
        </div>
      )}
    </div>
  </div>
);

// Table skeleton component
const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-soft dark:shadow-glass-dark">
    {/* Table Header */}
    <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Shimmer key={i} className="h-5 w-24 rounded flex-1" />
        ))}
      </div>
    </div>

    {/* Table Rows */}
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
        >
          <div className="flex space-x-4 items-center">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1">
                {colIndex === 0 ? (
                  <div className="flex items-center space-x-3">
                    <Shimmer className="h-8 w-8 rounded-full" />
                    <Shimmer className="h-4 w-32 rounded" />
                  </div>
                ) : colIndex === columns - 1 ? (
                  <div className="flex space-x-2">
                    <Shimmer className="h-6 w-12 rounded" />
                    <Shimmer className="h-6 w-12 rounded" />
                  </div>
                ) : (
                  <Shimmer className="h-4 w-24 rounded" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Stats skeleton component
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-soft dark:shadow-glass-dark"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Shimmer className="h-4 w-20 rounded mb-2" />
            <Shimmer className="h-8 w-16 rounded" />
          </div>
          <Shimmer className="h-12 w-12 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// Search and filter skeleton
const FilterSkeleton = () => (
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    <div className="flex-1">
      <Shimmer className="h-10 w-full rounded-lg" />
    </div>
    <div className="flex space-x-2">
      <Shimmer className="h-10 w-24 rounded-lg" />
      <Shimmer className="h-10 w-32 rounded-lg" />
    </div>
  </div>
);

// Roles tab skeleton
const RolesTabSkeleton = () => (
  <div className="mt-8">
    <div className="flex justify-between items-center mb-6">
      <div>
        <Shimmer className="h-7 w-32 rounded mb-2" />
        <Shimmer className="h-4 w-64 rounded" />
      </div>
      <Shimmer className="h-10 w-32 rounded-lg" />
    </div>

    <StatsSkeleton />
    <FilterSkeleton />

    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} height="h-6" />
      ))}
    </div>
  </div>
);

// Permissions tab skeleton
const PermissionsTabSkeleton = () => (
  <div className="mt-8">
    <div className="flex justify-between items-center mb-6">
      <div>
        <Shimmer className="h-7 w-36 rounded mb-2" />
        <Shimmer className="h-4 w-72 rounded" />
      </div>
      <Shimmer className="h-10 w-36 rounded-lg" />
    </div>

    <FilterSkeleton />
    <TableSkeleton rows={8} columns={5} />
  </div>
);

// Users tab skeleton
const UsersTabSkeleton = () => (
  <div className="mt-8">
    <div className="flex justify-between items-center mb-6">
      <div>
        <Shimmer className="h-7 w-28 rounded mb-2" />
        <Shimmer className="h-4 w-56 rounded" />
      </div>
      <Shimmer className="h-10 w-28 rounded-lg" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-soft dark:shadow-glass-dark"
        >
          <Shimmer className="h-4 w-16 rounded mb-2" />
          <Shimmer className="h-6 w-8 rounded" />
        </div>
      ))}
    </div>

    <FilterSkeleton />
    <TableSkeleton rows={10} columns={6} />
  </div>
);

// Main RBAC Loading Skeleton Component
const RBACLoadingSkeleton = ({ activeTab = "roles" }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-6">
          <Shimmer className="h-9 w-80 rounded mb-2" />
          <Shimmer className="h-5 w-96 rounded" />
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === "roles"
                  ? "border-primary-500 dark:border-dark-primary-400 text-primary-600 dark:text-dark-primary-400"
                  : "border-transparent text-gray-500 dark:text-gray-400"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
            >
              <Shield className="mr-2 h-4 w-4" />
              Roles
            </button>
            <button
              className={`${
                activeTab === "permissions"
                  ? "border-primary-500 dark:border-dark-primary-400 text-primary-600 dark:text-dark-primary-400"
                  : "border-transparent text-gray-500 dark:text-gray-400"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
            >
              <Lock className="mr-2 h-4 w-4" />
              Permissions
            </button>
            <button
              className={`${
                activeTab === "users"
                  ? "border-primary-500 dark:border-dark-primary-400 text-primary-600 dark:text-dark-primary-400"
                  : "border-transparent text-gray-500 dark:text-gray-400"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
            >
              <User className="mr-2 h-4 w-4" />
              Users
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "roles" && <RolesTabSkeleton />}
        {activeTab === "permissions" && <PermissionsTabSkeleton />}
        {activeTab === "users" && <UsersTabSkeleton />}
      </div>
    </div>
  );
};

export default RBACLoadingSkeleton;
