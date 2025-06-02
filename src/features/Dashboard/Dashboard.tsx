import { OverviewCards } from "../../components/data/OverviewCards";
import { RevenueChart } from "../../components/charts/RevenueChart";
import { RecentTransactions } from "../../components/data/RecentTransactions";
import { PaymentMethodsChart } from "../../components/charts/PaymentMethodsCharts";
import { TransactionFilters } from "../../components/forms/TransactionFilters";
import { useDashboard } from "../../hooks";

export const Dashboard = () => {
  const { stats, revenueData, transactions, isLoading, applyFilters } =
    useDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 dark:border-dark-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Dashboard Overview
      </h1>

      <OverviewCards data={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft dark:shadow-glass-dark border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Revenue Overview
          </h2>
          <RevenueChart data={revenueData} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft dark:shadow-glass-dark border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Payment Methods
          </h2>
          <PaymentMethodsChart data={stats.paymentMethods} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft dark:shadow-glass-dark border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Transaction Filters
          </h2>
          <TransactionFilters onSubmit={applyFilters} />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Recent Transactions
            </h2>
            <button className="text-sm text-primary-600 dark:text-dark-primary-400 hover:text-primary-800 dark:hover:text-dark-primary-300 transition-colors duration-200">
              View All
            </button>
          </div>
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
};
