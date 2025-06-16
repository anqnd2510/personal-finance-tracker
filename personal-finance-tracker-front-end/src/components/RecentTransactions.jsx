import {
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

const RecentTransactions = ({ transactions = [] }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Giao dịch gần đây
          </h3>
          <a
            href="/transactions"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Xem tất cả →
          </a>
        </div>

        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Không tìm thấy giao dịch nào
            </p>
          ) : (
            transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "income"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowDownLeftIcon className="h-4 w-4" />
                    ) : (
                      <ArrowUpRightIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {transaction.categoryId?.name || "Chưa phân loại"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`font-medium ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : ""}
                    {Math.abs(transaction.amount).toLocaleString("vi-VN")} ₫
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <EllipsisHorizontalIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
