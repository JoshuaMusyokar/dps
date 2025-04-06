import { Clock, User } from "lucide-react";
import React, { useState, useEffect } from "react";

import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  CheckSquare,
  Square,
  Search,
  Save,
  X,
  Check,
  Lock,
  Unlock,
  Shield,
  Plus,
} from "lucide-react";

// TypeScript interfaces
interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  createdAt: string;
  updatedAt: string;
  isSystemRole: boolean;
  permissions: Permission[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: "read" | "write" | "delete" | "manage";
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  lastActive: string;
  status: "active" | "inactive" | "pending";
}

interface ResourceMap {
  [key: string]: string[];
}

// Component for Role-Based Access Control
const RBACManagementPage: React.FC = () => {
  // State for roles
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditingRole, setIsEditingRole] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>("");
  const [newRoleDescription, setNewRoleDescription] = useState<string>("");

  // State for permissions
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissionSearchTerm, setPermissionSearchTerm] = useState<string>("");

  // State for users
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState<string>("");

  // State for UI elements
  const [activeTab, setActiveTab] = useState<"roles" | "permissions" | "users">(
    "roles"
  );
  const [showAddRoleModal, setShowAddRoleModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Load mock data
  useEffect(() => {
    // Mock permissions data
    const mockPermissions: Permission[] = [
      {
        id: "1",
        name: "View Payments",
        description: "View all payment transactions",
        resource: "payments",
        action: "read",
      },
      {
        id: "2",
        name: "Process Refunds",
        description: "Process refund transactions",
        resource: "payments",
        action: "write",
      },
      {
        id: "3",
        name: "View Customers",
        description: "View customer details",
        resource: "customers",
        action: "read",
      },
      {
        id: "4",
        name: "Edit Customers",
        description: "Edit customer information",
        resource: "customers",
        action: "write",
      },
      {
        id: "5",
        name: "Delete Customers",
        description: "Remove customers from the system",
        resource: "customers",
        action: "delete",
      },
      {
        id: "6",
        name: "View Webhooks",
        description: "View webhook configurations",
        resource: "webhooks",
        action: "read",
      },
      {
        id: "7",
        name: "Edit Webhooks",
        description: "Edit webhook settings",
        resource: "webhooks",
        action: "write",
      },
      {
        id: "8",
        name: "Manage API Keys",
        description: "Create, view, and revoke API keys",
        resource: "api_keys",
        action: "manage",
      },
      {
        id: "9",
        name: "View Reports",
        description: "Access financial reports",
        resource: "reports",
        action: "read",
      },
      {
        id: "10",
        name: "Manage Users",
        description: "Add, edit and remove users",
        resource: "users",
        action: "manage",
      },
      {
        id: "11",
        name: "Manage Roles",
        description: "Create and configure roles",
        resource: "roles",
        action: "manage",
      },
      {
        id: "12",
        name: "View Subscriptions",
        description: "View subscription details",
        resource: "subscriptions",
        action: "read",
      },
      {
        id: "13",
        name: "Edit Subscriptions",
        description: "Modify subscription plans",
        resource: "subscriptions",
        action: "write",
      },
      {
        id: "14",
        name: "System Settings",
        description: "Change system-wide settings",
        resource: "settings",
        action: "manage",
      },
    ];

    // Mock roles
    const mockRoles: Role[] = [
      {
        id: "1",
        name: "Administrator",
        description: "Full system access with all permissions",
        userCount: 3,
        createdAt: "2025-01-15T10:30:00Z",
        updatedAt: "2025-03-18T14:22:33Z",
        isSystemRole: true,
        permissions: mockPermissions.filter((p) =>
          [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
          ].includes(p.id)
        ),
      },
      {
        id: "2",
        name: "Finance Manager",
        description: "Access to financial aspects of the system",
        userCount: 5,
        createdAt: "2025-01-20T11:30:00Z",
        updatedAt: "2025-03-20T09:12:45Z",
        isSystemRole: false,
        permissions: mockPermissions.filter((p) =>
          ["1", "2", "9", "12", "13"].includes(p.id)
        ),
      },
      {
        id: "3",
        name: "Customer Support",
        description: "Manage customer accounts and basic operations",
        userCount: 12,
        createdAt: "2025-01-25T09:15:00Z",
        updatedAt: "2025-03-15T16:30:20Z",
        isSystemRole: false,
        permissions: mockPermissions.filter((p) =>
          ["1", "3", "12"].includes(p.id)
        ),
      },
      {
        id: "4",
        name: "Developer",
        description: "Manage API keys and webhook integrations",
        userCount: 8,
        createdAt: "2025-02-05T14:45:00Z",
        updatedAt: "2025-04-01T11:20:15Z",
        isSystemRole: false,
        permissions: mockPermissions.filter((p) =>
          ["6", "7", "8"].includes(p.id)
        ),
      },
      {
        id: "5",
        name: "Read Only",
        description: "View-only access across the system",
        userCount: 7,
        createdAt: "2025-02-10T16:20:00Z",
        updatedAt: "2025-03-25T10:05:30Z",
        isSystemRole: true,
        permissions: mockPermissions.filter((p) =>
          ["1", "3", "6", "9", "12"].includes(p.id)
        ),
      },
    ];

    // Mock users
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        roles: ["1"],
        lastActive: "2025-04-05T14:22:33Z",
        status: "active",
      },
      {
        id: "2",
        name: "Sarah Thompson",
        email: "sarah.t@example.com",
        roles: ["1"],
        lastActive: "2025-04-06T09:12:45Z",
        status: "active",
      },
      {
        id: "3",
        name: "Michael Chen",
        email: "michael.chen@example.com",
        roles: ["2"],
        lastActive: "2025-04-04T11:30:20Z",
        status: "active",
      },
      {
        id: "4",
        name: "Emma Rodriguez",
        email: "emma.r@example.com",
        roles: ["2", "5"],
        lastActive: "2025-04-02T16:45:10Z",
        status: "active",
      },
      {
        id: "5",
        name: "David Wilson",
        email: "david.w@example.com",
        roles: ["3"],
        lastActive: "2025-04-01T10:15:40Z",
        status: "inactive",
      },
      {
        id: "6",
        name: "Lisa Turner",
        email: "lisa.turner@example.com",
        roles: ["3"],
        lastActive: "2025-04-03T13:50:30Z",
        status: "active",
      },
      {
        id: "7",
        name: "James Miller",
        email: "james.m@example.com",
        roles: ["4"],
        lastActive: "2025-04-05T15:40:25Z",
        status: "active",
      },
      {
        id: "8",
        name: "Olivia Davis",
        email: "o.davis@example.com",
        roles: ["4", "5"],
        lastActive: "2025-04-02T09:30:15Z",
        status: "active",
      },
      {
        id: "9",
        name: "Daniel Brown",
        email: "daniel.brown@example.com",
        roles: ["5"],
        lastActive: "2025-03-30T11:20:10Z",
        status: "pending",
      },
      {
        id: "10",
        name: "Sophia Martinez",
        email: "sophia.m@example.com",
        roles: ["2", "3"],
        lastActive: "2025-04-04T14:10:35Z",
        status: "active",
      },
    ];

    setAllPermissions(mockPermissions);
    setRoles(mockRoles);
    setUsers(mockUsers);
  }, []);

  // Group permissions by resource
  const groupPermissionsByResource = (): ResourceMap => {
    const resourceMap: ResourceMap = {};

    allPermissions.forEach((permission) => {
      if (!resourceMap[permission.resource]) {
        resourceMap[permission.resource] = [];
      }
      resourceMap[permission.resource].push(permission.id);
    });

    return resourceMap;
  };

  // Handle selecting a role
  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions.map((p) => p.id));
    setNewRoleName(role.name);
    setNewRoleDescription(role.description);
  };

  // Filter roles by search term
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter permissions by search term
  const filteredPermissions = allPermissions.filter(
    (permission) =>
      permission.name
        .toLowerCase()
        .includes(permissionSearchTerm.toLowerCase()) ||
      permission.description
        .toLowerCase()
        .includes(permissionSearchTerm.toLowerCase()) ||
      permission.resource
        .toLowerCase()
        .includes(permissionSearchTerm.toLowerCase())
  );

  // Filter users by search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // Toggle permission selection
  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Toggle all permissions in a resource group
  const toggleResourcePermissions = (permissionIds: string[]) => {
    const allSelected = permissionIds.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !permissionIds.includes(id))
      );
    } else {
      const newPermissions = [...selectedPermissions];
      permissionIds.forEach((id) => {
        if (!newPermissions.includes(id)) {
          newPermissions.push(id);
        }
      });
      setSelectedPermissions(newPermissions);
    }
  };

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Start creating a new role
  const startCreateRole = () => {
    setNewRoleName("");
    setNewRoleDescription("");
    setSelectedPermissions([]);
    setShowAddRoleModal(true);
  };

  // Create or update a role
  const saveRole = () => {
    if (isEditingRole && selectedRole) {
      // Update existing role
      const updatedRoles = roles.map((role) =>
        role.id === selectedRole.id
          ? {
              ...role,
              name: newRoleName,
              description: newRoleDescription,
              updatedAt: new Date().toISOString(),
              permissions: allPermissions.filter((p) =>
                selectedPermissions.includes(p.id)
              ),
            }
          : role
      );
      setRoles(updatedRoles);
      setIsEditingRole(false);
    } else {
      // Create new role
      const newRole: Role = {
        id: `${roles.length + 1}`,
        name: newRoleName,
        description: newRoleDescription,
        userCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSystemRole: false,
        permissions: allPermissions.filter((p) =>
          selectedPermissions.includes(p.id)
        ),
      };
      setRoles([...roles, newRole]);
      setShowAddRoleModal(false);
    }

    // Reset form
    setNewRoleName("");
    setNewRoleDescription("");
    setSelectedPermissions([]);
    setSelectedRole(null);
  };

  // Delete a role
  const deleteRole = (roleId: string) => {
    setRoles(roles.filter((role) => role.id !== roleId));
    if (selectedRole && selectedRole.id === roleId) {
      setSelectedRole(null);
    }
  };

  // Start editing a role
  const startEditRole = (role: Role) => {
    handleSelectRole(role);
    setIsEditingRole(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditingRole(false);
    setSelectedRole(null);
    setNewRoleName("");
    setNewRoleDescription("");
    setSelectedPermissions([]);
  };

  // Format date
  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get role name by ID
  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown Role";
  };

  // Get badge class for user status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Role-Based Access Control
        </h1>
        <p className="mt-2 text-gray-600">
          Manage roles, permissions, and user access to system resources.
        </p>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("roles")}
              className={`${
                activeTab === "roles"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Shield className="mr-2" />
              Roles
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`${
                activeTab === "permissions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Lock className="mr-2" />
              Permissions
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <User className="mr-2" />
              Users
            </button>
          </nav>
        </div>

        {/* Roles Tab */}
        {/* Roles Tab */}
        {activeTab === "roles" && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={startCreateRole}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="mr-2" />
                Create Role
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Roles List */}
              <div className="md:col-span-1 bg-white rounded-lg shadow">
                <div className="px-4 py-5 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Roles
                  </h3>
                </div>
                <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {filteredRoles.length === 0 ? (
                    <li className="px-4 py-4 text-center text-gray-500">
                      No roles found. Create your first role.
                    </li>
                  ) : (
                    filteredRoles.map((role) => (
                      <li
                        key={role.id}
                        className={`px-4 py-4 cursor-pointer hover:bg-gray-50 ${
                          selectedRole?.id === role.id ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleSelectRole(role)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {role.name}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {role.description}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {role.isSystemRole && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                System
                              </span>
                            )}
                            <span className="ml-2 text-sm text-gray-500">
                              {role.userCount} users
                            </span>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Role Details & Permissions */}
              <div className="md:col-span-2 bg-white rounded-lg shadow">
                {selectedRole ? (
                  <>
                    <div className="px-4 py-5 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        {isEditingRole ? (
                          <input
                            type="text"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            className="text-lg font-medium text-gray-900 px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Role name"
                          />
                        ) : (
                          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                            {selectedRole.name}
                            {selectedRole.isSystemRole && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                System
                              </span>
                            )}
                          </h3>
                        )}

                        <div className="flex space-x-2">
                          {isEditingRole ? (
                            <>
                              <button
                                onClick={saveRole}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Save className="mr-1" /> Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <X className="mr-1" /> Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditRole(selectedRole)}
                                disabled={selectedRole.isSystemRole}
                                className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                  selectedRole.isSystemRole
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                <Edit className="mr-1" /> Edit
                              </button>
                              <button
                                onClick={() => deleteRole(selectedRole.id)}
                                disabled={selectedRole.isSystemRole}
                                className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                  selectedRole.isSystemRole
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                <Trash2 className="mr-1" /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {isEditingRole ? (
                        <textarea
                          value={newRoleDescription}
                          onChange={(e) =>
                            setNewRoleDescription(e.target.value)
                          }
                          className="mt-2 w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          rows={2}
                          placeholder="Role description"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-500">
                          {selectedRole.description}
                        </p>
                      )}

                      <div className="mt-2 text-sm text-gray-500 flex items-center space-x-4">
                        <div>Created: {formatDate(selectedRole.createdAt)}</div>
                        <div>Updated: {formatDate(selectedRole.updatedAt)}</div>
                        <div>Users: {selectedRole.userCount}</div>
                      </div>
                    </div>

                    <div className="px-4 py-5">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          Permissions
                        </h4>
                        {isEditingRole && (
                          <div className="relative w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search className="text-gray-400" />
                            </div>
                            <input
                              type="text"
                              placeholder="Filter permissions..."
                              value={permissionSearchTerm}
                              onChange={(e) =>
                                setPermissionSearchTerm(e.target.value)
                              }
                              className="pl-10 pr-3 py-1 w-full text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {Object.entries(groupPermissionsByResource()).map(
                          ([resource, permissionIds]) => {
                            // Filter permissions to only those in this resource group
                            const resourcePermissions = allPermissions.filter(
                              (p) =>
                                p.resource === resource &&
                                (isEditingRole
                                  ? filteredPermissions.some(
                                      (fp) => fp.id === p.id
                                    )
                                  : true)
                            );

                            // Skip empty resources (when filtering)
                            if (resourcePermissions.length === 0) return null;

                            // Check if all permissions in this resource are selected
                            const allResourceSelected =
                              resourcePermissions.every((p) =>
                                selectedPermissions.includes(p.id)
                              );

                            return (
                              <div
                                key={resource}
                                className="border border-gray-200 rounded-md overflow-hidden"
                              >
                                <div
                                  className="bg-gray-50 px-4 py-2 flex justify-between items-center cursor-pointer"
                                  onClick={() =>
                                    isEditingRole &&
                                    toggleResourcePermissions(
                                      resourcePermissions.map((p) => p.id)
                                    )
                                  }
                                >
                                  <h5 className="text-sm font-medium text-gray-700 capitalize">
                                    {resource.replace("_", " ")}
                                  </h5>
                                  {isEditingRole && (
                                    <div>
                                      {allResourceSelected ? (
                                        <CheckSquare className="text-blue-500" />
                                      ) : (
                                        <Square className="text-gray-400" />
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="divide-y divide-gray-200">
                                  {resourcePermissions.map((permission) => (
                                    <div
                                      key={permission.id}
                                      className={`px-4 py-2 flex justify-between items-center ${
                                        isEditingRole
                                          ? "cursor-pointer hover:bg-gray-50"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        isEditingRole &&
                                        togglePermission(permission.id)
                                      }
                                    >
                                      <div>
                                        <div className="text-sm text-gray-900 flex items-center">
                                          {permission.name}
                                          <span
                                            className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                              permission.action === "read"
                                                ? "bg-green-100 text-green-800"
                                                : permission.action === "write"
                                                ? "bg-blue-100 text-blue-800"
                                                : permission.action === "delete"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-purple-100 text-purple-800"
                                            }`}
                                          >
                                            {permission.action}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          {permission.description}
                                        </p>
                                      </div>
                                      <div className="ml-4 flex-shrink-0">
                                        {isEditingRole ? (
                                          selectedPermissions.includes(
                                            permission.id
                                          ) ? (
                                            <CheckSquare className="text-blue-500" />
                                          ) : (
                                            <Square className="text-gray-400" />
                                          )
                                        ) : (
                                          selectedPermissions.includes(
                                            permission.id
                                          ) && (
                                            <Check className="text-green-500" />
                                          )
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-12 text-center">
                    <Shield className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No role selected
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select a role from the list to view details
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={startCreateRole}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        Create New Role
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === "permissions" && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                All Permissions
              </h2>
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={permissionSearchTerm}
                  onChange={(e) => setPermissionSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredPermissions.length === 0 ? (
                  <li className="px-4 py-4 text-center text-gray-500">
                    No permissions found matching your search.
                  </li>
                ) : (
                  Object.entries(groupPermissionsByResource()).map(
                    ([resource, permissionIds]) => {
                      const resourcePermissions = allPermissions.filter(
                        (p) =>
                          p.resource === resource &&
                          filteredPermissions.some((fp) => fp.id === p.id)
                      );

                      if (resourcePermissions.length === 0) return null;

                      return (
                        <li key={resource}>
                          <div className="bg-gray-50 px-4 py-2">
                            <h3 className="text-sm font-medium text-gray-700 capitalize">
                              {resource.replace("_", " ")}
                            </h3>
                          </div>
                          <ul className="divide-y divide-gray-200">
                            {resourcePermissions.map((permission) => (
                              <li key={permission.id}>
                                <div className="px-4 py-4 sm:px-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          permission.action === "read"
                                            ? "bg-green-100 text-green-800"
                                            : permission.action === "write"
                                            ? "bg-blue-100 text-blue-800"
                                            : permission.action === "delete"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-purple-100 text-purple-800"
                                        }`}
                                      >
                                        {permission.action}
                                      </span>
                                      <p className="ml-3 text-sm font-medium text-gray-900">
                                        {permission.name}
                                      </p>
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex">
                                      <p className="text-xs text-gray-500">
                                        {
                                          roles.filter((r) =>
                                            r.permissions.some(
                                              (p) => p.id === permission.id
                                            )
                                          ).length
                                        }{" "}
                                        roles
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                      <p className="flex items-center text-sm text-gray-500">
                                        {permission.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    }
                  )
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                System Users
              </h2>
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <li className="px-4 py-4 text-center text-gray-500">
                    No users found matching your search.
                  </li>
                ) : (
                  filteredUsers.map((user) => (
                    <li key={user.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 text-lg font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                user.status
                              )}`}
                            >
                              {user.status.charAt(0).toUpperCase() +
                                user.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {user.roles
                                .map((roleId) => getRoleName(roleId))
                                .join(", ")}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <p>
                              Last active:{" "}
                              <time dateTime={user.lastActive}>
                                {new Date(user.lastActive).toLocaleDateString()}
                              </time>
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Add Role Modal */}
        {showAddRoleModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Create New Role
                    </h3>
                    <div className="mt-2">
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="role-name"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Role Name
                          </label>
                          <input
                            type="text"
                            id="role-name"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g. Finance Manager"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="role-description"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Description
                          </label>
                          <textarea
                            id="role-description"
                            rows={3}
                            value={newRoleDescription}
                            onChange={(e) =>
                              setNewRoleDescription(e.target.value)
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Brief description of this role's purpose"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    onClick={saveRole}
                    disabled={!newRoleName}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm ${
                      !newRoleName ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Create Role
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddRoleModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RBACManagementPage;
