import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import {
  Role,
  Permission,
  PermissionGroup,
  FormattedRoleWithPermissions,
  MappedUserRole,
} from "../../types";

// State interface
interface RBACState {
  // Core entities
  roles: Role[];
  permissions: Permission[];
  permissionGroups: PermissionGroup[];
  mappedUserRoles: MappedUserRole[];

  // Combined/computed data
  rolesWithPermissions: FormattedRoleWithPermissions[];

  // Loading states
  loading: {
    roles: boolean;
    permissions: boolean;
    permissionGroups: boolean;
    mappedUserRoles: boolean;
    rolesWithPermissions: boolean;
  };

  // Error states
  errors: {
    roles: string | null;
    permissions: string | null;
    permissionGroups: string | null;
    mappedUserRoles: string | null;
    rolesWithPermissions: string | null;
  };

  // UI state
  selectedPermissions: string[];
  activeTab: "roles" | "permissions" | "permission_groups" | "users";
}

// Initial state
const initialState: RBACState = {
  roles: [],
  permissions: [],
  permissionGroups: [],
  mappedUserRoles: [],
  rolesWithPermissions: [],
  loading: {
    roles: false,
    permissions: false,
    permissionGroups: false,
    mappedUserRoles: false,
    rolesWithPermissions: false,
  },
  errors: {
    roles: null,
    permissions: null,
    permissionGroups: null,
    mappedUserRoles: null,
    rolesWithPermissions: null,
  },
  selectedPermissions: [],
  activeTab: "roles",
};

// Helper function to combine roles with their permissions
const combineRolesWithPermissions = (
  roles: Role[],
  rolesWithPermissions: FormattedRoleWithPermissions[]
): FormattedRoleWithPermissions[] => {
  const rolePermissionMap = new Map(
    rolesWithPermissions.map((role) => [role.role_id, role])
  );

  return roles.map((role) => {
    const existingRoleWithPermissions = rolePermissionMap.get(role.role_id);

    if (existingRoleWithPermissions) {
      // Role has permissions mapped
      return existingRoleWithPermissions;
    } else {
      // Role has no permissions mapped, create entry with empty permissions
      return {
        role_id: role.role_id,
        role_name: role.role_name,
        role_description: role.role_description,
        is_active: role.status,
        permissions: [],
      };
    }
  });
};

