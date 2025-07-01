import { Target } from "lucide-react";

const SavingsProgress = ({ overview }) => {
  if (!overview) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const savingsAmount = overview.totalIncome - overview.totalExpense;
  const savingsPercentage = overview.savingPercentage || 0;

  const getProgressColor = (percentage) => {
    if (percentage >= 20) return "bg-green-500";
    if (percentage >= 10) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressMessage = (percentage) => {
    if (percentage >= 20) return "Tuyệt vời! Bạn đang tiết kiệm rất tốt 🎉";
    if (percentage >= 10) return "Khá tốt! Hãy cố gắng tiết kiệm thêm 💪";
    if (percentage > 0) return "Bắt đầu tốt! Hãy tăng tỷ lệ tiết kiệm 📈";
    return "Cần cải thiện kế hoạch tài chính ⚠️";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Target className="h-5 w-5 text-blue-600" />
        Tiến độ tiết kiệm
      </h3>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tỷ lệ tiết kiệm</span>
            <span>{savingsPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                savingsPercentage
              )}`}
              style={{ width: `${Math.min(savingsPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Savings Amount */}
        <div className="text-center py-4">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(savingsAmount)}
          </div>
          <div className="text-sm text-gray-600">Số tiền tiết kiệm được</div>
        </div>

        {/* Progress Message */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700 text-center">
            {getProgressMessage(savingsPercentage)}
          </p>
        </div>

        {/* Savings Tips */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            💡 Mẹo tiết kiệm:
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Mục tiêu lý tưởng: 20% thu nhập</li>
            <li>• Tự động chuyển tiền tiết kiệm</li>
            <li>• Theo dõi chi tiêu hàng ngày</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SavingsProgress;
