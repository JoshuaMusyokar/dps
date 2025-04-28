import React from "react";

import LogViewer from "./LogViewer";
import ApiKeysManager from "./ApiKeysManager";
import WebhooksManager from "./WebHooksManager";

const ApiGateway: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          API Gateway Dashboard
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-600">
          Manage your API keys, webhooks, and monitor integration activity.
        </p>

        <div className="mt-6 md:mt-10">
          <ApiKeysManager />
        </div>

        <div className="mt-8 md:mt-16">
          <WebhooksManager />
        </div>

        <div className="mt-8 md:mt-16">
          <LogViewer />
        </div>
      </div>
    </div>
  );
};

export default ApiGateway;
