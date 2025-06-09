import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import OverviewCards from "../components/OverviewCards";
import RecentTransactions from "../components/RecentTransactions";
import BudgetProgress from "../components/BudgetProgress";
import SpendingChart from "../components/SpendingChart";
import CategoryBreakdown from "../components/CategoryBreakdown";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    loading: true,
    stats: null,
    transactions: [],
    budgets: [],
  });

  useEffect(() => {
    // Simulate API call - replace with your actual API calls
    const fetchDashboardData = async () => {
      try {
        // You can replace these with actual API calls using your apiClient
        const mockData = {
          stats: {
            totalBalance: 12345.67,
            monthlyIncome: 5432.1,
            monthlyExpenses: 3210.45,
            budgetRemaining: 1876.22,
          },
          transactions: [
            {
              _id: "1",
              description: "Grocery Shopping",
              amount: -85.32,
              type: "expense",
              categoryId: { name: "Food & Dining" },
              date: "2024-01-15",
            },
            {
              _id: "2",
              description: "Salary Deposit",
              amount: 3500.0,
              type: "income",
              categoryId: { name: "Salary" },
              date: "2024-01-15",
            },
          ],
          budgets: [
            {
              _id: "1",
              categoryId: { name: "Food & Dining" },
              amount: 450,
              limitAmount: 600,
            },
          ],
        };

        setDashboardData({
          loading: false,
          ...mockData,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  if (dashboardData.loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's your financial overview.
          </p>
        </div>

        <OverviewCards stats={dashboardData.stats} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <SpendingChart />
          </div>
          <div className="col-span-3">
            <CategoryBreakdown />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <RecentTransactions transactions={dashboardData.transactions} />
          <BudgetProgress budgets={dashboardData.budgets} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
