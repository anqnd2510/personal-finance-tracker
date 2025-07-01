import { PieChart } from "lucide-react";

const CategoryChart = ({ categoryData, period }) => {
  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-blue-600" />
          Phân tích theo danh mục
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
    }).format(amount);
  };

  const expenseCategories = categoryData.filter(
    (cat) => cat.type === "expense"
  );
  const incomeCategories = categoryData.filter((cat) => cat.type === "income");

  const totalExpense = expenseCategories.reduce(
    (sum, cat) => sum + cat.totalAmount,
    0
  );
  const totalIncome = incomeCategories.reduce(
    (sum, cat) => sum + cat.totalAmount,
    0
  );

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <PieChart className="h-5 w-5 text-blue-600" />
        Phân tích theo danh mục
      </h3>

      <div className="space-y-6">
        {/* Expense Categories */}
        {expenseCategories.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-red-600 mb-3">Chi tiêu</h4>
            <div className="space-y-3">
              {expenseCategories.map((category, index) => {
                const percentage =
                  totalExpense > 0
                    ? (category.totalAmount / totalExpense) * 100
                    : 0;
                return (
                  <div
                    key={category.categoryId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          colors[index % colors.length]
                        }`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {category.categoryName}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({category.transactionCount} giao dịch)
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(category.totalAmount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Income Categories */}
        {incomeCategories.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-green-600 mb-3">
              Thu nhập
            </h4>
            <div className="space-y-3">
              {incomeCategories.map((category, index) => {
                const percentage =
                  totalIncome > 0
                    ? (category.totalAmount / totalIncome) * 100
                    : 0;
                return (
                  <div
                    key={category.categoryId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          colors[index % colors.length]
                        }`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {category.categoryName}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({category.transactionCount} giao dịch)
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(category.totalAmount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryChart;
