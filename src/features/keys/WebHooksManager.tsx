import React, { useState, useEffect } from "react";
import { Plus, Trash2, AlertTriangle, Check, Clock, Send } from "lucide-react";
import WebhookModal from "./WebHookModal";
import { Webhook } from "../../types";

const WebhooksManager: React.FC = () => {
  // State for webhooks
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});

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
    "checkout.completed",
    "dispute.created",
    "invoice.paid",
    "invoice.payment_failed",
  ];

  // Simulate webhook fetch
  useEffect(() => {
    setWebhooks([
      {
        id: "1",
        url: "https://example.com/webhooks/payments",
        events: ["payment.succeeded", "payment.failed"],
        active: true,
        createdAt: "2025-01-20T11:30:00Z",
        lastDelivery: {
          timestamp: "2025-04-22T15:21:33Z",
          status: "success",
          responseCode: 200,
        },
      },
      {
        id: "2",
        url: "https://myapp.vercel.app/api/webhook",
        events: ["subscription.created", "subscription.canceled"],
        active: true,
        createdAt: "2025-02-10T09:15:00Z",
        lastDelivery: {
          timestamp: "2025-04-25T08:43:12Z",
          status: "success",
          responseCode: 200,
        },
      },
    ]);
  }, []);

  // Function to add a new webhook
  const handleAddWebhook = (webhookData: Partial<Webhook>) => {
    if (!webhookData.url || !webhookData.events?.length) return;

    const newWebhook: Webhook = {
      id: Date.now().toString(),
      url: webhookData.url,
      events: webhookData.events || [],
      active: true,
      createdAt: new Date().toISOString(),
      lastDelivery: null,
    };

    setWebhooks((prev) => [...prev, newWebhook]);
    setIsModalOpen(false);
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
    setWebhooks((prev) => prev.filter((webhook) => webhook.id !== id));
  };

  // Function to test a webhook
  const testWebhook = (id: string) => {
    setTestingWebhook(id);

    // Simulate a webhook test with a delay
    setTimeout(() => {
      setTestResults((prev) => ({
        ...prev,
        [id]: "success",
      }));

      // Update the webhook with a successful test delivery
      setWebhooks((prev) =>
        prev.map((webhook) =>
          webhook.id === id
            ? {
                ...webhook,
                lastDelivery: {
                  timestamp: new Date().toISOString(),
                  status: "success",
                  responseCode: 200,
                },
              }
            : webhook
        )
      );

      setTestingWebhook(null);

      // Clear test result after 3 seconds
      setTimeout(() => {
        setTestResults((prev) => {
          const newResults = { ...prev };
          delete newResults[id];
          return newResults;
        });
      }, 3000);
    }, 1500);
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

  // Function to get badge color for delivery status
  const getStatusColor = (status: string | undefined) => {
    if (!status)
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    switch (status) {
      case "success":
        return "bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400 border-success-200 dark:border-success-800/30";
      case "failed":
        return "bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400 border-error-200 dark:border-error-800/30";
      case "pending":
        return "bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400 border-warning-200 dark:border-warning-800/30";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Webhooks
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Receive real-time notifications about events in your payment gateway
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-3 sm:mt-0 flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 dark:bg-dark-primary-600 hover:bg-primary-700 dark:hover:bg-dark-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-primary-500 dark:focus:ring-dark-primary-400 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Webhook
        </button>
      </div>

      <div className="mt-4 bg-white dark:bg-gray-800 shadow-soft dark:shadow-glass-dark border border-gray-200 dark:border-gray-700 overflow-hidden rounded-lg">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Endpoint URL
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Events
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Last Delivery
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {webhooks.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No webhooks found. Add your first webhook using the button
                    above.
                  </td>
                </tr>
              ) : (
                webhooks.map((webhook) => (
                  <tr
                    key={webhook.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 max-w-xs truncate">
                      {webhook.url}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.slice(0, 3).map((event) => (
                          <span
                            key={event}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-dark-primary-900/20 text-primary-800 dark:text-dark-primary-400 border border-primary-200 dark:border-dark-primary-800/30"
                          >
                            {event}
                          </span>
                        ))}
                        {webhook.events.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                            +{webhook.events.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <button
                        onClick={() => toggleWebhookStatus(webhook.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200 ${
                          webhook.active
                            ? "bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400 border-success-200 dark:border-success-800/30"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {webhook.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {webhook.lastDelivery ? (
                        <div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                              webhook.lastDelivery.status
                            )}`}
                          >
                            {webhook.lastDelivery.status} (
                            {webhook.lastDelivery.responseCode})
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatDate(webhook.lastDelivery.timestamp)}
                          </div>
                        </div>
                      ) : (
                        "No deliveries yet"
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => testWebhook(webhook.id)}
                          disabled={testingWebhook === webhook.id}
                          className="text-primary-600 dark:text-dark-primary-400 hover:text-primary-900 dark:hover:text-dark-primary-300 relative transition-colors duration-200 disabled:opacity-50"
                          title="Test webhook"
                        >
                          {testingWebhook === webhook.id ? (
                            <Clock className="h-4 w-4 animate-spin" />
                          ) : testResults[webhook.id] === "success" ? (
                            <Check className="h-4 w-4 text-success-500 dark:text-success-400" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteWebhook(webhook.id)}
                          className="text-error-600 dark:text-error-400 hover:text-error-900 dark:hover:text-error-300 transition-colors duration-200"
                          title="Delete webhook"
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
          <AlertTriangle className="h-4 w-4 text-warning-500 dark:text-warning-400 mr-2 mt-0.5" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <strong className="text-gray-700 dark:text-gray-300">Note:</strong>{" "}
            Webhook endpoints must respond with a 2xx status code within 10
            seconds to be considered successful. Configure proper authentication
            for your webhook endpoints for security.
          </p>
        </div>
      </div>

      {/* Modal for creating a new webhook */}
      <WebhookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddWebhook}
        availableEvents={availableEvents}
      />
    </div>
  );
};

export default WebhooksManager;
