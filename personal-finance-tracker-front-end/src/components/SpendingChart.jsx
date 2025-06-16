const SpendingChart = () => {
  // Mock data for the chart
  const data = [
    { month: "Tháng 1", income: 4000, expenses: 2400 },
    { month: "Tháng 2", income: 3000, expenses: 1398 },
    { month: "Tháng 3", income: 2000, expenses: 2800 },
    { month: "Tháng 4", income: 2780, expenses: 3908 },
    { month: "Tháng 5", income: 1890, expenses: 4800 },
    { month: "Tháng 6", income: 2390, expenses: 3800 },
  ];

  const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expenses]));

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thu nhập vs Chi tiêu
        </h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900">{item.month}</span>
                <div className="flex space-x-4 text-xs">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    Thu nhập: {item.income.toLocaleString("vi-VN")} ₫
                  </span>
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    Chi tiêu: {item.expenses.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
              <div className="relative h-8 bg-gray-100 rounded">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500 rounded"
                  style={{ width: `${(item.income / maxValue) * 100}%` }}
                ></div>
                <div
                  className="absolute top-0 left-0 h-full bg-red-500 rounded opacity-70"
                  style={{ width: `${(item.expenses / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;
