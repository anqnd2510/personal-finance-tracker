import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import TransactionList from "../components/TransactionList";
import TransactionFilters from "../components/TransactionFilters";
import TransactionModal from "../components/TransactionModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  getTransactions,
  createTransaction,
} from "../services/transactions.service";
import { getCategories } from "../services/categories.service";

const Transactions = () => {
  const { accessToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    dateRange: "all",
    category: "all",
    sortBy: "date",
    sortOrder: "desc",
    searchQuery: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both transactions and categories
        const [transactionsResponse, categoriesResponse] = await Promise.all([
          getTransactions(),
          getCategories(),
        ]);

        // Handle transactions response
        if (
          transactionsResponse &&
          transactionsResponse.isSuccess &&
          Array.isArray(transactionsResponse.data)
        ) {
          setTransactions(transactionsResponse.data);
        } else {
          console.warn(
            "Unexpected transactions response format:",
            transactionsResponse
          );
          setTransactions([]);
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
        setError("Failed to load data");
        setTransactions([]);
        setCategories([]);
        setCategoryMap({});
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const handleOpenModal = (transaction = null) => {
    setCurrentTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTransaction(null);
  };

  const handleSaveTransaction = async (transactionData) => {
    try {
      if (transactionData._id) {
        // Update existing transaction - just update local state for now
        setTransactions((prev) =>
          prev.map((t) =>
            t._id === transactionData._id ? { ...t, ...transactionData } : t
          )
        );
      } else {
        // Create new transaction using API
        const response = await createTransaction(transactionData);

        if (response && response.data) {
          setTransactions((prev) => [response.data, ...prev]);
        } else if (response) {
          setTransactions((prev) => [response, ...prev]);
        }
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving transaction:", err);
      setError("Failed to save transaction");
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này không?")) {
      try {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
      } catch (err) {
        console.error("Error deleting transaction:", err);
        setError("Failed to delete transaction");
      }
    }
  };

  const filteredTransactions = Array.isArray(transactions)
    ? transactions.filter((transaction) => {
        // Filter by type
        if (filters.type !== "all" && transaction.type !== filters.type) {
          return false;
        }

        // Filter by category - now using category names
        if (filters.category !== "all") {
          const categoryName = categoryMap[transaction.categoryId];
          if (categoryName !== filters.category) {
            return false;
          }
        }

        // Filter by date range
        if (filters.dateRange !== "all") {
          const transactionDate = new Date(transaction.date);
          const today = new Date();
          const startOfToday = new Date(today.setHours(0, 0, 0, 0));

          if (filters.dateRange === "today" && transactionDate < startOfToday) {
            return false;
          }

          if (filters.dateRange === "week") {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            if (transactionDate < oneWeekAgo) {
              return false;
            }
          }

          if (filters.dateRange === "month") {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            if (transactionDate < oneMonthAgo) {
              return false;
            }
          }
        }

        // Filter by search query
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          const categoryName = categoryMap[transaction.categoryId] || "";
          return (
            transaction.description?.toLowerCase().includes(query) ||
            categoryName.toLowerCase().includes(query) ||
            transaction.amount?.toString().includes(query)
          );
        }

        return true;
      })
    : [];

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (filters.sortBy === "date") {
      return filters.sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    if (filters.sortBy === "amount") {
      return filters.sortOrder === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    return 0;
  });

  // Get unique category names for filter dropdown
  const categoryNames = categories.map((cat) => cat.name);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Giao dịch
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi các giao dịch tài chính của bạn.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Giao dịch mới
          </button>
        </div>

        <TransactionFilters
          filters={filters}
          setFilters={setFilters}
          categories={categoryNames}
        />

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
        ) : (
          <TransactionList
            transactions={sortedTransactions}
            categoryMap={categoryMap}
            onEdit={handleOpenModal}
            onDelete={handleDeleteTransaction}
          />
        )}

        <TransactionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTransaction}
          transaction={currentTransaction}
          categories={categories}
        />
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
