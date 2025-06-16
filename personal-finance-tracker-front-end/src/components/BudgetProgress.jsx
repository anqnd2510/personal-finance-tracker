import { PlusIcon } from "@heroicons/react/24/outline";

const BudgetProgress = ({ budgets = [] }) => {
  // Mock data if no budgets provided
  const mockBudgets =
    budgets.length > 0
      ? budgets
      : [
          {
            _id: "1",
            categoryId: { name: "Ăn uống" },
            amount: 450,
            limitAmount: 600,
          },
          {
            _id: "2",
            categoryId: { name: "Di chuyển" },
            amount: 180,
            limitAmount: 200,
          },
          {
            _id: "3",
            categoryId: { name: "Giải trí" },
            amount: 320,
            limitAmount: 250,
          },
        ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Tổng quan ngân sách
          </h3>
          <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-1" />
            Thêm ngân sách
          </button>
        </div>

        <div className="space-y-6">
          {mockBudgets.map((budget) => {
            const spent = budget.amount || 0;
            const limit = budget.limitAmount || 1;
            const percentage = (spent / limit) * 100;
            const isOverBudget = percentage > 100;

            return (
              <div key={budget._id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">
                    {budget.categoryId?.name || "Danh mục không xác định"}
                  </span>
                  <span
                    className={`font-medium ${
                      isOverBudget ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {spent.toLocaleString("vi-VN")} ₫ /{" "}
                    {limit.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      isOverBudget ? "bg-red-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{percentage.toFixed(0)}% đã sử dụng</span>
                  {isOverBudget ? (
                    <span className="text-red-600 font-medium">
                      Vượt {(spent - limit).toLocaleString("vi-VN")} ₫
                    </span>
                  ) : (
                    <span>Còn {(limit - spent).toLocaleString("vi-VN")} ₫</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetProgress;
