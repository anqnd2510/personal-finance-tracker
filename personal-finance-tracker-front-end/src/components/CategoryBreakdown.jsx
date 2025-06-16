const CategoryBreakdown = () => {
  const categories = [
    { name: "Ăn uống", amount: 450, percentage: 35, color: "bg-blue-500" },
    { name: "Di chuyển", amount: 180, percentage: 14, color: "bg-green-500" },
    { name: "Giải trí", amount: 320, percentage: 25, color: "bg-purple-500" },
    { name: "Tiện ích", amount: 200, percentage: 16, color: "bg-orange-500" },
    { name: "Mua sắm", amount: 130, percentage: 10, color: "bg-pink-500" },
  ];

  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Chi tiêu theo danh mục
        </h3>

        <div className="space-y-4">
          {/* Simple pie chart representation */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-purple-500 via-orange-500 to-pink-500"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {total.toLocaleString("vi-VN")} ₫
                </div>
                <div className="text-xs text-gray-500">Tổng</div>
              </div>
            </div>
          </div>

          {/* Category list */}
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${category.color}`}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">
                    {category.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {category.amount.toLocaleString("vi-VN")} ₫
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
