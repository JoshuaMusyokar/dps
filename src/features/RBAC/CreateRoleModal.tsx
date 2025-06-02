import { Shield } from "lucide-react";
import { FC, useState } from "react";
import { useCreateRoleMutation } from "../../store/apis/public-api";
interface CreateRoleModalProps {
  setShowAddRoleModal: (show: boolean) => void;
}
export const CreateRoleModal: FC<CreateRoleModalProps> = ({
  setShowAddRoleModal,
}) => {
  const [newRoleName, setNewRoleName] = useState<string>("");
  const [newRoleDescription, setNewRoleDescription] = useState<string>("");
  const [createRole, { isLoading }] = useCreateRoleMutation();

  const saveRole = () => {
    try {
      const response = createRole({
        role_name: newRoleName,
        role_description: newRoleDescription,
      }).unwrap();
    } catch (error) {
      console.error("Error saving role:", error);
      // Handle error appropriately, e.g., show a toast notification
      return;
    }

    // Logic to save the new role
    console.log("Role Name:", newRoleName);
    console.log("Role Description:", newRoleDescription);
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
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
                      onChange={(e) => setNewRoleDescription(e.target.value)}
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
              {isLoading ? "Creating..." : "Create Role"}
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
  );
};
