import React, { useState, useEffect } from "react";

import {
  Eye,
  EyeOff,
  Copy,
  RefreshCcw,
  Plus,
  Trash2,
  Check,
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: "public" | "private";
  createdAt: string;
  lastUsed: string | null;
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

const ApiKeysIntegrations: React.FC = () => {
  // State for API keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState<string>("");
  const [newKeyType, setNewKeyType] = useState<"public" | "private">("public");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  // State for webhooks
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newWebhookUrl, setNewWebhookUrl] = useState<string>("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  // Available webhook events
  const availableEvents = [
    "payment.succeeded",
    "payment.failed",
    "customer.created",
    "customer.updated",
    "subscription.created",
    "subscription.updated",
    "subscription.canceled",
    "refund.processed",
  ];

  // Mock data loading - replace with actual API calls
  useEffect(() => {
    // Simulate API key fetch
    setApiKeys([
      {
        id: "1",
        name: "Production API",
        key: "pk_live_51HG8qKLsN3cMVxSr9vVyHbQMCsRcTX",
        type: "public",
        createdAt: "2025-01-15T10:30:00Z",
        lastUsed: "2025-04-05T14:22:33Z",
      },
      {
        id: "2",
        name: "Backend Server",
        key: "sk_live_51HG8qKLsN3cMVxSr9vVyHbQMCsRcTX",
        type: "private",
        createdAt: "2025-01-15T10:35:00Z",
        lastUsed: "2025-04-06T09:12:45Z",
      },
    ]);

    // Simulate webhook fetch
    setWebhooks([
      {
        id: "1",
        url: "https://example.com/webhooks/payments",
        events: ["payment.succeeded", "payment.failed"],
        active: true,
        createdAt: "2025-01-20T11:30:00Z",
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

  // Function to generate a new API key
  const generateApiKey = () => {
    if (!newKeyName) return;

    // In a real app, make an API call to generate the key
    const mockGeneratedKey =
      newKeyType === "public"
        ? `pk_live_${Math.random().toString(36).substring(2, 15)}`
        : `sk_live_${Math.random().toString(36).substring(2, 15)}`;

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: mockGeneratedKey,
      type: newKeyType,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };

    setApiKeys((prev) => [...prev, newKey]);
    setNewKeyName("");

    // Add visibility and copy status for new key
    setShowKeys((prev) => ({ ...prev, [newKey.id]: true }));
    setCopyStatus((prev) => ({ ...prev, [newKey.id]: false }));
  };

  // Function to delete an API key
  const deleteApiKey = (id: string) => {
    // In a real app, make an API call to delete the key
    setApiKeys((prev) => prev.filter((key) => key.id !== id));
  };

  // Function to add a new webhook
  const addWebhook = () => {
    if (!newWebhookUrl || selectedEvents.length === 0) return;

    // In a real app, make an API call to add the webhook
    const newWebhook: Webhook = {
      id: Date.now().toString(),
      url: newWebhookUrl,
      events: selectedEvents,
      active: true,
      createdAt: new Date().toISOString(),
    };

    setWebhooks((prev) => [...prev, newWebhook]);
    setNewWebhookUrl("");
    setSelectedEvents([]);
  };

  // Function to toggle webhook active status
  const toggleWebhookStatus = (id: string) => {
    setWebhooks((prev) =>
      prev.map((webhook) =>
        webhook.id === id ? { ...webhook, active: !webhook.active } : webhook
      )
    );
  };

  // Function to delete a webhook
  const deleteWebhook = (id: string) => {
    // In a real app, make an API call to delete the webhook
    setWebhooks((prev) => prev.filter((webhook) => webhook.id !== id));
  };

  // Function to toggle event selection
  const toggleEventSelection = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900">
          API Keys & Integrations
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your API keys and webhook integrations securely.
        </p>

        {/* API Keys Section */}
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">API Keys</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Enter key name"
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={newKeyType}
                onChange={(e) =>
                  setNewKeyType(e.target.value as "public" | "private")
                }
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <button
                onClick={generateApiKey}
                disabled={!newKeyName}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                <Plus className="mr-2" />
                Generate Key
              </button>
            </div>
          </div>

          <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Key
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Used
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiKeys.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No API keys found. Generate your first key above.
                      </td>
                    </tr>
                  ) : (
                    apiKeys.map((apiKey) => (
                      <tr key={apiKey.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {apiKey.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="font-mono">
                              {showKeys[apiKey.id]
                                ? apiKey.key
                                : apiKey.key.substring(0, 10) + "•".repeat(10)}
                            </span>
                            <button
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                              {showKeys[apiKey.id] ? <EyeOff /> : <Eye />}
                            </button>
                            <button
                              onClick={() => copyApiKey(apiKey.id, apiKey.key)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                              {copyStatus[apiKey.id] ? (
                                <Check className="text-green-500" />
                              ) : (
                                <Copy />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(apiKey.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(apiKey.lastUsed)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => deleteApiKey(apiKey.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 px-2">
            <p className="text-sm text-gray-500">
              <strong>Note:</strong> Keep your private keys secure. Don't commit
              them to version control or share them in public environments.
            </p>
          </div>
        </div>

        {/* Webhooks Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Webhook URLs
            </h2>
          </div>

          <div className="mt-6 bg-white shadow overflow-hidden rounded-lg p-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="text"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                placeholder="https://your-endpoint.com/webhook"
                className="px-3 py-2 flex-grow border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={addWebhook}
                disabled={!newWebhookUrl || selectedEvents.length === 0}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                <Plus className="mr-2" />
                Add Webhook
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Select events to trigger this webhook:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableEvents.map((event) => (
                  <div key={event} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`event-${event}`}
                      checked={selectedEvents.includes(event)}
                      onChange={() => toggleEventSelection(event)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`event-${event}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {event}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Endpoint URL
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Events
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {webhooks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No webhooks found. Add your first webhook above.
                      </td>
                    </tr>
                  ) : (
                    webhooks.map((webhook) => (
                      <tr key={webhook.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                          {webhook.url}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.map((event) => (
                              <span
                                key={event}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {event}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => toggleWebhookStatus(webhook.id)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              webhook.active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {webhook.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(webhook.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => deleteWebhook(webhook.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 px-2">
            <p className="text-sm text-gray-500">
              <strong>Info:</strong> Webhooks allow your application to receive
              real-time notifications about events in your payment gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeysIntegrations;
