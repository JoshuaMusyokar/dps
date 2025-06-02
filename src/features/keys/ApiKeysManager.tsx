import React, { useState, useEffect } from "react";
import { Clock, ArrowUpRight, RefreshCw, Search } from "lucide-react";

interface ApiLog {
  id: string;
  method: string;
  endpoint: string;
  statusCode: number;
  timestamp: string;
  duration: number;
  ipAddress: string;
  apiKeyId: string;
  apiKeyName?: string;
}

const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "success" | "error">("all");

  // Simulate fetching logs
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      const mockLogs: ApiLog[] = [
        {
          id: "log_1",
          method: "POST",
          endpoint: "/v1/payments",
          statusCode: 200,
          timestamp: "2025-04-26T08:12:34Z",
          duration: 230,
          ipAddress: "192.168.1.1",
          apiKeyId: "1",
          apiKeyName: "Production API",
        },
        {
          id: "log_2",
          method: "GET",
          endpoint: "/v1/customers/cus_123456",
          statusCode: 200,
          timestamp: "2025-04-26T08:10:12Z",
          duration: 125,
          ipAddress: "192.168.1.1",
          apiKeyId: "1",
          apiKeyName: "Production API",
        },
        {
          id: "log_3",
          method: "POST",
          endpoint: "/v1/subscriptions",
          statusCode: 400,
          timestamp: "2025-04-26T08:05:43Z",
          duration: 180,
          ipAddress: "192.168.1.2",
          apiKeyId: "2",
          apiKeyName: "Backend Server",
        },
        {
          id: "log_4",
          method: "GET",
          endpoint: "/v1/products",
          statusCode: 200,
          timestamp: "2025-04-26T07:58:21Z",
          duration: 150,
          ipAddress: "192.168.1.3",
          apiKeyId: "1",
          apiKeyName: "Production API",
        },
        {
          id: "log_5",
          method: "POST",
          endpoint: "/v1/refunds",
          statusCode: 500,
          timestamp: "2025-04-26T07:45:11Z",
          duration: 320,
          ipAddress: "192.168.1.2",
          apiKeyId: "2",
          apiKeyName: "Backend Server",
        },
      ];

      setLogs(mockLogs);
      setLoading(false);
    }, 800);
  };

  // Format timestamp to readable format
  const formatTimestamp = (isoDate: string) => {
    return new Date(isoDate).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Filter logs based on search term and status filter
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.apiKeyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);

    if (filter === "all") return matchesSearch;
    if (filter === "success")
      return matchesSearch && log.statusCode >= 200 && log.statusCode < 300;
    if (filter === "error")
      return matchesSearch && (log.statusCode >= 400 || log.statusCode === 0);

    return matchesSearch;
  });

  // Get status code color
  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300)
      return "bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400 border-success-200 dark:border-success-800/30";
    if (statusCode >= 400 && statusCode < 500)
      return "bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400 border-warning-200 dark:border-warning-800/30";
    if (statusCode >= 500 || statusCode === 0)
      return "bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400 border-error-200 dark:border-error-800/30";
    return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  };

  // Get method color
  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 border-primary-200 dark:border-primary-800/30";
      case "POST":
        return "bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400 border-success-200 dark:border-success-800/30";
      case "PUT":
        return "bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400 border-warning-200 dark:border-warning-800/30";
      case "DELETE":
        return "bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400 border-error-200 dark:border-error-800/30";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            API Request Logs
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Monitor recent API calls and their responses
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="mt-3 sm:mt-0 flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-primary-500 dark:focus:ring-dark-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search endpoints, IP addresses..."
            className="pl-10 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-primary-500 dark:focus:ring-dark-primary-400 focus:border-primary-500 dark:focus:border-dark-primary-400 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
          />
        </div>
        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "success" | "error")
          }
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-primary-500 dark:focus:ring-dark-primary-400 focus:border-primary-500 dark:focus:border-dark-primary-400 transition-colors duration-200"
        >
          <option value="all">All Requests</option>
          <option value="success">Successful (2xx)</option>
          <option value="error">Errors (4xx/5xx)</option>
        </select>
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
                  Time
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Method
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Endpoint
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
                  Duration
                </th>
                <th
                  scope="col"
                  className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  API Key
                </th>
                <th
                  scope="col"
                  className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  IP Address
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex justify-center items-center">
                      <Clock className="h-5 w-5 mr-2 animate-spin" />
                      Loading logs...
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No logs found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMethodColor(
                          log.method
                        )}`}
                      >
                        {log.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100 truncate max-w-xs">
                      {log.endpoint}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          log.statusCode
                        )}`}
                      >
                        {log.statusCode}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.duration} ms
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {log.apiKeyName || log.apiKeyId}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.ipAddress}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-primary-600 dark:text-dark-primary-400 hover:text-primary-900 dark:hover:text-dark-primary-300 transition-colors duration-200"
                        title="View details"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 px-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <strong className="text-gray-700 dark:text-gray-300">Note:</strong>{" "}
          Logs are retained for 30 days. For longer retention, export your logs
          or integrate with a logging service.
        </p>
      </div>
    </div>
  );
};

export default LogViewer;
