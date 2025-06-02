import {
  ArrowDownIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "lucide-react";
import { DashboardStats } from "../../types";

type CardProps = {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
};

const Card = ({ title, value, change, icon }: CardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft dark:shadow-glass-dark border border-gray-200 dark:border-gray-700 p-6 hover:shadow-soft-lg dark:hover:shadow-glass transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-1">
          {value}
        </p>
        <div
          className={`flex items-center mt-2 ${
            change >= 0
              ? "text-success-600 dark:text-success-400"
              : "text-error-600 dark:text-error-400"
          }`}
        >
          {change >= 0 ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <ArrowDownIcon className="h-4 w-4" />
          )}
          <span className="text-sm ml-1">
            {Math.abs(change)}% vs last period
          </span>
        </div>
      </div>
      <div className="p-3 rounded-full bg-primary-50 dark:bg-dark-primary-900/20 text-primary-600 dark:text-dark-primary-400 backdrop-blur-sm border border-primary-100 dark:border-dark-primary-800/30">
        {icon}
      </div>
    </div>
  </div>
);

export const OverviewCards = ({ data }: { data: DashboardStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        title="Total Revenue"
        value={`$${data.totalRevenue.toLocaleString()}`}
        change={data.revenueChange}
        icon={<CurrencyDollarIcon className="h-6 w-6" />}
      />
      <Card
        title="Transactions"
        value={data.totalTransactions.toLocaleString()}
        change={data.transactionsChange}
        icon={<ShoppingCartIcon className="h-6 w-6" />}
      />
      <Card
        title="Successful Payments"
        value={data.successfulPayments.toLocaleString()}
        change={data.successRateChange}
        icon={<CheckCircleIcon className="h-6 w-6" />}
      />
      <Card
        title="Refunds"
        value={data.refunds.toLocaleString()}
        change={data.refundRateChange}
        icon={<ArrowPathIcon className="h-6 w-6" />}
      />
    </div>
  );
};
