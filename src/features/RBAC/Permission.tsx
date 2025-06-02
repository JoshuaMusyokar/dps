import React, { FC, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Key,
  Users,
  Lock,
} from "lucide-react";
import {
  Permission,
  PermissionGroup,
  FormattedRoleWithPermissions,
} from "../../types";
import { useAppSelector } from "../../hooks";
import {
  selectPermissionGroups,
  selectPermissions,
  selectRolesWithPermissions,
} from "../../store/slices/rbac-slice";
import { PermissionModal } from "./PermissionModal";

interface PermissionManagementProps {
  onCreatePermission: (permission: Omit<Permission, "permission_id">) => void;
  onUpdatePermission: (
    permissionId: string,
    updates: Partial<Permission>
  ) => void;
  onDeletePermission: (permissionId: string) => void;
  onToggleStatus?: (permissionId: string, status: 0 | 1) => void;
}

// Main Permission Management Component
export const PermissionManagement: FC<PermissionManagementProps> = ({
  onCreatePermission,
  onUpdatePermission,
  onDeletePermission,
  onToggleStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const permissions = useAppSelector(selectPermissions);
  const permissionGroups = useAppSelector(selectPermissionGroups);
  const roles = useAppSelector(selectRolesWithPermissions);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Filter permissions
  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.permission_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      permission.permission_description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      permission.action.toLowerCase().includes(searchTerm.toLowerCase());
    //   ||
    //   permission.resource.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction =
      actionFilter === "all" || permission.action === actionFilter;

    const matchesGroup =
      groupFilter === "all" || permission.permission_group_id === groupFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        (permission.status === undefined || permission.status === 1)) ||
      (statusFilter === "inactive" && permission.status === 0);

    return matchesSearch && matchesAction && matchesGroup && matchesStatus;
  });

  // Group permissions by resource for better organization
  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    const action = permission.action || "Other";
    if (!acc[action]) {
      acc[action] = [];
    }
    acc[action].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleCreatePermission = () => {
    setEditingPermission(null);
    setIsModalOpen(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleSavePermission = (
    permissionData: Omit<Permission, "permission_id">
  ) => {
    if (editingPermission) {
      onUpdatePermission(editingPermission.permission_id, permissionData);
    } else {
      onCreatePermission(permissionData);
    }
  };

  const handleDeleteClick = (permissionId: string) => {
    setShowDeleteConfirm(permissionId);
    setActiveDropdown(null);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      onDeletePermission(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleToggleStatus = (
    permissionId: string,
    currentStatus: number | undefined
  ) => {
    if (onToggleStatus) {
      const newStatus =
        currentStatus === 1 || currentStatus === undefined ? 0 : 1;
      onToggleStatus(permissionId, newStatus);
      setActiveDropdown(null);
    }
  };

  const getActionBadge = (action: string) => {
    const actionConfig = {
      read: "bg-success-100 text-success-800 dark:bg-success-800/20 dark:text-success-300",
      write:
        "bg-primary-100 text-primary-800 dark:bg-primary-800/20 dark:text-primary-300",
      delete:
        "bg-error-100 text-error-800 dark:bg-error-800/20 dark:text-error-300",
      update:
        "bg-warning-100 text-warning-800 dark:bg-warning-800/20 dark:text-warning-300",
      create:
        "bg-accent-100 text-accent-800 dark:bg-accent-800/20 dark:text-accent-300",
      manage:
        "bg-dark-primary-100 text-dark-primary-800 dark:bg-dark-primary-800/20 dark:text-dark-primary-300",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          actionConfig[action as keyof typeof actionConfig] ||
          "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300"
        }`}
      >
        {action}
      </span>
    );
  };

  const getStatusBadge = (status: number | undefined) => {
    if (status === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800 dark:bg-error-800/20 dark:text-error-300">
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-800/20 dark:text-success-300">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    );
  };

  const getPermissionGroup = (groupId: string | null) => {
    if (!groupId) return null;
    return permissionGroups.find((group) => group.group_id === groupId);
  };

  const getRoleCount = (permissionId: string) => {
    return roles.filter((role) =>
      role.permissions.some((p) => p.permission_id === permissionId)
    ).length;
  };

  const uniqueActions = Array.from(new Set(permissions.map((p) => p.action)));

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Permission Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage system permissions and their configurations
          </p>
        </div>
        <button
          onClick={handleCreatePermission}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Permission
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Key className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Permissions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {permissions.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-success-400 dark:text-success-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {
                      permissions.filter(
                        (p) => p.status === undefined || p.status === 1
                      ).length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-primary-400 dark:text-primary-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Resources
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {new Set(permissions.map((p) => p.action)).size}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-accent-400 dark:text-accent-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    In Use
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {
                      permissions.filter(
                        (p) => getRoleCount(p.permission_id) > 0
                      ).length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 sm:text-sm"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 sm:text-sm"
        >
          <option value="all">All Actions</option>
          {uniqueActions.map((action) => (
            <option key={action} value={action}>
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 sm:text-sm"
        >
          <option value="all">All Groups</option>
          {permissionGroups.map((group) => (
            <option key={group.group_id} value={group.group_id}>
              {group.group_name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "active" | "inactive")
          }
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 sm:text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Permissions List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {Object.keys(groupedPermissions).length === 0 ? (
          <div className="px-4 py-12 text-center">
            <Key className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              No permissions found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || actionFilter !== "all" || groupFilter !== "all"
                ? "Try adjusting your search criteria."
                : "Get started by creating a new permission."}
            </p>
            {!searchTerm && actionFilter === "all" && groupFilter === "all" && (
              <div className="mt-6">
                <button
                  onClick={handleCreatePermission}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Permission
                </button>
              </div>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {Object.entries(groupedPermissions).map(
              ([resource, resourcePermissions]) => (
                <li key={resource}>
                  <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        {resource.replace(/_/g, " ")} (
                        {resourcePermissions.length})
                      </h3>
                    </div>
                  </div>
                  <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {resourcePermissions.map((permission) => {
                      const permissionGroup = getPermissionGroup(
                        permission.permission_group_id
                      );
                      const roleCount = getRoleCount(permission.permission_id);

                      return (
                        <li
                          key={permission.permission_id}
                          className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                {getActionBadge(permission.action)}
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {permission.permission_name}
                                </p>
                                {permission.status !== undefined &&
                                  getStatusBadge(permission.status)}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                                {permission.permission_description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                {permissionGroup && (
                                  <span className="flex items-center">
                                    <Shield className="h-3 w-3 mr-1" />
                                    {permissionGroup.group_name}
                                  </span>
                                )}
                                <span className="flex items-center">
                                  <Users className="h-3 w-3 mr-1" />
                                  {roleCount} roles
                                </span>
                              </div>
                            </div>

                            <div className="flex-shrink-0 relative">
                              <button
                                onClick={() =>
                                  setActiveDropdown(
                                    activeDropdown === permission.permission_id
                                      ? null
                                      : permission.permission_id
                                  )
                                }
                                className="inline-flex items-center p-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {activeDropdown === permission.permission_id && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-10">
                                  <div className="py-1">
                                    <button
                                      onClick={() =>
                                        handleEditPermission(permission)
                                      }
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                    >
                                      <Edit className="h-4 w-4 mr-3" />
                                      Edit
                                    </button>
                                    {onToggleStatus && (
                                      <button
                                        onClick={() =>
                                          handleToggleStatus(
                                            permission.permission_id,
                                            permission.status
                                          )
                                        }
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                      >
                                        {permission.status === 0 ? (
                                          <>
                                            <CheckCircle className="h-4 w-4 mr-3" />
                                            Activate
                                          </>
                                        ) : (
                                          <>
                                            <XCircle className="h-4 w-4 mr-3" />
                                            Deactivate
                                          </>
                                        )}
                                      </button>
                                    )}
                                    <button
                                      onClick={() =>
                                        handleDeleteClick(
                                          permission.permission_id
                                        )
                                      }
                                      className="flex items-center px-4 py-2 text-sm text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 w-full text-left"
                                    >
                                      <Trash2 className="h-4 w-4 mr-3" />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )
            )}
          </ul>
        )}
      </div>

      {/* Create/Edit Modal */}
      <PermissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePermission}
        editingPermission={editingPermission}
        permissionGroups={permissionGroups}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" />

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error-100 dark:bg-error-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-error-600 dark:text-error-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                      Delete Permission
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this permission? This
                        action cannot be undone and may affect users and roles
                        that currently have this permission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-error-600 text-base font-medium text-white hover:bg-error-700 dark:bg-error-700 dark:hover:bg-error-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 dark:focus:ring-offset-gray-800 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};
