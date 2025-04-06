import { useEffect, useState } from "react";
import { dummyStats, dummyRevenueData, dummyTransactions } from "../data/dummy";
import type { DashboardStats, RevenueData, Transaction } from "../types";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({} as DashboardStats);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      setStats(dummyStats);
      setRevenueData(dummyRevenueData);
      setTransactions(dummyTransactions.slice(0, 5)); // Show only 5 recent transactions
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const applyFilters = (filters: any) => {
    setIsLoading(true);
    // Simulate filtered data
    setTimeout(() => {
      let filtered = [...dummyTransactions];

      if (filters.status) {
        filtered = filtered.filter((t) => t.status === filters.status);
      }

      if (filters.paymentMethod) {
        filtered = filtered.filter(
          (t) => t.paymentMethod === filters.paymentMethod
        );
      }

      if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        filtered = filtered.filter((t) => {
          const date = new Date(t.date);
          return date >= start && date <= end;
        });
      }

      setTransactions(filtered.slice(0, 5));
      setIsLoading(false);
    }, 800);
  };

  return { stats, revenueData, transactions, isLoading, applyFilters };
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
