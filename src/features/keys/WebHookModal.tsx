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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Add Webhook Endpoint
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
              htmlFor="webhookUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Endpoint URL
            </label>
            <input
              type="url"
              id="webhookUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-domain.com/webhooks"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Events to Subscribe
            </label>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {filteredEvents.length > 0 && (
              <div className="flex justify-between mb-2 text-xs">
                <button
                  type="button"
                  onClick={selectAllFiltered}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={deselectAllFiltered}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Deselect all
                </button>
              </div>
            )}
            <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md">
              {filteredEvents.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                  No matching events found
                </div>
              ) : (
                <div className="p-1">
                  {filteredEvents.map((event) => (
                    <div
                      key={event}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                    >
                      <input
                        type="checkbox"
                        id={`event-${event}`}
                        checked={selectedEvents.includes(event)}
                        onChange={() => toggleEvent(event)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`event-${event}`}
                        className="ml-2 block text-sm text-gray-700 cursor-pointer w-full"
                      >
                        {event}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedEvents.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {selectedEvents.length} events
              </div>
            )}
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
