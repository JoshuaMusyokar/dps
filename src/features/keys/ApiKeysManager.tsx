import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Copy,
  RefreshCcw,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  Shield,
} from "lucide-react";
import KeyModal from "./KeyModal";
import { ApiKey } from "../../types";

const ApiKeysManager: React.FC = () => {
  // State for API keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);

  // Mock data loading - replace with actual API calls
  useEffect(() => {
    // Simulate API key fetch
    setApiKeys([
      {
        id: "1",
        name: "Production API",
        key: "pk_live_51HG8qKLsN3cMVxSr9vVyHbQMCsRcTX",
        type: "public",
        environment: "live",
        createdAt: "2025-01-15T10:30:00Z",
        lastUsed: "2025-04-05T14:22:33Z",
        expiresAt: "2026-01-15T10:30:00Z",
      },
      {
        id: "2",
        name: "Backend Server",
        key: "sk_live_51HG8qKLsN3cMVxSr9vVyHbQMCsRcTX",
        type: "private",
        environment: "live",
        createdAt: "2025-01-15T10:35:00Z",
        lastUsed: "2025-04-06T09:12:45Z",
        expiresAt: "2026-01-15T10:35:00Z",
      },
      {
        id: "3",
        name: "Test API",
        key: "pk_test_51HG8qKLsN3cMVxSr9vVyHbQMCsRcTX",
        type: "public",
        environment: "test",
        createdAt: "2025-01-16T15:22:00Z",
        lastUsed: "2025-04-01T11:42:19Z",
        expiresAt: "2026-01-16T15:22:00Z",
      },
    ]);
  }, []);

  // Initialize visibility and copy status for API keys
  useEffect(() => {
    const initialShowKeys: Record<string, boolean> = {};
    const initialCopyStatus: Record<string, boolean> = {};

    apiKeys.forEach((key) => {
      initialShowKeys[key.id] = false;
      initialCopyStatus[key.id] = false;
    });

    setShowKeys(initialShowKeys);
    setCopyStatus(initialCopyStatus);
  }, [apiKeys]);

  // Function to toggle API key visibility
  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Function to copy API key to clipboard
  const copyApiKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopyStatus((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    });
  };

  // Function to delete an API key
  const deleteApiKey = (id: string) => {
    // In a real app, make an API call to delete the key
    setApiKeys((prev) => prev.filter((key) => key.id !== id));
  };

  // Function to rotate a key (create a new one and mark old for deprecation)
  const rotateKey = (key: ApiKey) => {
    // In a real app, make an API call to rotate the key
    // For demo, we'll just create a new one with "rotated" in the name
    const mockGeneratedKey =
      key.type === "public"
        ? `${
            key.environment === "live" ? "pk_live_" : "pk_test_"
          }${Math.random().toString(36).substring(2, 15)}`
        : `${
            key.environment === "live" ? "sk_live_" : "sk_test_"
          }${Math.random().toString(36).substring(2, 15)}`;

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: `${key.name} (Rotated)`,
      key: mockGeneratedKey,
      type: key.type,
      environment: key.environment,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setApiKeys((prev) => [...prev, newKey]);

    // Set visibility for the new key
    setShowKeys((prev) => ({ ...prev, [newKey.id]: true }));
    setCopyStatus((prev) => ({ ...prev, [newKey.id]: false }));
  };

  // Function to create a new API key
  const handleCreateKey = (keyData: Partial<ApiKey>) => {
    const environment = isTestMode ? "test" : "live";
    const keyPrefix =
      keyData.type === "public"
        ? environment === "live"
          ? "pk_live_"
          : "pk_test_"
        : environment === "live"
        ? "sk_live_"
        : "sk_test_";

    const mockGeneratedKey = `${keyPrefix}${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: keyData.name || "New Key",
      key: mockGeneratedKey,
      type: keyData.type || "public",
      environment: environment,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setApiKeys((prev) => [...prev, newKey]);
    setIsModalOpen(false);

    // Set visibility for the new key
    setShowKeys((prev) => ({ ...prev, [newKey.id]: true }));
    setCopyStatus((prev) => ({ ...prev, [newKey.id]: false }));
  };

  // Function to format ISO date to readable format
  const formatDate = (isoDate: string | null) => {
    if (!isoDate) return "Never";
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter keys based on environment
  const filteredKeys = apiKeys.filter((key) =>
    isTestMode ? key.environment === "test" : key.environment === "live"
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">API Keys</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage authentication for your API integrations
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Mode:</span>
            <button
              onClick={() => setIsTestMode(!isTestMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isTestMode ? "bg-gray-400" : "bg-blue-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isTestMode ? "translate-x-1" : "translate-x-6"
                }`}
              />
              <span className="sr-only">
                {isTestMode ? "Test Mode" : "Live Mode"}
              </span>
            </button>
            <span className="ml-2 text-sm font-medium">
              {isTestMode ? "Test" : "Live"}
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create API Key
          </button>
        </div>
      </div>

      <div className="mt-4 bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Key
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Expires
                </th>
                <th
                  scope="col"
                  className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Used
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredKeys.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No API keys found. Create your first key using the button
                    above.
                  </td>
                </tr>
              ) : (
                filteredKeys.map((apiKey) => (
                  <tr key={apiKey.id}>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {apiKey.type === "private" && (
                          <Shield className="h-4 w-4 text-yellow-500 mr-1" />
                        )}
                        {apiKey.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          apiKey.type === "public"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {apiKey.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="font-mono text-xs sm:text-sm">
                          {showKeys[apiKey.id]
                            ? apiKey.key
                            : apiKey.key.substring(0, 10) + "•".repeat(5)}
                        </span>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          title={showKeys[apiKey.id] ? "Hide key" : "Show key"}
                        >
                          {showKeys[apiKey.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => copyApiKey(apiKey.id, apiKey.key)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          title="Copy to clipboard"
                        >
                          {copyStatus[apiKey.id] ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-4 text-sm text-gray-500">
                      {formatDate(apiKey.createdAt)}
                    </td>
                    <td className="hidden md:table-cell px-4 py-4 text-sm text-gray-500">
                      {formatDate(apiKey.expiresAt)}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-4 text-sm text-gray-500">
                      {formatDate(apiKey.lastUsed)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => rotateKey(apiKey)}
                          title="Rotate key"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteApiKey(apiKey.id)}
                          title="Delete key"
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 px-2">
        <div className="flex items-start">
          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
          <p className="text-sm text-gray-500">
            <strong>Security Note:</strong> Keep your private keys secure. Never
            commit them to version control or share them in public environments.
            Rotate your keys regularly for better security.
          </p>
        </div>
      </div>

      {/* Modal for creating a new API key */}
      <KeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateKey}
        environment={isTestMode ? "test" : "live"}
      />
    </div>
  );
};

export default ApiKeysManager;
