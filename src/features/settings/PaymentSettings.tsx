import React from "react";

export const PaymentSettings: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Saved Payment Methods</h3>

        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-6 bg-blue-600 rounded mr-3"></div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800">
                Edit
              </button>
              <button className="text-red-600 hover:text-red-800">
                Remove
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-6 bg-green-600 rounded mr-3"></div>
              <div>
                <p className="font-medium">•••• •••• •••• 8888</p>
                <p className="text-sm text-gray-500">Expires 09/26</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800">
                Edit
              </button>
              <button className="text-red-600 hover:text-red-800">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
        <span className="mr-2">+</span>
        Add Payment Method
      </button>
    </div>
  );
};
