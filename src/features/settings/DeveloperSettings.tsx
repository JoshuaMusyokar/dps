import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setApiBaseUrl } from "../../store/slices/settings-slice";

export const DeveloperSettings: React.FC = () => {
  const dispatch = useDispatch();
  const apiBaseUrl = useSelector(
    (state: RootState) => state.settings.apiBaseUrl
  );
  const [url, setUrl] = useState(apiBaseUrl);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    dispatch(setApiBaseUrl(url));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const environmentOptions = [
    { value: "https://api.payment-gateway.com/v1", label: "Production" },
    { value: "https://staging-api.payment-gateway.com/v1", label: "Staging" },
    { value: "https://dev-api.payment-gateway.com/v1", label: "Development" },
    { value: "custom", label: "Custom" },
  ];

  const isCustom = !environmentOptions.some(
    (opt) => opt.value === url && opt.value !== "custom"
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Developer Settings</h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">API Configuration</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Environment
          </label>
          <select
            className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
            value={isCustom ? "custom" : url}
            onChange={(e) => {
              const value = e.target.value;
              if (value !== "custom") {
                setUrl(value);
              }
            }}
          >
            {environmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Base URL
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter the base URL for API requests
          </p>
        </div>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={handleSave}
        >
          Save Configuration
        </button>

        {isSaved && (
          <span className="ml-3 text-green-600">
            Configuration saved successfully!
          </span>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">API Testing Tools</h3>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Endpoint
            </label>
            <div className="flex">
              <select className="w-24 p-2 border border-gray-300 rounded-l-md bg-gray-50">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <input
                type="text"
                className="flex-1 p-2 border-y border-r border-gray-300 rounded-r-md"
                placeholder="/endpoint/path"
              />
            </div>
          </div>

          <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
            Send Request
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Developer Documentation</h3>
        <a href="#" className="text-blue-600 hover:underline flex items-center">
          View API Documentation
        </a>
      </div>
    </div>
  );
};
