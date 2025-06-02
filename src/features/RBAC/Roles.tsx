import {
  Check,
  CheckSquare,
  Edit,
  Plus,
  Save,
  Search,
  Shield,
  Square,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  Key,
  Settings,
  ArrowLeft,
} from "lucide-react";
import {
  FormattedRoleWithPermissions,
  Permission,
  UpdateRole,
  MapPermissionsToRoleReq,
  RolePermissionMapResponse,
} from "../../types";
import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  selectPermissions,
  selectRolesWithPermissions,
  updateRole,
  updateRoleWithPermissions,
} from "../../store/slices/rbac-slice";
import {
  useCreatePermissionsToRoleMapMutation,
  useUpdateRoleMutation,
} from "../../store/apis/public-api";

interface RoleManagementProps {
  selectedPermissions: string[];
  setSelectedPermissions: (permissions: string[]) => void;
  setRolesWithPermissions: (roles: FormattedRoleWithPermissions[]) => void;
  startCreateRole: () => void;
  setShowAddRoleModal: (show: boolean) => void;
}

interface ResourceMap {
  [key: string]: string[];
}

type ViewMode = "list" | "details" | "permissions";

export const RoleManagement: FC<RoleManagementProps> = ({
  selectedPermissions,
  setSelectedPermissions,
  setRolesWithPermissions,
  startCreateRole,
  setShowAddRoleModal,
}) => {
  const [newRoleDescription, setNewRoleDescription] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newRoleName, setNewRoleName] = useState<string>("");
  const [isEditingRole, setIsEditingRole] = useState<boolean>(false);
  const [permissionSearchTerm, setPermissionSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] =
    useState<FormattedRoleWithPermissions | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>("list");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [updateRoleFn, { isLoading: isUpdateRoleLoading }] =
    useUpdateRoleMutation();
  const [
    createPermissionsToRoleMap,
    { isLoading: isCreatePermissionsToRoleMapLoading },
  ] = useCreatePermissionsToRoleMapMutation();
  const [expandedResources, setExpandedResources] = useState<Set<string>>(
    new Set()
  );
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(selectPermissions) || [];
  const roles = useAppSelector(selectRolesWithPermissions) || [];

  // Reset view to list when no role is selected
  useEffect(() => {
    if (!selectedRole && currentView !== "list") {
      setCurrentView("list");
    }
  }, [selectedRole, currentView]);

  // Group permissions by resource
  const groupPermissionsByResource = (): ResourceMap => {
    const resourceMap: ResourceMap = {};
    permissions.forEach((permission) => {
      if (!resourceMap[permission.action]) {
        resourceMap[permission.action] = [];
      }
      resourceMap[permission.action].push(permission.permission_id);
    });
    return resourceMap;
  };

  // Toggle permission selection
  const togglePermission = (permissionId: string) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId)
      );
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  // Filter permissions by search term
  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.permission_name
        .toLowerCase()
        .includes(permissionSearchTerm.toLowerCase()) ||
      permission.permission_description
        .toLowerCase()
        .includes(permissionSearchTerm.toLowerCase()) ||
      permission.action
        .toLowerCase()
        .includes(permissionSearchTerm.toLowerCase())
  );

  // Filter roles by search term
  const filteredRoles = roles.filter(
    (role) =>
      role.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.role_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle all permissions in a resource group
  const toggleResourcePermissions = (permissionIds: string[]) => {
    const allSelected = permissionIds.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      setSelectedPermissions(
        selectedPermissions.filter((id) => !permissionIds.includes(id))
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

  // Handle selecting a role
  const handleSelectRole = (role: FormattedRoleWithPermissions) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions.map((p) => p.permission_id));
    setNewRoleName(role.role_name);
    setNewRoleDescription(role.role_description);
    setCurrentView("details");
  };
  function formatRolePermissionResponse(
    data: RolePermissionMapResponse[]
  ): FormattedRoleWithPermissions[] {
    const grouped = new Map<string, FormattedRoleWithPermissions>();

    data.forEach((item) => {
      const {
        role: { role_id, role_name, role_description, is_active },
        permission,
      } = item;

      if (!grouped.has(role_id)) {
        grouped.set(role_id, {
          role_id,
          role_name,
          role_description,
          is_active,
          permissions: [],
        });
      }

      grouped.get(role_id)?.permissions.push({
        permission_id: permission.permission_id,
        permission_name: permission.permission_name,
        route: permission.route,
        action: permission.action,
        is_active: permission.is_active,
      });
    });

    return Array.from(grouped.values());
  }

  // Save role using API
  const saveRole = async () => {
    if (!selectedRole || !newRoleName.trim()) return;

    setIsSaving(true);
    try {
      // Update role details
      const updateRoleRes = await updateRoleFn({
        roleId: selectedRole.role_id,
        role: {
          role_name: newRoleName,
          role_description: newRoleDescription,
        },
      }).unwrap();
      const { role_id, ...updates } = updateRoleRes.details!;
      dispatch(updateRole({ roleId: role_id, updates }));

      // Filter out non-string values
      const validPermissions = selectedPermissions.filter(
        (p): p is string => typeof p === "string"
      );

      // Update permissions
      const permissionsMappedRes = await createPermissionsToRoleMap({
        roleId: selectedRole.role_id,
        permissions: {
          permissions: validPermissions,
        },
      }).unwrap();
      const formattedRes = formatRolePermissionResponse(
        permissionsMappedRes.details!
      );
      dispatch(updateRoleWithPermissions(formattedRes));

      dispatch(updateRole({ roleId: role_id, updates }));
      // Update local state
      const updatedRoles = roles.map((role) =>
        role.role_id === selectedRole.role_id
          ? {
              ...role,
              role_name: newRoleName,
              role_description: newRoleDescription,
              permissions: permissions
                .filter((p) => selectedPermissions.includes(p.permission_id))
                .map((p) => ({
                  permission_id: p.permission_id,
                  permission_name: p.permission_name,
                  route: p.route,
                  action: p.action,
                  is_active: p.status,
                })),
            }
          : role
      );

      setRolesWithPermissions(updatedRoles);
      setIsEditingRole(false);
      setCurrentView("details");
    } catch (error) {
      console.error("Error saving role:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a role
  const deleteRole = (roleId: string) => {
    setRolesWithPermissions(roles.filter((role) => role.role_id !== roleId));
    if (selectedRole && selectedRole.role_id === roleId) {
      setSelectedRole(null);
      setCurrentView("list");
    }
  };

  // Start editing a role
  const startEditRole = (role: FormattedRoleWithPermissions) => {
    handleSelectRole(role);
    setIsEditingRole(true);
    setCurrentView("details");
  };

  // Cancel editing
  const cancelEdit = () => {
    if (selectedRole) {
      setNewRoleName(selectedRole.role_name);
      setNewRoleDescription(selectedRole.role_description);
      setSelectedPermissions(
        selectedRole.permissions.map((p) => p.permission_id)
      );
    }
    setIsEditingRole(false);
    setCurrentView("details");
  };

  // Navigate back to list on mobile
  const navigateBack = () => {
    if (currentView === "permissions") {
      setCurrentView("details");
    } else if (currentView === "details") {
      setCurrentView("list");
      setSelectedRole(null);
      setIsEditingRole(false);
    }
  };

  // Toggle resource expansion
  const toggleResourceExpansion = (resource: string) => {
    const newExpanded = new Set(expandedResources);
    if (newExpanded.has(resource)) {
      newExpanded.delete(resource);
    } else {
      newExpanded.add(resource);
    }
    setExpandedResources(newExpanded);
  };

  // Render mobile navigation header
  const renderMobileHeader = () => (
    <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      {currentView !== "list" && (
        <button
          onClick={navigateBack}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
      )}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {currentView === "list"
          ? "Roles"
          : currentView === "details"
          ? selectedRole?.role_name || "Role Details"
          : "Permissions"}
      </h2>
      <div className="w-16" /> {/* Spacer for centering */}
    </div>
  );

  // Render roles list
  const renderRolesList = () => (
    <div
      className={`${
        currentView === "list" ? "block" : "hidden lg:block"
      } lg:w-1/3`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft dark:shadow-glass-dark border border-gray-200 dark:border-gray-700 h-full">
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              Roles ({filteredRoles.length})
            </h3>
            <button
              onClick={startCreateRole}
              className="lg:hidden flex items-center px-3 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 text-sm"
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-96 lg:max-h-[600px]">
          {filteredRoles.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Shield className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No roles found. Create your first role.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRoles.map((role) => (
                <div
                  key={role.role_id}
                  className={`px-4 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200 ${
                    selectedRole?.role_id === role.role_id
                      ? "bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500 dark:border-primary-400"
                      : ""
                  }`}
                  onClick={() => handleSelectRole(role)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {role.role_name}
                        </h4>
                        {role.is_active === 1 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 flex-shrink-0">
                            System
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                        {role.role_description || "No description provided"}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Key className="h-3 w-3 mr-1" />
                          {role.permissions.length} permissions
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 lg:hidden" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render role details
  const renderRoleDetails = () => (
    <div
      className={`${
        currentView === "details" ? "block" : "hidden lg:block"
      } lg:w-2/3`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft dark:shadow-glass-dark border border-gray-200 dark:border-gray-700 h-full">
        {selectedRole ? (
          <>
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
                <div className="flex-1">
                  {isEditingRole ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        className="text-lg font-medium text-gray-900 dark:text-gray-100 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 w-full lg:w-auto"
                        placeholder="Role name"
                      />
                      <textarea
                        value={newRoleDescription}
                        onChange={(e) => setNewRoleDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
                        rows={3}
                        placeholder="Role description"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                          {selectedRole.role_name}
                        </h3>
                        {selectedRole.is_active === 1 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                            System
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {selectedRole.role_description ||
                          "No description provided"}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Key className="h-4 w-4 mr-1" />
                          {selectedRole.permissions.length} permissions
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
                  {isEditingRole ? (
                    <>
                      <button
                        onClick={saveRole}
                        disabled={isSaving || !newRoleName.trim()}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isSaving}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setCurrentView("permissions")}
                        className="lg:hidden inline-flex items-center justify-center px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 text-sm"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        View Permissions
                      </button>
                      <button
                        onClick={() => startEditRole(selectedRole)}
                        disabled={selectedRole.is_active === 1}
                        className={`inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200 ${
                          selectedRole.is_active === 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRole(selectedRole.role_id)}
                        disabled={selectedRole.is_active === 1}
                        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-error-600 dark:bg-error-500 hover:bg-error-700 dark:hover:bg-error-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 dark:focus:ring-error-400 transition-colors duration-200 ${
                          selectedRole.is_active === 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Permissions View */}
            <div className="hidden lg:block px-4 py-5">
              {renderPermissionsContent()}
            </div>
          </>
        ) : (
          <div className="px-4 py-12 text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              No role selected
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select a role from the list to view details
            </p>
            <div className="mt-6">
              <button
                onClick={startCreateRole}
                className="hidden lg:inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Role
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render permissions content
  const renderPermissionsContent = () => (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 space-y-3 lg:space-y-0">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Permissions ({selectedPermissions.length} selected)
        </h4>
        {isEditingRole && (
          <div className="relative w-full lg:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Filter permissions..."
              value={permissionSearchTerm}
              onChange={(e) => setPermissionSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
            />
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-96 lg:max-h-[500px] overflow-y-auto">
        {Object.entries(groupPermissionsByResource()).map(
          ([resource, permissionIds]) => {
            const resourcePermissions = permissions.filter(
              (p) =>
                p.action === resource &&
                (isEditingRole
                  ? filteredPermissions.some(
                      (fp) => fp.permission_id === p.permission_id
                    )
                  : true)
            );

            if (resourcePermissions.length === 0) return null;

            const allResourceSelected = resourcePermissions.every((p) =>
              selectedPermissions.includes(p.permission_id)
            );

            const isExpanded = expandedResources.has(resource);

            return (
              <div
                key={resource}
                className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-750"
              >
                <div
                  className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-650 transition-colors duration-200"
                  onClick={() => {
                    if (isEditingRole) {
                      toggleResourcePermissions(
                        resourcePermissions.map((p) => p.permission_id)
                      );
                    } else {
                      toggleResourceExpansion(resource);
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {resource.replace("_", " ")}
                    </h5>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {
                        resourcePermissions.filter((p) =>
                          selectedPermissions.includes(p.permission_id)
                        ).length
                      }{" "}
                      / {resourcePermissions.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditingRole && (
                      <div>
                        {allResourceSelected ? (
                          <CheckSquare className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        )}
                      </div>
                    )}
                    {!isEditingRole && (
                      <ChevronRight
                        className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    )}
                  </div>
                </div>

                {(isEditingRole || isExpanded) && (
                  <div className="divide-y divide-gray-200 dark:divide-gray-600">
                    {resourcePermissions.map((permission) => (
                      <div
                        key={permission.permission_id}
                        className={`px-4 py-3 flex justify-between items-center ${
                          isEditingRole
                            ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                            : ""
                        }`}
                        onClick={() =>
                          isEditingRole &&
                          togglePermission(permission.permission_id)
                        }
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900 dark:text-gray-100 flex items-center flex-wrap gap-2 mb-1">
                            <span className="font-medium">
                              {permission.permission_name}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                permission.action === "read"
                                  ? "bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300"
                                  : permission.action === "write"
                                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300"
                                  : permission.action === "delete"
                                  ? "bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300"
                                  : "bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300"
                              }`}
                            >
                              {permission.action}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {permission.permission_description}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {isEditingRole ? (
                            selectedPermissions.includes(
                              permission.permission_id
                            ) ? (
                              <CheckSquare className="h-5 w-5 text-primary-500 dark:text-primary-400" />
                            ) : (
                              <Square className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            )
                          ) : (
                            selectedPermissions.includes(
                              permission.permission_id
                            ) && (
                              <Check className="h-5 w-5 text-success-500 dark:text-success-400" />
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );

  // Render mobile permissions view
  const renderMobilePermissions = () => (
    <div
      className={`${
        currentView === "permissions" ? "block" : "hidden"
      } lg:hidden`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft dark:shadow-glass-dark border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
            Permissions
          </h3>
          {isEditingRole && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Filter permissions..."
                value={permissionSearchTerm}
                onChange={(e) => setPermissionSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
              />
            </div>
          )}
        </div>
        <div className="px-4 py-5">{renderPermissionsContent()}</div>
        {isEditingRole && (
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
            <div className="flex space-x-3">
              <button
                onClick={saveRole}
                disabled={isSaving || !newRoleName.trim()}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={cancelEdit}
                disabled={isSaving}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-6">
      {/* Mobile Header */}
      {renderMobileHeader()}

      {/* Desktop Header */}
      <div className="hidden lg:flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Role Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage roles and their permissions
          </p>
        </div>
        <button
          onClick={startCreateRole}
          className="flex items-center px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </button>
      </div>

      {/* Main Content */}
      <div className="lg:flex lg:space-x-6">
        {/* Roles List */}
        {renderRolesList()}

        {/* Role Details */}
        {renderRoleDetails()}
      </div>

      {/* Mobile Permissions View */}
      {renderMobilePermissions()}

      {/* Loading Overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              Saving changes...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
