import React, { FC, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { PermissionGroup } from "../../types";
import { useAppSelector } from "../../hooks";
import { selectPermissionGroups } from "../../store/slices/rbac-slice";

interface PermissionGroupsManagementProps {
  onCreateGroup: (group: Omit<PermissionGroup, "group_id">) => void;
  onUpdateGroup: (groupId: string, updates: Partial<PermissionGroup>) => void;
  onDeleteGroup: (groupId: string) => void;
  onToggleStatus: (groupId: string, status: 0 | 1) => void;
}

// Modal Component for Create/Edit
interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: Omit<PermissionGroup, "group_id">) => void;
  editingGroup?: PermissionGroup | null;
}

const GroupModal: FC<GroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingGroup,
}) => {
  const [formData, setFormData] = useState({
    group_name: editingGroup?.group_name || "",
    group_description: editingGroup?.group_description || "",
    status: editingGroup?.status || (1 as 0 | 1),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.group_name.trim()) {
      newErrors.group_name = "Group name is required";
    } else if (formData.group_name.trim().length < 2) {
      newErrors.group_name = "Group name must be at least 2 characters";
    }

    if (!formData.group_description.trim()) {
      newErrors.group_description = "Description is required";
    } else if (formData.group_description.trim().length < 10) {
      newErrors.group_description =
        "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        group_name: formData.group_name.trim(),
        group_description: formData.group_description.trim(),
        status: formData.status,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      group_name: "",
      group_description: "",
      status: 1,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                {editingGroup
                  ? "Edit Permission Group"
                  : "Create Permission Group"}
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={formData.group_name}
                  onChange={(e) =>
                    setFormData({ ...formData, group_name: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.group_name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter group name"
                />
                {errors.group_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.group_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.group_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      group_description: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.group_description
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter group description"
                />
                {errors.group_description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.group_description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: parseInt(e.target.value) as 0 | 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {editingGroup ? "Update Group" : "Create Group"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export const PermissionGroupsManagement: FC<
  PermissionGroupsManagementProps
> = ({ onCreateGroup, onUpdateGroup, onDeleteGroup, onToggleStatus }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<PermissionGroup | null>(
    null
  );
  const permissionGroups = useAppSelector(selectPermissionGroups) || [];
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Filter groups by search term and status
  const filteredGroups = permissionGroups.filter((group) => {
    const matchesSearch =
      group.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.group_description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && group.status === 1) ||
      (statusFilter === "inactive" && group.status === 0);

    return matchesSearch && matchesStatus;
  });

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleEditGroup = (group: PermissionGroup) => {
    setEditingGroup(group);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleSaveGroup = (groupData: Omit<PermissionGroup, "group_id">) => {
    if (editingGroup) {
      onUpdateGroup(editingGroup.group_id, groupData);
    } else {
      onCreateGroup(groupData);
    }
  };

  const handleDeleteClick = (groupId: string) => {
    setShowDeleteConfirm(groupId);
    setActiveDropdown(null);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      onDeleteGroup(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleToggleStatus = (groupId: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    onToggleStatus(groupId, newStatus);
    setActiveDropdown(null);
  };

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  };

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Permission Groups
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage permission groups and their configurations
          </p>
        </div>
        <button
          onClick={handleCreateGroup}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Groups
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {permissionGroups.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Groups
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {permissionGroups.filter((g) => g.status === 1).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Inactive Groups
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {permissionGroups.filter((g) => g.status === 0).length}
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
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "active" | "inactive")
          }
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Groups List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredGroups.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No groups found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "Get started by creating a new permission group."}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={handleCreateGroup}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </button>
              </div>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredGroups.map((group) => (
              <li key={group.group_id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {group.group_name}
                          </p>
                          {getStatusBadge(group.status)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {group.group_description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === group.group_id
                            ? null
                            : group.group_id
                        )
                      }
                      className="inline-flex items-center p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {activeDropdown === group.group_id && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleEditGroup(group)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Edit className="h-4 w-4 mr-3" />
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(group.group_id, group.status)
                            }
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            {group.status === 1 ? (
                              <>
                                <XCircle className="h-4 w-4 mr-3" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-3" />
                                Activate
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(group.group_id)}
                            className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
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
            ))}
          </ul>
        )}
      </div>

      {/* Create/Edit Modal */}
      <GroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGroup}
        editingGroup={editingGroup}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Permission Group
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this permission group?
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
