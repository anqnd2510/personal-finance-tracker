"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getAnalyticsOverview,
  getCategoryAnalysis,
} from "../services/analytics.service";
import OverviewCards from "../components/analytics/OverviewCards";
import CategoryChart from "../components/analytics/CategoryChart";
import PeriodSelector from "../components/analytics/PeriodSelector";
import SavingsProgress from "../components/analytics/SavingsProgress";
import TransactionTrends from "../components/analytics/TransactionTrends";
import { BarChart3, TrendingUp } from "lucide-react";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    loading: true,
    overview: null,
    categoryData: [],
    error: null,
  });
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchAnalyticsData = async () => {
    try {
      setAnalyticsData((prev) => ({ ...prev, loading: true, error: null }));

      const [overviewResponse, categoryResponse] = await Promise.all([
        getAnalyticsOverview(selectedPeriod, selectedDate),
        getCategoryAnalysis(selectedPeriod, selectedDate),
      ]);

      setAnalyticsData({
        loading: false,
        overview: overviewResponse.data,
        categoryData: categoryResponse.data,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setAnalyticsData((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Có lỗi xảy ra khi tải dữ liệu",
      }));
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod, selectedDate]);

  const handlePeriodChange = (period, date) => {
    setSelectedPeriod(period);
    if (date) {
      setSelectedDate(date);
    }
  };

  if (analyticsData.loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (analyticsData.error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">⚠️ Có lỗi xảy ra</div>
          <p className="text-gray-600 mb-4">{analyticsData.error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Phân tích tài chính
            </h1>
            <p className="text-gray-600 mt-1">
              Thống kê chi tiết về thu chi và xu hướng tài chính của bạn
            </p>
          </div>
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            selectedDate={selectedDate}
            onPeriodChange={handlePeriodChange}
          />
        </div>

        {/* Overview Cards */}
        <OverviewCards
          overview={analyticsData.overview}
          period={selectedPeriod}
        />

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Savings Progress */}
          <div className="lg:col-span-1">
            <SavingsProgress overview={analyticsData.overview} />
          </div>

          {/* Category Breakdown */}
          <div className="lg:col-span-2">
            <CategoryChart
              categoryData={analyticsData.categoryData}
              period={selectedPeriod}
            />
          </div>
        </div>

        {/* Transaction Trends */}
        <TransactionTrends
          categoryData={analyticsData.categoryData}
          period={selectedPeriod}
        />

        {/* Summary Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Tóm tắt thống kê
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {
                  analyticsData.categoryData.filter(
                    (cat) => cat.type === "expense"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Danh mục chi tiêu</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  analyticsData.categoryData.filter(
                    (cat) => cat.type === "income"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Nguồn thu nhập</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analyticsData.overview?.transactionCount || 0}
              </div>
              <div className="text-sm text-gray-600">Tổng giao dịch</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
