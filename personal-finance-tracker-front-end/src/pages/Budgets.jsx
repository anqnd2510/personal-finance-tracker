import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import BudgetCard from "../components/BudgetCard";
import BudgetModal from "../components/BudgetModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getBudgets } from "../services/budgets.service";
import { getCategories } from "../services/categories.service";

const Budgets = () => {
  const { accessToken } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both budgets and categories
        const [budgetsResponse, categoriesResponse] = await Promise.all([
          getBudgets(),
          getCategories(),
        ]);

        // Handle budgets response
        if (
          budgetsResponse &&
          budgetsResponse.isSuccess &&
          Array.isArray(budgetsResponse.data)
        ) {
          setBudgets(budgetsResponse.data);
        } else {
          console.warn("Unexpected budgets response format:", budgetsResponse);
          setBudgets([]);
        }

        // Handle categories response
        if (
          categoriesResponse &&
          categoriesResponse.isSuccess &&
          Array.isArray(categoriesResponse.data)
        ) {
          setCategories(categoriesResponse.data);

          // Create category mapping for quick lookup
          const mapping = {};
          categoriesResponse.data.forEach((category) => {
            mapping[category._id] = category.name;
          });
          setCategoryMap(mapping);
        } else {
          console.warn(
            "Unexpected categories response format:",
            categoriesResponse
          );
          setCategories([]);
          setCategoryMap({});
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu ngân sách");
        setBudgets([]);
        setCategories([]);
        setCategoryMap({});
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const handleOpenModal = (budget = null) => {
    setCurrentBudget(budget);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBudget(null);
  };

  const handleSaveBudget = async (budgetData) => {
    try {
      if (budgetData._id) {
        // Update existing budget - just update local state for now
        setBudgets((prev) =>
          prev.map((b) =>
            b._id === budgetData._id ? { ...b, ...budgetData } : b
          )
        );
      } else {
        // Create new budget - add to local state for now
        const newBudget = {
          ...budgetData,
          _id: Date.now().toString(), // Temporary ID
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setBudgets((prev) => [newBudget, ...prev]);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving budget:", err);
      setError("Không thể lưu ngân sách");
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ngân sách này không?")) {
      try {
        setBudgets((prev) => prev.filter((b) => b._id !== id));
      } catch (err) {
        console.error("Error deleting budget:", err);
        setError("Không thể xóa ngân sách");
      }
    }
  };

  // Calculate total budget statistics
  const totalBudgetLimit = budgets.reduce(
    (sum, budget) => sum + budget.limitAmount,
    0
  );
  const totalSpent = budgets.reduce(
    (sum, budget) => sum + Math.abs(budget.amount),
    0
  );
  const totalRemaining = totalBudgetLimit - totalSpent;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Ngân sách
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi ngân sách chi tiêu của bạn.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Tạo ngân sách mới
          </button>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">₫</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tổng ngân sách
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalBudgetLimit.toLocaleString("vi-VN")} ₫
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">-</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Đã chi tiêu
                    </dt>
                    <dd className="text-lg font-medium text-red-600">
                      {totalSpent.toLocaleString("vi-VN")} ₫
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">+</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Còn lại
                    </dt>
                    <dd
                      className={`text-lg font-medium ${
                        totalRemaining >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {totalRemaining.toLocaleString("vi-VN")} ₫
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              Chưa có ngân sách nào
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Tạo ngân sách đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget._id}
                budget={budget}
                categoryName={
                  categoryMap[budget.categoryId] || "Chưa phân loại"
                }
                onEdit={handleOpenModal}
                onDelete={handleDeleteBudget}
              />
            ))}
          </div>
        )}

        <BudgetModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveBudget}
          budget={currentBudget}
          categories={categories}
        />
      </div>
    </DashboardLayout>
  );
};

export default Budgets;
