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