const rbacSlice = createSlice({
  name: "rbac",
  initialState,
  reducers: {
    // Loading actions
    setRolesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.roles = action.payload;
    },
    setPermissionsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.permissions = action.payload;
    },
    setPermissionGroupsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.permissionGroups = action.payload;
    },
    setMappedUserRolesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.mappedUserRoles = action.payload;
    },
    setRolesWithPermissionsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.rolesWithPermissions = action.payload;
    },

    // Error actions
    setRolesError: (state, action: PayloadAction<string | null>) => {
      state.errors.roles = action.payload;
    },
    setPermissionsError: (state, action: PayloadAction<string | null>) => {
      state.errors.permissions = action.payload;
    },
    setPermissionGroupsError: (state, action: PayloadAction<string | null>) => {
      state.errors.permissionGroups = action.payload;
    },
    setMappedUserRolesError: (state, action: PayloadAction<string | null>) => {
      state.errors.mappedUserRoles = action.payload;
    },
    setRolesWithPermissionsError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.errors.rolesWithPermissions = action.payload;
    },

    // Data actions
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
      state.loading.roles = false;
      state.errors.roles = null;

      // Recombine roles with permissions when roles change
      state.rolesWithPermissions = combineRolesWithPermissions(
        action.payload,
        state.rolesWithPermissions
      );
    },

    setPermissions: (state, action: PayloadAction<Permission[]>) => {
      state.permissions = action.payload;
      state.loading.permissions = false;
      state.errors.permissions = null;
    },

    setPermissionGroups: (state, action: PayloadAction<PermissionGroup[]>) => {
      state.permissionGroups = action.payload;
      state.loading.permissionGroups = false;
      state.errors.permissionGroups = null;
    },

    setMappedUserRoles: (state, action: PayloadAction<MappedUserRole[]>) => {
      state.mappedUserRoles = action.payload;
      state.loading.mappedUserRoles = false;
      state.errors.mappedUserRoles = null;
    },

    setRolesWithPermissions: (
      state,
      action: PayloadAction<FormattedRoleWithPermissions[]>
    ) => {
      const mappedRoles = action.payload;
      state.loading.rolesWithPermissions = false;
      state.errors.rolesWithPermissions = null;

      // Combine with existing roles to include roles without permissions
      state.rolesWithPermissions = combineRolesWithPermissions(
        state.roles,
        mappedRoles
      );
    },

    // CRUD operations
    addRole: (state, action: PayloadAction<Role>) => {
      state.roles.push(action.payload);

      // Add to rolesWithPermissions with empty permissions
      state.rolesWithPermissions.push({
        role_id: action.payload.role_id,
        role_name: action.payload.role_name,
        role_description: action.payload.role_description,
        is_active: action.payload.status,
        permissions: [],
      });
    },

    updateRole: (
      state,
      action: PayloadAction<{ roleId: string; updates: Partial<Role> }>
    ) => {
      const { roleId, updates } = action.payload;

      // Update in roles array
      const roleIndex = state.roles.findIndex(
        (role) => role.role_id === roleId
      );
      if (roleIndex !== -1) {
        state.roles[roleIndex] = { ...state.roles[roleIndex], ...updates };
      }

      // Update in rolesWithPermissions array
      const roleWithPermIndex = state.rolesWithPermissions.findIndex(
        (role) => role.role_id === roleId
      );
      if (roleWithPermIndex !== -1) {
        const existingRole = state.rolesWithPermissions[roleWithPermIndex];
        state.rolesWithPermissions[roleWithPermIndex] = {
          ...existingRole,
          role_name: updates.role_name || existingRole.role_name,
          role_description:
            updates.role_description || existingRole.role_description,
          is_active:
            updates.status !== undefined
              ? updates.status
              : existingRole.is_active,
        };
      }
    },
    updateRoleWithPermissions: (
      state,
      action: PayloadAction<FormattedRoleWithPermissions[]>
    ) => {
      action.payload.forEach((incomingRole) => {
        const index = state.rolesWithPermissions.findIndex(
          (r) => r.role_id === incomingRole.role_id
        );

        if (index !== -1) {
          // Update existing
          state.rolesWithPermissions[index] = incomingRole;
        } else {
          // Add new if not found
          state.rolesWithPermissions.push(incomingRole);
        }
      });
    },

    deleteRole: (state, action: PayloadAction<string>) => {
      const roleId = action.payload;
      state.roles = state.roles.filter((role) => role.role_id !== roleId);
      state.rolesWithPermissions = state.rolesWithPermissions.filter(
        (role) => role.role_id !== roleId
      );
    },

    addPermission: (state, action: PayloadAction<Permission>) => {
      state.permissions.push(action.payload);
    },

    updatePermission: (
      state,
      action: PayloadAction<{
        permissionId: string;
        updates: Partial<Permission>;
      }>
    ) => {
      const { permissionId, updates } = action.payload;
      const permissionIndex = state.permissions.findIndex(
        (perm) => perm.permission_id === permissionId
      );
      if (permissionIndex !== -1) {
        state.permissions[permissionIndex] = {
          ...state.permissions[permissionIndex],
          ...updates,
        };
      }
    },
    updateMappedUserRoles: (state, action: PayloadAction<MappedUserRole[]>) => {
      const updated = action.payload[0];
      const index = state.mappedUserRoles.findIndex(
        (item) => item.user.user_id === updated.user.user_id
      );

      if (index !== -1) {
        state.mappedUserRoles[index].roles = updated.roles;
      }
    },
    deletePermission: (state, action: PayloadAction<string>) => {
      const permissionId = action.payload;
      state.permissions = state.permissions.filter(
        (perm) => perm.permission_id !== permissionId
      );

      // Remove permission from all roles
      state.rolesWithPermissions.forEach((role) => {
        role.permissions = role.permissions.filter(
          (perm) => perm.permission_id !== permissionId
        );
      });
    },

    addPermissionGroup: (state, action: PayloadAction<PermissionGroup>) => {
      state.permissionGroups.push(action.payload);
    },

    updatePermissionGroup: (
      state,
      action: PayloadAction<{
        groupId: string;
        updates: Partial<PermissionGroup>;
      }>
    ) => {
      const { groupId, updates } = action.payload;
      const groupIndex = state.permissionGroups.findIndex(
        (group) => group.group_id === groupId
      );
      if (groupIndex !== -1) {
        state.permissionGroups[groupIndex] = {
          ...state.permissionGroups[groupIndex],
          ...updates,
        };
      }
    },

    deletePermissionGroup: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      state.permissionGroups = state.permissionGroups.filter(
        (group) => group.group_id !== groupId
      );
    },

    // Role-Permission mapping
    assignPermissionToRole: (
      state,
      action: PayloadAction<{ roleId: string; permission: Permission }>
    ) => {
      const { roleId, permission } = action.payload;
      const roleIndex = state.rolesWithPermissions.findIndex(
        (role) => role.role_id === roleId
      );

      if (roleIndex !== -1) {
        const formattedPermission = {
          permission_id: permission.permission_id,
          permission_name: permission.permission_name,
          route: permission.route,
          action: permission.action,
          is_active: permission.status,
        };

        // Check if permission is already assigned
        const existingPermIndex = state.rolesWithPermissions[
          roleIndex
        ].permissions.findIndex(
          (p) => p.permission_id === permission.permission_id
        );

        if (existingPermIndex === -1) {
          state.rolesWithPermissions[roleIndex].permissions.push(
            formattedPermission
          );
        }
      }
    },

    removePermissionFromRole: (
      state,
      action: PayloadAction<{ roleId: string; permissionId: string }>
    ) => {
      const { roleId, permissionId } = action.payload;
      const roleIndex = state.rolesWithPermissions.findIndex(
        (role) => role.role_id === roleId
      );

      if (roleIndex !== -1) {
        state.rolesWithPermissions[roleIndex].permissions =
          state.rolesWithPermissions[roleIndex].permissions.filter(
            (perm) => perm.permission_id !== permissionId
          );
      }
    },

    // UI state
    setSelectedPermissions: (state, action: PayloadAction<string[]>) => {
      state.selectedPermissions = action.payload;
    },

    setActiveTab: (
      state,
      action: PayloadAction<
        "roles" | "permissions" | "permission_groups" | "users"
      >
    ) => {
      state.activeTab = action.payload;
    },

    // Clear all data (useful for logout)
    clearRBACData: (state) => {
      return initialState;
    },
  },
});

