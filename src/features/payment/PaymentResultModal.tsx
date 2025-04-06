import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export const PaymentResultModal = ({
  isOpen,
  onClose,
  result,
}: {
  isOpen: boolean;
  onClose: () => void;
  result: { success: boolean; message?: string; transaction?: any } | null;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                {result?.success ? (
                  <CheckCircleIcon className="h-10 w-10 text-green-500" />
                ) : (
                  <XCircleIcon className="h-10 w-10 text-red-500" />
                )}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {result?.success ? "Payment Successful!" : "Payment Failed"}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {result?.success
                      ? `Your payment of ${result.transaction.amount} ${result.transaction.currency} was processed successfully.`
                      : result?.message ||
                        "An error occurred while processing your payment."}
                  </p>
                  {result?.success && result.transaction && (
                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-700">
                        Transaction ID:{" "}
                        <span className="font-normal">
                          {result.transaction.id}
                        </span>
                      </p>
                      <p className="text-sm font-medium text-gray-700 mt-1">
                        Payment Method:{" "}
                        <span className="font-normal capitalize">
                          {result.transaction.method}
                        </span>
                      </p>
                      <p className="text-sm font-medium text-gray-700 mt-1">
                        Date:{" "}
                        <span className="font-normal">
                          {new Date(
                            result.transaction.timestamp
                          ).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${
                result?.success
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={onClose}
            >
              {result?.success ? "Continue Shopping" : "Try Again"}
            </button>
            {!result?.success && (
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
