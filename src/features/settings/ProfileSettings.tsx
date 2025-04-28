import React from "react";

export const ProfileSettings: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

      <div className="mb-6">
        <div className="flex items-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            User
          </div>
          <button className="ml-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Change Photo
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              defaultValue="Jane"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              defaultValue="Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue="jane.doe@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue="+1 (555) 123-4567"
          />
        </div>

        <div className="mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
