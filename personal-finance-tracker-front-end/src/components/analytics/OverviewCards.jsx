import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";

const OverviewCards = ({ overview, period }) => {
  if (!overview) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getPeriodText = (period) => {
    switch (period) {
      case "day":
        return "hôm nay";
      case "week":
        return "tuần này";
      case "month":
        return "tháng này";
      case "year":
        return "năm này";
      default:
        return period;
    }
  };

  const netAmount = overview.totalIncome - overview.totalExpense;
  const isPositive = netAmount >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Income */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Thu nhập {getPeriodText(period)}
            </p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(overview.totalIncome)}
            </p>
          </div>
          <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Total Expense */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Chi tiêu {getPeriodText(period)}
            </p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(overview.totalExpense)}
            </p>
          </div>
          <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
            <TrendingDown className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Net Amount */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Số dư ròng</p>
            <p
              className={`text-2xl font-bold ${
                isPositive ? "text-blue-600" : "text-red-600"
              }`}
            >
              {formatCurrency(netAmount)}
            </p>
          </div>
          <div
            className={`h-12 w-12 rounded-lg flex items-center justify-center ${
              isPositive ? "bg-blue-100" : "bg-red-100"
            }`}
          >
            <DollarSign
              className={`h-6 w-6 ${
                isPositive ? "text-blue-600" : "text-red-600"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Savings Percentage */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Tỷ lệ tiết kiệm</p>
            <p className="text-2xl font-bold text-purple-600">
              {overview.savingPercentage}%
            </p>
          </div>
          <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <PieChart className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewCards;