// Selectors
export const selectRBACState = (state: { rbac: RBACState }) => state.rbac;

export const selectRoles = createSelector(
  [selectRBACState],
  (rbac) => rbac.roles
);

export const selectPermissions = createSelector(
  [selectRBACState],
  (rbac) => rbac.permissions
);

export const selectPermissionGroups = createSelector(
  [selectRBACState],
  (rbac) => rbac.permissionGroups
);

export const selectRolesWithPermissions = createSelector(
  [selectRBACState],
  (rbac) => rbac.rolesWithPermissions
);

export const selectMappedUserRoles = createSelector(
  [selectRBACState],
  (rbac) => rbac.mappedUserRoles
);

export const selectLoadingStates = createSelector(
  [selectRBACState],
  (rbac) => rbac.loading
);

export const selectErrorStates = createSelector(
  [selectRBACState],
  (rbac) => rbac.errors
);

export const selectIsAnyLoading = createSelector(
  [selectLoadingStates],
  (loading) => Object.values(loading).some(Boolean)
);

export const selectRoleById = createSelector(
  [selectRoles, (_, roleId: string) => roleId],
  (roles, roleId) => roles.find((role) => role.role_id === roleId)
);

export const selectPermissionById = createSelector(
  [selectPermissions, (_, permissionId: string) => permissionId],
  (permissions, permissionId) =>
    permissions.find((perm) => perm.permission_id === permissionId)
);

export const selectPermissionsByGroup = createSelector(
  [selectPermissions],
  (permissions) => {
    return permissions.reduce((groups, permission) => {
      const groupId = permission.permission_group_id || "ungrouped";
      if (!groups[groupId]) {
        groups[groupId] = [];
      }
      groups[groupId].push(permission);
      return groups;
    }, {} as Record<string, Permission[]>);
  }
);

export const selectRoleWithPermissionsById = createSelector(
  [selectRolesWithPermissions, (_, roleId: string) => roleId],
  (rolesWithPermissions, roleId) =>
    rolesWithPermissions.find((role) => role.role_id === roleId)
);

// Export actions
export const {
  // Loading actions
  setRolesLoading,
  setPermissionsLoading,
  setPermissionGroupsLoading,
  setMappedUserRolesLoading,
  setRolesWithPermissionsLoading,

  // Error actions
  setRolesError,
  setPermissionsError,
  setPermissionGroupsError,
  setMappedUserRolesError,
  setRolesWithPermissionsError,

  // Data actions
  setRoles,
  setPermissions,
  setPermissionGroups,
  setMappedUserRoles,
  setRolesWithPermissions,

  // CRUD actions
  addRole,
  updateRole,
  deleteRole,
  addPermission,
  updatePermission,
  deletePermission,
  addPermissionGroup,
  updatePermissionGroup,
  updateMappedUserRoles,
  updateRoleWithPermissions,
  deletePermissionGroup,

  // Role-Permission mapping
  assignPermissionToRole,
  removePermissionFromRole,

  // UI actions
  setSelectedPermissions,
  setActiveTab,
  clearRBACData,
} = rbacSlice.actions;

export const rbacReducer = rbacSlice.reducer;
