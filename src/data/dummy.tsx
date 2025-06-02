import { DashboardStats, RevenueData, Transaction } from "../types";

// Helper function to generate random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Generate dummy transactions
const generateTransactions = (count: number): Transaction[] => {
  const statuses: Array<Transaction["status"]> = [
    "successful",
    "failed",
    "pending",
    "refunded",
  ];
  const methods: Array<Transaction["paymentMethod"]> = [
    "card",
    "bank",
    "wallet",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `txn_${10000 + i}`,
    amount: Math.floor(Math.random() * 10000) / 100,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    paymentMethod: methods[Math.floor(Math.random() * methods.length)],
    customer: `cust_${Math.floor(1000 + Math.random() * 9000)}`,
    date: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
  }));
};

// Generate revenue data
const generateRevenueData = (): RevenueData[] => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.map((month, index) => ({
    date: month,
    amount: Math.floor(Math.random() * 100000) + 50000,
  }));
};

// Dashboard stats
export const dummyStats: DashboardStats = {
  totalRevenue: 1245683.42,
  revenueChange: 12.5,
  totalTransactions: 1842,
  transactionsChange: 8.3,
  successfulPayments: 1689,
  successRateChange: 2.1,
  refunds: 153,
  refundRateChange: -4.2,
  paymentMethods: {
    card: 65,
    bank: 25,
    wallet: 10,
  },
};

export const dummyRevenueData = generateRevenueData();
export const dummyTransactions = generateTransactions(50);
interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  createdAt: string;
  updatedAt: string;
  isSystemRole: boolean;
  permissions: Permission[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: "read" | "write" | "delete" | "manage";
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  lastActive: string;
  status: "active" | "inactive" | "pending";
}
export const mockPermissions: Permission[] = [
  {
    id: "1",
    name: "View Payments",
    description: "View all payment transactions",
    resource: "payments",
    action: "read",
  },
  {
    id: "2",
    name: "Process Refunds",
    description: "Process refund transactions",
    resource: "payments",
    action: "write",
  },
  {
    id: "3",
    name: "View Customers",
    description: "View customer details",
    resource: "customers",
    action: "read",
  },
  {
    id: "4",
    name: "Edit Customers",
    description: "Edit customer information",
    resource: "customers",
    action: "write",
  },
  {
    id: "5",
    name: "Delete Customers",
    description: "Remove customers from the system",
    resource: "customers",
    action: "delete",
  },
  {
    id: "6",
    name: "View Webhooks",
    description: "View webhook configurations",
    resource: "webhooks",
    action: "read",
  },
  {
    id: "7",
    name: "Edit Webhooks",
    description: "Edit webhook settings",
    resource: "webhooks",
    action: "write",
  },
  {
    id: "8",
    name: "Manage API Keys",
    description: "Create, view, and revoke API keys",
    resource: "api_keys",
    action: "manage",
  },
  {
    id: "9",
    name: "View Reports",
    description: "Access financial reports",
    resource: "reports",
    action: "read",
  },
  {
    id: "10",
    name: "Manage Users",
    description: "Add, edit and remove users",
    resource: "users",
    action: "manage",
  },
  {
    id: "11",
    name: "Manage Roles",
    description: "Create and configure roles",
    resource: "roles",
    action: "manage",
  },
  {
    id: "12",
    name: "View Subscriptions",
    description: "View subscription details",
    resource: "subscriptions",
    action: "read",
  },
  {
    id: "13",
    name: "Edit Subscriptions",
    description: "Modify subscription plans",
    resource: "subscriptions",
    action: "write",
  },
  {
    id: "14",
    name: "System Settings",
    description: "Change system-wide settings",
    resource: "settings",
    action: "manage",
  },
];

// Mock roles
export const mockRoles: Role[] = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access with all permissions",
    userCount: 3,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-03-18T14:22:33Z",
    isSystemRole: true,
    permissions: mockPermissions.filter((p) =>
      [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
      ].includes(p.id)
    ),
  },
  {
    id: "2",
    name: "Finance Manager",
    description: "Access to financial aspects of the system",
    userCount: 5,
    createdAt: "2025-01-20T11:30:00Z",
    updatedAt: "2025-03-20T09:12:45Z",
    isSystemRole: false,
    permissions: mockPermissions.filter((p) =>
      ["1", "2", "9", "12", "13"].includes(p.id)
    ),
  },
  {
    id: "3",
    name: "Customer Support",
    description: "Manage customer accounts and basic operations",
    userCount: 12,
    createdAt: "2025-01-25T09:15:00Z",
    updatedAt: "2025-03-15T16:30:20Z",
    isSystemRole: false,
    permissions: mockPermissions.filter((p) => ["1", "3", "12"].includes(p.id)),
  },
  {
    id: "4",
    name: "Developer",
    description: "Manage API keys and webhook integrations",
    userCount: 8,
    createdAt: "2025-02-05T14:45:00Z",
    updatedAt: "2025-04-01T11:20:15Z",
    isSystemRole: false,
    permissions: mockPermissions.filter((p) => ["6", "7", "8"].includes(p.id)),
  },
  {
    id: "5",
    name: "Read Only",
    description: "View-only access across the system",
    userCount: 7,
    createdAt: "2025-02-10T16:20:00Z",
    updatedAt: "2025-03-25T10:05:30Z",
    isSystemRole: true,
    permissions: mockPermissions.filter((p) =>
      ["1", "3", "6", "9", "12"].includes(p.id)
    ),
  },
];

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    roles: ["1"],
    lastActive: "2025-04-05T14:22:33Z",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Thompson",
    email: "sarah.t@example.com",
    roles: ["1"],
    lastActive: "2025-04-06T09:12:45Z",
    status: "active",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    roles: ["2"],
    lastActive: "2025-04-04T11:30:20Z",
    status: "active",
  },
  {
    id: "4",
    name: "Emma Rodriguez",
    email: "emma.r@example.com",
    roles: ["2", "5"],
    lastActive: "2025-04-02T16:45:10Z",
    status: "active",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.w@example.com",
    roles: ["3"],
    lastActive: "2025-04-01T10:15:40Z",
    status: "inactive",
  },
  {
    id: "6",
    name: "Lisa Turner",
    email: "lisa.turner@example.com",
    roles: ["3"],
    lastActive: "2025-04-03T13:50:30Z",
    status: "active",
  },
  {
    id: "7",
    name: "James Miller",
    email: "james.m@example.com",
    roles: ["4"],
    lastActive: "2025-04-05T15:40:25Z",
    status: "active",
  },
  {
    id: "8",
    name: "Olivia Davis",
    email: "o.davis@example.com",
    roles: ["4", "5"],
    lastActive: "2025-04-02T09:30:15Z",
    status: "active",
  },
  {
    id: "9",
    name: "Daniel Brown",
    email: "daniel.brown@example.com",
    roles: ["5"],
    lastActive: "2025-03-30T11:20:10Z",
    status: "pending",
  },
  {
    id: "10",
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    roles: ["2", "3"],
    lastActive: "2025-04-04T14:10:35Z",
    status: "active",
  },
];
