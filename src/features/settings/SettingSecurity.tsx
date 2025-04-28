import React from "react";

export const SecuritySettings: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Security Settings</h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Password</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="w-full md:w-80 p-2 border border-gray-300 rounded-md"
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full md:w-80 p-2 border border-gray-300 rounded-md"
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full md:w-80 p-2 border border-gray-300 rounded-md"
              placeholder="••••••••••••"
            />
          </div>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Update Password
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <button className="text-blue-600 hover:text-blue-800">
          Configure Two-Factor Authentication
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Sessions</h3>

        <div className="p-4 border border-gray-200 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Session</p>
              <p className="text-sm text-gray-500">
                Windows • Chrome • New York, USA
              </p>
              <p className="text-xs text-gray-400">Last active: Just now</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Active
            </span>
          </div>
        </div>

        <button className="text-red-600 hover:text-red-800">
          Sign Out of All Other Sessions
        </button>
      </div>
    </div>
  );
};
