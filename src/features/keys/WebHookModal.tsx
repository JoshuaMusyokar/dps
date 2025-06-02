// src/components/ApiGateway/WebhookModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { Webhook } from "../../types";

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (webhookData: Partial<Webhook>) => void;
  availableEvents: string[];
}

const WebhookModal: React.FC<WebhookModalProps> = ({
  isOpen,
  onClose,
  onSave,
  availableEvents,
}) => {
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      url,
      events: selectedEvents,
    });
    // Reset form
    setUrl("");
    setSelectedEvents([]);
    setSearchTerm("");
  };

  // Toggle event selection
  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  // Filter events based on search term
  const filteredEvents = availableEvents.filter((event) =>
    event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Select all filtered events
  const selectAllFiltered = () => {
    const newSelected = [...selectedEvents];
    filteredEvents.forEach((event) => {
      if (!newSelected.includes(event)) {
        newSelected.push(event);
      }
    });
    setSelectedEvents(newSelected);
  };

  // Deselect all filtered events
  const deselectAllFiltered = () => {
    setSelectedEvents((prev) =>
      prev.filter((event) => !filteredEvents.includes(event))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-glass-dark border border-gray-200 dark:border-gray-700 w-full max-w-md p-6 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Add Webhook Endpoint
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="webhookUrl"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Endpoint URL
            </label>
            <input
              type="url"
              id="webhookUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-domain.com/webhooks"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-primary-500 dark:focus:ring-dark-primary-400 focus:border-primary-500 dark:focus:border-dark-primary-400 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Events to Subscribe
            </label>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-primary-500 dark:focus:ring-dark-primary-400 focus:border-primary-500 dark:focus:border-dark-primary-400 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
              />
            </div>
            {filteredEvents.length > 0 && (
              <div className="flex justify-between mb-2 text-xs">
                <button
                  type="button"
                  onClick={selectAllFiltered}
                  className="text-primary-600 dark:text-dark-primary-400 hover:text-primary-800 dark:hover:text-dark-primary-300 transition-colors duration-200"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={deselectAllFiltered}
                  className="text-primary-600 dark:text-dark-primary-400 hover:text-primary-800 dark:hover:text-dark-primary-300 transition-colors duration-200"
                >
                  Deselect all
                </button>
              </div>
            )}
            <div className="mt-2 max-h-40 overflow-y-auto scrollbar-thin border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md">
              {filteredEvents.length === 0 ? (
                <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
                  No matching events found
                </div>
              ) : (
                <div className="p-1">
                  {filteredEvents.map((event) => (
                    <div
                      key={event}
                      className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                    >
                      <input
                        type="checkbox"
                        id={`event-${event}`}
                        checked={selectedEvents.includes(event)}
                        onChange={() => toggleEvent(event)}
                        className="h-4 w-4 text-primary-600 dark:text-dark-primary-400 focus:ring-primary-500 dark:focus:ring-dark-primary-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded transition-colors duration-200"
                      />
                      <label
                        htmlFor={`event-${event}`}
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer w-full"
                      >
                        {event}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedEvents.length > 0 && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Selected: {selectedEvents.length} events
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-primary-500 dark:focus:ring-dark-primary-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 dark:bg-dark-primary-600 hover:bg-primary-700 dark:hover:bg-dark-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-primary-500 dark:focus:ring-dark-primary-400 disabled:bg-primary-300 dark:disabled:bg-dark-primary-800 disabled:cursor-not-allowed transition-all duration-200"
              disabled={!url || selectedEvents.length === 0}
            >
              Add Webhook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WebhookModal;
