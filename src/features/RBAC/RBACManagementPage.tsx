import { Layers, User } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Lock, Shield } from "lucide-react";
import { CreateRoleModal } from "./CreateRoleModal";
import { UsersManagement } from "./Users";
import {
  useCreatePermissionGroupMutation,
  useCreatePermissionMutation,
  useGetMappedUsersRolesQuery,
  useGetPermissionGroupsQuery,
  useGetPermissionsQuery,
  useGetRolesQuery,
  useGetRolesWithPermissionsQuery,
} from "../../store/apis/public-api";
import {
  CreatePermissionGroup,
  FormattedRoleWithPermissions,
  MappedUserRole,
  Permission,
  PermissionGroup,
  Role,
} from "../../types";
import RBACLoadingSkeleton from "./RbacLoadingSkeleton";
import { RoleManagement } from "./Roles";
import { PermissionManagement } from "./Permission";
import { PermissionGroupsManagement } from "./PermissionGroupManagement";
import { useAppDispatch } from "../../hooks";
import {
  addPermission,
  addPermissionGroup,
  deletePermissionGroup,
  setMappedUserRoles,
  setMappedUserRolesError,
  setMappedUserRolesLoading,
  setPermissionGroups,
  setPermissionGroupsError,
  setPermissionGroupsLoading,
  setPermissions,
  setPermissionsError,
  setPermissionsLoading,
  setRoles,
  setRolesError,
  setRolesLoading,
  setRolesWithPermissions,
  setRolesWithPermissionsError,
  setRolesWithPermissionsLoading,
  updatePermissionGroup,
} from "../../store/slices/rbac-slice";

