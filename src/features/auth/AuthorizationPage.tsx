import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../components/layouts/DashboardLayout";
import { ArrowLeft, Shield, AlertTriangle } from "lucide-react";

const Unauthorized: React.FC = () => {
  useEffect(() => {
    // Add page-specific title
    document.title = "Access Denied | Your App Name";

    // Optional: Log unauthorized access attempt
    console.log("Unauthorized access attempt recorded");
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-2xl">
          <div className="p-6 sm:p-10">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-red-100 p-3">
                <Shield className="h-12 w-12 text-red-500" />
              </div>
            </div>

            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
              Access Denied
            </h2>

            <div className="border-t border-b border-gray-200 py-4 my-6">
              <div className="flex items-center justify-center space-x-2 text-yellow-600 mb-4">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Unauthorized Access</span>
              </div>

              <p className="text-center text-gray-600 mb-4">
                You don't have permission to access this page. If you believe
                this is an error, please contact your administrator.
              </p>

              <div className="text-sm text-gray-500 text-center">
                Error Code: 403 - Forbidden
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>

              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto transition-colors duration-200"
              >
                Refresh Page
              </button>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              If you need assistance, please contact our{" "}
              <a
                href="/support"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                support team
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Unauthorized;
