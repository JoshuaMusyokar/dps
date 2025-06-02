// Hook for keeping user permissions in sync when their roles change in RBAC
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMappedUserRoles,
  selectRolesWithPermissions,
} from "../store/slices/rbac-slice";
import {
  selectUser,
  updateUserPermissions,
  updateUserRoles,
} from "../store/slices/auth-slice";
import { PermissionOnAuth, Role } from "../types";

export const useSyncUserPermissions = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const mappedUserRoles = useSelector(selectMappedUserRoles);
  const rolesWithPermissions = useSelector(selectRolesWithPermissions);

  const updateUserPermissionsFromRoles = useCallback(() => {
    if (!currentUser) return;

    // Find current user's mapped roles
    const userMapping = mappedUserRoles.find(
      (mapping) => mapping.user.user_id === currentUser.user_id
    );

    if (!userMapping) return;

    // Get user's role IDs
    const userRoleIds = userMapping.roles.map((role) => role.role_id);

    // Get permissions for user's roles
    const userPermissions: PermissionOnAuth[] = [];
    const userRoles: Role[] = [];
    console.log("roles with perm😍😎😎😋😋:", rolesWithPermissions);

    rolesWithPermissions.forEach((roleWithPerms) => {
      if (userRoleIds.includes(roleWithPerms.role_id)) {
        // Add role to user's roles
        userRoles.push({
          role_id: roleWithPerms.role_id,
          role_name: roleWithPerms.role_name,
          role_description: roleWithPerms.role_description,
          status: roleWithPerms.is_active ? 1 : 0,
        });

        // Add permissions from this role
        roleWithPerms.permissions.forEach((perm) => {
          // Avoid duplicates
          if (
            !userPermissions.find(
              (up) => up.permission_id === perm.permission_id
            )
          ) {
            userPermissions.push({
              permission_id: perm.permission_id,
              permission_name: perm.permission_name,
              route: perm.route,
              action: perm.action,
            });
          }
        });
      }
    });

    // Update auth state
    dispatch(updateUserPermissions(userPermissions));
    dispatch(updateUserRoles(userRoles));
  }, [currentUser, mappedUserRoles, rolesWithPermissions, dispatch]);

  useEffect(() => {
    updateUserPermissionsFromRoles();
  }, [updateUserPermissionsFromRoles]);

  return { updateUserPermissionsFromRoles };
};
