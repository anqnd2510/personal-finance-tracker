import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const BudgetCard = ({ budget, categoryName, onEdit, onDelete }) => {
  const spent = Math.abs(budget.amount);
  const limit = budget.limitAmount;
  const remaining = limit - spent;
  const percentage = (spent / limit) * 100;
  const isOverBudget = percentage > 100;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{categoryName}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(budget)}
              className="text-blue-600 hover:text-blue-800 p-1 rounded"
              title="Chỉnh sửa"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(budget._id)}
              className="text-red-600 hover:text-red-800 p-1 rounded"
              title="Xóa"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Đã chi tiêu</span>
            <span
              className={`font-medium ${
                isOverBudget ? "text-red-600" : "text-gray-900"
              }`}
            >
              {spent.toLocaleString("vi-VN")} ₫
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Ngân sách</span>
            <span className="font-medium text-gray-900">
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

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              {percentage.toFixed(1)}% đã sử dụng
            </span>
            {isOverBudget ? (
              <span className="text-red-600 font-medium">
                Vượt {(spent - limit).toLocaleString("vi-VN")} ₫
              </span>
            ) : (
              <span className="text-green-600 font-medium">
                Còn {remaining.toLocaleString("vi-VN")} ₫
              </span>
            )}
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Tạo: {formatDate(budget.createdAt)}</span>
              <span>Cập nhật: {formatDate(budget.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
