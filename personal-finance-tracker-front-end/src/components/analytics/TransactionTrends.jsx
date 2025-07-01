import { BarChart3 } from "lucide-react";

const TransactionTrends = ({ categoryData, period }) => {
  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Xu hướng giao dịch
        </h3>
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu để hiển thị
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
    }).format(amount);
  };

  // Sort categories by amount (descending)
  const sortedCategories = [...categoryData].sort(
    (a, b) => b.totalAmount - a.totalAmount
  );
  const maxAmount = sortedCategories[0]?.totalAmount || 1;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        Xu hướng giao dịch theo danh mục
      </h3>

      <div className="space-y-4">
        {sortedCategories.map((category, index) => {
          const percentage = (category.totalAmount / maxAmount) * 100;
          const isExpense = category.type === "expense";

          return (
            <div key={category.categoryId} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {category.categoryName}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isExpense
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {isExpense ? "Chi" : "Thu"}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(category.totalAmount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.transactionCount} giao dịch
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isExpense ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionTrends;
