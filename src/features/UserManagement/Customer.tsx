import React, { useState, useEffect } from "react";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Filter,
  Search,
  UserPlus,
} from "lucide-react";

// Types
interface Customer {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended" | "pending";
  createdAt: string;
  lastLogin: string;
  permissions: string[];
  totalTransactions: number;
  balance: number;
}

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Customer;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id">>({
    name: "",
    email: "",
    status: "pending",
    createdAt: new Date().toISOString(),
    lastLogin: "",
    permissions: [],
    totalTransactions: 0,
    balance: 0,
  });
  const [availablePermissions, setAvailablePermissions] = useState<
    Permission[]
  >([]);
  const [permissionSearch, setPermissionSearch] = useState("");

  // Mock data initialization
  useEffect(() => {
    // Mock customers data
    const mockCustomers: Customer[] = [
      {
        id: "1",
        name: "Acme Corporation",
        email: "billing@acme.com",
        status: "active",
        createdAt: "2023-01-15T10:30:00Z",
        lastLogin: "2023-06-20T14:45:00Z",
        permissions: [
          "process_payments",
          "view_reports",
          "manage_subscriptions",
        ],
        totalTransactions: 1245,
        balance: 12500.75,
      },
      {
        id: "2",
        name: "TechStart Inc.",
        email: "payments@techstart.io",
        status: "active",
        createdAt: "2023-02-20T09:15:00Z",
        lastLogin: "2023-06-18T11:20:00Z",
        permissions: ["process_payments", "refund_payments"],
        totalTransactions: 872,
        balance: 8432.2,
      },
      {
        id: "3",
        name: "Global Retail",
        email: "finance@globalretail.com",
        status: "suspended",
        createdAt: "2023-03-10T14:20:00Z",
        lastLogin: "2023-05-30T16:10:00Z",
        permissions: ["process_payments"],
        totalTransactions: 3560,
        balance: 0.0,
      },
      {
        id: "4",
        name: "ServicePro",
        email: "accounting@servicepro.net",
        status: "pending",
        createdAt: "2023-06-01T08:45:00Z",
        lastLogin: "",
        permissions: [],
        totalTransactions: 0,
        balance: 0.0,
      },
      {
        id: "5",
        name: "Digital Creations",
        email: "admin@digitalcreations.art",
        status: "active",
        createdAt: "2023-04-05T11:30:00Z",
        lastLogin: "2023-06-19T09:15:00Z",
        permissions: ["process_payments", "view_reports", "manage_users"],
        totalTransactions: 543,
        balance: 3245.5,
      },
    ];

    // Mock permissions data
    const mockPermissions: Permission[] = [
      {
        id: "process_payments",
        name: "Process Payments",
        category: "Payments",
        description: "Create and process payment transactions",
      },
      {
        id: "refund_payments",
        name: "Refund Payments",
        category: "Payments",
        description: "Issue refunds for processed payments",
      },
      {
        id: "view_reports",
        name: "View Reports",
        category: "Analytics",
        description: "Access financial and transaction reports",
      },
      {
        id: "manage_subscriptions",
        name: "Manage Subscriptions",
        category: "Billing",
        description: "Create and manage recurring subscriptions",
      },
      {
        id: "manage_users",
        name: "Manage Users",
        category: "Administration",
        description: "Add and manage customer users",
      },
      {
        id: "api_access",
        name: "API Access",
        category: "Integration",
        description: "Access payment gateway APIs",
      },
      {
        id: "view_statements",
        name: "View Statements",
        category: "Billing",
        description: "Download account statements",
      },
      {
        id: "export_data",
        name: "Export Data",
        category: "Analytics",
        description: "Export transaction data in various formats",
      },
    ];

    setCustomers(mockCustomers);
    setFilteredCustomers(mockCustomers);
    setAvailablePermissions(mockPermissions);
  }, []);

  // Filter and sort customers
  useEffect(() => {
    let result = [...customers];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((customer) => customer.status === statusFilter);
    }

    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredCustomers(result);
  }, [customers, searchTerm, statusFilter, sortConfig]);

  // Handle sort request
  const requestSort = (key: keyof Customer) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Handle permission toggle
  const togglePermission = (permissionId: string) => {
    if (!selectedCustomer) return;

    const updatedPermissions = selectedCustomer.permissions.includes(
      permissionId
    )
      ? selectedCustomer.permissions.filter((id) => id !== permissionId)
      : [...selectedCustomer.permissions, permissionId];

    setSelectedCustomer({
      ...selectedCustomer,
      permissions: updatedPermissions,
    });
  };

  // Save customer changes
  const saveCustomerChanges = () => {
    if (!selectedCustomer) return;

    const updatedCustomers = customers.map((customer) =>
      customer.id === selectedCustomer.id ? selectedCustomer : customer
    );

    setCustomers(updatedCustomers);
    setShowEditModal(false);
    setShowPermissionsModal(false);
  };

  // Add new customer
  const addNewCustomer = () => {
    const newCustomerWithId = {
      ...newCustomer,
      id: `cust_${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
    };

    setCustomers([...customers, newCustomerWithId]);
    setShowAddModal(false);
    setNewCustomer({
      name: "",
      email: "",
      status: "pending",
      createdAt: new Date().toISOString(),
      lastLogin: "",
      permissions: [],
      totalTransactions: 0,
      balance: 0,
    });
  };

  // Delete customer
  const deleteCustomer = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this customer? This action cannot be undone."
      )
    ) {
      setCustomers(customers.filter((customer) => customer.id !== id));
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
    }
  };

  // Get permission name by ID
  const getPermissionName = (id: string) => {
    const permission = availablePermissions.find((p) => p.id === id);
    return permission ? permission.name : id;
  };

  // Filter permissions by search term
  const filteredPermissions = availablePermissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
      permission.description
        .toLowerCase()
        .includes(permissionSearch.toLowerCase())
  );

  // Group permissions by category
  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Customer Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your payment gateway customers, permissions, and access
              levels
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlus className="mr-2" />
            Add New Customer
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setSortConfig(null);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="mr-2" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center">
                      Customer
                      {sortConfig?.key === "name" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="ml-1" />
                        ) : (
                          <ChevronDown className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig?.key === "status" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="ml-1" />
                        ) : (
                          <ChevronDown className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("totalTransactions")}
                  >
                    <div className="flex items-center">
                      Transactions
                      {sortConfig?.key === "totalTransactions" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="ml-1" />
                        ) : (
                          <ChevronDown className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("balance")}
                  >
                    <div className="flex items-center">
                      Balance
                      {sortConfig?.key === "balance" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="ml-1" />
                        ) : (
                          <ChevronDown className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("lastLogin")}
                  >
                    <div className="flex items-center">
                      Last Active
                      {sortConfig?.key === "lastLogin" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="ml-1" />
                        ) : (
                          <ChevronDown className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No customers found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            customer.status === "active"
                              ? "bg-green-100 text-green-800"
                              : customer.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {customer.status.charAt(0).toUpperCase() +
                            customer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.totalTransactions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(customer.balance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(customer.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowPermissionsModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-900 mr-4"
                        >
                          Permissions
                        </button>
                        <button
                          onClick={() => deleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Customer Modal */}
        {showAddModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Customer
                    </h3>
                    <div className="mt-2">
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="customer-name"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Company Name
                          </label>
                          <input
                            type="text"
                            id="customer-name"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Acme Corporation"
                            value={newCustomer.name}
                            onChange={(e) =>
                              setNewCustomer({
                                ...newCustomer,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="customer-email"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="customer-email"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="billing@acme.com"
                            value={newCustomer.email}
                            onChange={(e) =>
                              setNewCustomer({
                                ...newCustomer,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="customer-status"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Status
                          </label>
                          <select
                            id="customer-status"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newCustomer.status}
                            onChange={(e) =>
                              setNewCustomer({
                                ...newCustomer,
                                status: e.target.value as
                                  | "active"
                                  | "pending"
                                  | "suspended",
                              })
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    onClick={addNewCustomer}
                    disabled={!newCustomer.name || !newCustomer.email}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm ${
                      !newCustomer.name || !newCustomer.email
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Add Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Customer Modal */}
        {showEditModal && selectedCustomer && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <Edit className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit Customer
                    </h3>
                    <div className="mt-2">
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="edit-name"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Company Name
                          </label>
                          <input
                            type="text"
                            id="edit-name"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={selectedCustomer.name}
                            onChange={(e) =>
                              setSelectedCustomer({
                                ...selectedCustomer,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="edit-email"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="edit-email"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={selectedCustomer.email}
                            onChange={(e) =>
                              setSelectedCustomer({
                                ...selectedCustomer,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="edit-status"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Status
                          </label>
                          <select
                            id="edit-status"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={selectedCustomer.status}
                            onChange={(e) =>
                              setSelectedCustomer({
                                ...selectedCustomer,
                                status: e.target.value as
                                  | "active"
                                  | "pending"
                                  | "suspended",
                              })
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    onClick={saveCustomerChanges}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Permissions Modal */}
        {showPermissionsModal && selectedCustomer && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Manage Permissions
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Manage permissions for {selectedCustomer.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Search permissions..."
                      value={permissionSearch}
                      onChange={(e) => setPermissionSearch(e.target.value)}
                    />
                  </div>

                  <div className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-96 overflow-y-auto">
                    {Object.entries(groupedPermissions).map(
                      ([category, permissions]) => (
                        <div key={category}>
                          <div className="bg-gray-50 px-4 py-2">
                            <h4 className="text-sm font-medium text-gray-700">
                              {category}
                            </h4>
                          </div>
                          <div className="px-4">
                            {permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="py-3 flex items-center justify-between border-b border-gray-100 last:border-0"
                              >
                                <div>
                                  <div className="flex items-center">
                                    <button
                                      onClick={() =>
                                        togglePermission(permission.id)
                                      }
                                      className={`mr-3 flex-shrink-0 h-5 w-5 rounded flex items-center justify-center ${
                                        selectedCustomer.permissions.includes(
                                          permission.id
                                        )
                                          ? "bg-purple-600"
                                          : "border border-gray-300"
                                      }`}
                                    >
                                      {selectedCustomer.permissions.includes(
                                        permission.id
                                      ) && (
                                        <Check className="h-3 w-3 text-white" />
                                      )}
                                    </button>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {permission.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {permission.description}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    onClick={saveCustomerChanges}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:col-start-2 sm:text-sm"
                  >
                    Save Permissions
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPermissionsModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
