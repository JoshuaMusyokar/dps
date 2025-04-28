import React, { useState } from "react";
import { X } from "lucide-react";
import { ApiKey } from "../../types";

interface KeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keyData: Partial<ApiKey>) => void;
  environment: string;
}

const KeyModal: React.FC<KeyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  environment,
}) => {
  const [keyName, setKeyName] = useState("");
  const [keyType, setKeyType] = useState<"public" | "private">("public");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: keyName,
      type: keyType,
    });
    // Reset form
    setKeyName("");
    setKeyType("public");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Create New API Key
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="keyName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Key Name
            </label>
            <input
              type="text"
              id="keyName"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g., Production Frontend, Backend Service"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="keyType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Key Type
            </label>
            <select
              id="keyType"
              value={keyType}
              onChange={(e) =>
                setKeyType(e.target.value as "public" | "private")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="public">Public (pk_) - Frontend use only</option>
              <option value="private">
                Private (sk_) - Secure server-side use
              </option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Environment
            </label>
            <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
              {environment === "test" ? "Test Mode" : "Live Mode"}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {environment === "test"
                ? "Test mode keys can be used for development and testing only."
                : "Live mode keys will affect real transactions and customers."}
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              disabled={!keyName}
            >
              Create Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KeyModal;