// Component for Role-Based Access Control
const RBACManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [newRoleName, setNewRoleName] = useState<string>("");
  const [newRoleDescription, setNewRoleDescription] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // State for UI elements
  const [activeTab, setActiveTab] = useState<
    "roles" | "permissions" | "permission_groups" | "users"
  >("roles");
  const [showAddRoleModal, setShowAddRoleModal] = useState<boolean>(false);
  const {
    data: fetchedRoles,
    isLoading: rolesLoading,
    error: rolesError,
  } = useGetRolesQuery();

  const {
    data: fetchedPermissions,
    isLoading: permissionIsLoading,
    error: permissionsError,
  } = useGetPermissionsQuery(undefined);

  const {
    data: fetchedMappedUsers,
    isLoading: usersLoading,
    error: usersError,
  } = useGetMappedUsersRolesQuery();

  const {
    data: fetchedMappedPermissions,
    isLoading: mappedPermissionsLoading,
    error: mappedPermissionsError,
  } = useGetRolesWithPermissionsQuery();

  const {
    data: fetchedPermissionGroups,
    isLoading: permissionsGroupLoading,
    error: permissionGroupsError,
  } = useGetPermissionGroupsQuery();

  const [createPermission, { isLoading: isCreatingPermissionLoading }] =
    useCreatePermissionMutation();

  const [
    createPermissionGroup,
    { isLoading: isCreatingPermissionGroupLoading },
  ] = useCreatePermissionGroupMutation();

  // Load mock data
  // Update loading states
  useEffect(() => {
    dispatch(setRolesLoading(rolesLoading));
  }, [rolesLoading, dispatch]);

  useEffect(() => {
    dispatch(setPermissionsLoading(permissionIsLoading));
  }, [permissionIsLoading, dispatch]);

  useEffect(() => {
    dispatch(setPermissionGroupsLoading(permissionsGroupLoading));
  }, [permissionsGroupLoading, dispatch]);

  useEffect(() => {
    dispatch(setRolesWithPermissionsLoading(mappedPermissionsLoading));
  }, [mappedPermissionsLoading, dispatch]);

  useEffect(() => {
    dispatch(setMappedUserRolesLoading(usersLoading));
  }, [usersLoading, dispatch]);

  // Update error states
  useEffect(() => {
    if (rolesError) {
      dispatch(setRolesError(rolesError.toString()));
    }
  }, [rolesError, dispatch]);

  useEffect(() => {
    if (permissionsError) {
      dispatch(setPermissionsError(permissionsError.toString()));
    }
  }, [permissionsError, dispatch]);

  useEffect(() => {
    if (permissionGroupsError) {
      dispatch(setPermissionGroupsError(permissionGroupsError.toString()));
    }
  }, [permissionGroupsError, dispatch]);

  useEffect(() => {
    if (mappedPermissionsError) {
      dispatch(setRolesWithPermissionsError(mappedPermissionsError.toString()));
    }
  }, [mappedPermissionsError, dispatch]);

  useEffect(() => {
    if (usersError) {
      dispatch(setMappedUserRolesError(usersError.toString()));
    }
  }, [usersError, dispatch]);

  // Load data into Redux store
  useEffect(() => {
    if (fetchedRoles?.details && fetchedRoles.details.length > 0) {
      dispatch(setRoles(fetchedRoles.details));
    }
  }, [fetchedRoles, dispatch]);

  useEffect(() => {
    if (
      fetchedPermissions?.details &&
      fetchedPermissions?.details?.length > 0
    ) {
      dispatch(setPermissions(fetchedPermissions.details));
    }
  }, [fetchedPermissions, dispatch]);

  useEffect(() => {
    if (fetchedMappedPermissions && fetchedMappedPermissions?.length > 0) {
      dispatch(setRolesWithPermissions(fetchedMappedPermissions));
    }
  }, [fetchedMappedPermissions, dispatch]);

  useEffect(() => {
    if (
      fetchedPermissionGroups?.details &&
      fetchedPermissionGroups?.details?.length > 0
    ) {
      dispatch(setPermissionGroups(fetchedPermissionGroups.details));
    }
  }, [fetchedPermissionGroups, dispatch]);

  useEffect(() => {
    if (
      fetchedMappedUsers?.details &&
      fetchedMappedUsers?.details?.length > 0
    ) {
      dispatch(setMappedUserRoles(fetchedMappedUsers.details));
    }
  }, [fetchedMappedUsers, dispatch]);
  // Start creating a new role
  const startCreateRole = () => {
    setNewRoleName("");
    setNewRoleDescription("");
    setSelectedPermissions([]);
    setShowAddRoleModal(true);
  };
  const handleCreateGroup = async (
    group: Omit<PermissionGroup, "group_id">
  ) => {
    const newGroup: CreatePermissionGroup = {
      permission_group_name: group.group_name,
      permission_group_description: group.group_description,
    };
    try {
      const response = await createPermissionGroup(newGroup).unwrap();
      if (response.details) {
        dispatch(addPermissionGroup(response.details));
      }
    } catch (error) {
      console.error("Error creating permission group:", error);
    }
  };
  const handleCreatePermission = async (
    perm: Omit<Permission, "permission_id">
  ) => {
    try {
      const response = await createPermission(perm).unwrap();
      if (response.details) {
        dispatch(addPermission(response.details));
      }
    } catch (error) {
      console.error("Error creating permission group:", error);
    }
  };

  const handleUpdateGroup = (
    groupId: string,
    updates: Partial<PermissionGroup>
  ) => {
    dispatch(updatePermissionGroup({ groupId, updates }));
  };

  const handleDeleteGroup = (groupId: string) => {
    dispatch(deletePermissionGroup(groupId));
  };

  const handleToggleStatus = (groupId: string, status: 0 | 1) => {
    dispatch(updatePermissionGroup({ groupId, updates: { status } }));
  };
  const isLoading =
    rolesLoading ||
    permissionIsLoading ||
    usersLoading ||
    mappedPermissionsLoading;
  if (isLoading) {
    return <RBACLoadingSkeleton />;
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
          Role-Based Access Control
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Manage roles, permissions, and user access to system resources.
        </p>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("roles")}
              className={`${
                activeTab === "roles"
                  ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-300`}
            >
              <Shield className="mr-2" />
              Roles
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`${
                activeTab === "permissions"
                  ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-300`}
            >
              <Lock className="mr-2" />
              Permissions
            </button>
            <button
              onClick={() => setActiveTab("permission_groups")}
              className={`${
                activeTab === "permission_groups"
                  ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-300`}
            >
              <Layers className="mr-2" />
              Permission Groups
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`${
                activeTab === "users"
                  ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-300`}
            >
              <User className="mr-2" />
              Users
            </button>
          </nav>
        </div>

        {/* Roles Tab */}
        {/* Roles Tab */}
        {activeTab === "roles" && (
          <RoleManagement
            setShowAddRoleModal={setShowAddRoleModal}
            setRolesWithPermissions={setRolesWithPermissions}
            startCreateRole={startCreateRole}
            selectedPermissions={selectedPermissions}
            setSelectedPermissions={setSelectedPermissions}
          />
        )}

        {/* Permissions Tab */}
        {activeTab === "permissions" && (
          <PermissionManagement
            onCreatePermission={handleCreatePermission}
            onDeletePermission={() => {}}
            onUpdatePermission={() => {}}
          />
        )}
        {/* Permissions groups Tab */}
        {activeTab === "permission_groups" && (
          <PermissionGroupsManagement
            onCreateGroup={handleCreateGroup}
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={handleDeleteGroup}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {/* Users Tab */}
        {activeTab === "users" && <UsersManagement />}

        {/* Add Role Modal */}
        {showAddRoleModal && (
          <CreateRoleModal setShowAddRoleModal={setShowAddRoleModal} />
        )}
      </div>
    </div>
  );
};

export default RBACManagementPage;
