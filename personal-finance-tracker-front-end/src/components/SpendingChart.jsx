const SpendingChart = () => {
  // Mock data for the chart
  const data = [
    { month: "Jan", income: 4000, expenses: 2400 },
    { month: "Feb", income: 3000, expenses: 1398 },
    { month: "Mar", income: 2000, expenses: 2800 },
    { month: "Apr", income: 2780, expenses: 3908 },
    { month: "May", income: 1890, expenses: 4800 },
    { month: "Jun", income: 2390, expenses: 3800 },
  ];

  const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expenses]));

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Income vs Expenses
        </h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900">{item.month}</span>
                <div className="flex space-x-4 text-xs">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    Income: ${item.income.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    Expenses: ${item.expenses.toLocaleString()}
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
