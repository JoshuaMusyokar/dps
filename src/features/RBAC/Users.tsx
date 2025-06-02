import { FC, useState } from "react";
import { MappedUserRole, Role } from "../../types";
import { Search, Users, Edit, Check, X, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  selectMappedUserRoles,
  selectRoles,
  selectRolesWithPermissions,
  updateMappedUserRoles,
} from "../../store/slices/rbac-slice";
import { useCreateRoleToUserMapMutation } from "../../store/apis/public-api";

export const UsersManagement = () => {
  const mappedUsersRoles = useAppSelector(selectMappedUserRoles);
  const roles = useAppSelector(selectRolesWithPermissions);
  const [createRoleToUserMap, { isLoading: isAssigning }] =
    useCreateRoleToUserMapMutation();
  const dispatch = useAppDispatch();

  const [userSearchTerm, setUserSearchTerm] = useState<string>("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<MappedUserRole | null>(null);

  // Filter users by search term
  const filteredMapperRolesByUser = mappedUsersRoles.filter(
    (mappedUserRole) =>
      mappedUserRole.user.first_name
        .toLowerCase()
        .includes(userSearchTerm.toLowerCase()) ||
      mappedUserRole.user.last_name
        .toLowerCase()
        .includes(userSearchTerm.toLowerCase()) ||
      mappedUserRole.user.phone
        .toLowerCase()
        .includes(userSearchTerm.toLowerCase()) ||
      mappedUserRole.user.email
        .toLowerCase()
        .includes(userSearchTerm.toLowerCase())
  );

  // Get badge class for user status
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "pending":
        return "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Handle role assignment
  const handleAssignRoles = async (userId: string, roleIds: string[]) => {
    try {
      const response = await createRoleToUserMap({
        userId,
        roles: { role_ids: roleIds },
      }).unwrap();
      if (!response.details) return;
      dispatch(updateMappedUserRoles(response.details));
      setEditingUserId(null);
      setSelectedRoles([]);
      setShowRoleModal(false);
      setCurrentUser(null);
    } catch (error) {
      console.error("Failed to assign roles:", error);
    }
  };

  // Open role assignment modal
  const openRoleModal = (user: MappedUserRole) => {
    setCurrentUser(user);
    setSelectedRoles(user.roles.map((role) => role.role_id || ""));
    setShowRoleModal(true);
  };

  // Toggle role selection
  const toggleRoleSelection = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  // Get available roles (not currently assigned)
  const getAvailableRoles = (userRoles: any[]) => {
    const assignedRoleIds = userRoles.map((role) => role.role_id);
    return roles.filter(
      (role) => !assignedRoleIds.includes(role.role_id) && role.is_active === 1
    );
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          System Users
        </h2>
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400
                     placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredMapperRolesByUser.length === 0 ? (
            <li className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
              No users found matching your search.
            </li>
          ) : (
            filteredMapperRolesByUser.map((mapped) => (
              <li
                key={mapped.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/20 
                                    flex items-center justify-center ring-2 ring-primary-200 dark:ring-primary-700"
                      >
                        <span className="text-primary-700 dark:text-primary-300 text-lg font-medium">
                          {mapped.user.first_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {mapped.user.first_name} {mapped.user.last_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {mapped.user.email}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {mapped.user.phone}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex items-center gap-2">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusBadgeClass(
                          "active" // You might want to add a status field to your user object
                        )}`}
                      >
                        Active
                      </span>
                      <button
                        onClick={() => openRoleModal(mapped)}
                        className="p-1 text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 
                                 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Manage user roles"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center">
                      <Users className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <div className="flex flex-wrap gap-1">
                        {mapped.roles.length > 0 ? (
                          mapped.roles.map((role, index) => (
                            <span
                              key={role.role_id || index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium 
                                       bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300
                                       border border-primary-200 dark:border-primary-700"
                            >
                              {role.role_name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                            No roles assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Role Assignment Modal */}
      {showRoleModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Manage Roles for {currentUser.user.first_name}{" "}
                  {currentUser.user.last_name}
                </h3>
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setCurrentUser(null);
                    setSelectedRoles([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Current Roles
                  </h4>
                  <div className="space-y-2">
                    {currentUser.roles.map((role, index) => (
                      <div
                        key={role.role_id || index}
                        className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/10 
                                 rounded-lg border border-primary-200 dark:border-primary-700"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {role.role_name}
                          </div>
                          {role.role_description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {role.role_description}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            toggleRoleSelection(role.role_id || "")
                          }
                          className="text-error-600 hover:text-error-800 dark:text-error-400 dark:hover:text-error-300 
                                   text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {currentUser.roles.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No roles currently assigned
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Available Roles
                  </h4>
                  <div className="space-y-2">
                    {getAvailableRoles(currentUser.roles).map((role) => (
                      <div
                        key={role.role_id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 
                                 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {role.role_name}
                          </div>
                          {role.role_description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {role.role_description}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => toggleRoleSelection(role.role_id)}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            selectedRoles.includes(role.role_id)
                              ? "bg-primary-600 text-white hover:bg-primary-700"
                              : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                          }`}
                        >
                          {selectedRoles.includes(role.role_id) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                    {getAvailableRoles(currentUser.roles).length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No additional roles available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setCurrentUser(null);
                  setSelectedRoles([]);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                         bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                         rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleAssignRoles(
                    currentUser.user.user_id || "",
                    selectedRoles
                  )
                }
                disabled={isAssigning}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 
                         disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors
                         flex items-center gap-2"
              >
                {isAssigning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Update Roles
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
