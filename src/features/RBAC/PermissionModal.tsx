import { FC, useEffect, useState } from "react";
import { Permission, PermissionGroup } from "../../types";
import { Key } from "lucide-react";

// Modal Component for Create/Edit Permission
interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (permission: Omit<Permission, "permission_id">) => void;
  editingPermission?: Permission | null;
  permissionGroups: PermissionGroup[];
}

export const PermissionModal: FC<PermissionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPermission,
  permissionGroups,
}) => {
  const [formData, setFormData] = useState({
    permission_name: editingPermission?.permission_name || "",
    permission_description: editingPermission?.permission_description || "",
    action: editingPermission?.action || "",
    route: editingPermission?.route || "",
    // resource: editingPermission?.resource || "",
    permission_group_id: editingPermission?.permission_group_id || null,
    status: editingPermission?.status || (1 as 0 | 1),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const actionOptions = [
    { value: "read", label: "Read", color: "bg-green-100 text-green-800" },
    { value: "write", label: "Write", color: "bg-blue-100 text-blue-800" },
    { value: "delete", label: "Delete", color: "bg-red-100 text-red-800" },
    {
      value: "update",
      label: "Update",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "create",
      label: "Create",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "manage",
      label: "Manage",
      color: "bg-indigo-100 text-indigo-800",
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.permission_name.trim()) {
      newErrors.permission_name = "Permission name is required";
    } else if (formData.permission_name.trim().length < 3) {
      newErrors.permission_name =
        "Permission name must be at least 3 characters";
    }

    if (!formData.permission_description.trim()) {
      newErrors.permission_description = "Description is required";
    } else if (formData.permission_description.trim().length < 10) {
      newErrors.permission_description =
        "Description must be at least 10 characters";
    }

    if (!formData.action.trim()) {
      newErrors.action = "Action is required";
    }

    if (!formData.route.trim()) {
      newErrors.route = "Route is required";
    }

    // if (!formData.resource.trim()) {
    //   newErrors.resource = "Resource is required";
    // } else if (formData.resource.trim().length < 2) {
    //   newErrors.resource = "Resource must be at least 2 characters";
    // }

    if (!formData.permission_group_id) {
      newErrors.permission_group_id = "Permission group is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        permission_name: formData.permission_name.trim(),
        permission_description: formData.permission_description.trim(),
        action: formData.action,
        // resource: formData.resource.trim(),
        permission_group_id: formData.permission_group_id,
        status: formData.status,
        route: formData.route,
        permission_group: "",
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      permission_name: "",
      permission_description: "",
      action: "",
      route: "",
      //   resource: "",
      permission_group_id: "",
      status: 1,
    });
    setErrors({});
    onClose();
  };

  useEffect(() => {
    if (editingPermission) {
      setFormData({
        permission_name: editingPermission.permission_name,
        permission_description: editingPermission.permission_description,
        action: editingPermission.action,
        route: editingPermission.route,
        // resource: editingPermission.resource,
        permission_group_id: editingPermission.permission_group_id,
        status: editingPermission.status || 1,
      });
    }
  }, [editingPermission]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center mb-4">
              <Key className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                {editingPermission ? "Edit Permission" : "Create Permission"}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permission Name *
                </label>
                <input
                  type="text"
                  value={formData.permission_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permission_name: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.permission_name
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter permission name"
                />
                {errors.permission_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.permission_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action *
                </label>
                <select
                  value={formData.action}
                  onChange={(e) =>
                    setFormData({ ...formData, action: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.action ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select action</option>
                  {actionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.action && (
                  <p className="mt-1 text-sm text-red-600">{errors.action}</p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource *
                </label>
                <input
                  type="text"
                  value={formData.resource}
                  onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.resource ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., users, orders, products"
                />
                {errors.resource && (
                  <p className="mt-1 text-sm text-red-600">{errors.resource}</p>
                )}
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permission Group *
                </label>
                <select
                  value={formData.permission_group_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permission_group_id: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.permission_group_id
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select permission group</option>
                  {permissionGroups
                    .filter((group) => group.status === 1)
                    .map((group) => (
                      <option key={group.group_id} value={group.group_id}>
                        {group.group_name}
                      </option>
                    ))}
                </select>
                {errors.permission_group_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.permission_group_id}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Route*
                </label>
                <input
                  type="text"
                  value={formData.route}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      route: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.route ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter permission name"
                />
                {errors.route && (
                  <p className="mt-1 text-sm text-red-600">{errors.route}</p>
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

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.permission_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permission_description: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.permission_description
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter permission description"
                />
                {errors.permission_description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.permission_description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {editingPermission ? "Update Permission" : "Create Permission"}
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
