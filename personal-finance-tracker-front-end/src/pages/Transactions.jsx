import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import TransactionList from "../components/TransactionList";
import TransactionFilters from "../components/TransactionFilters";
import TransactionModal from "../components/TransactionModal";
import { getTransactions } from "../services/transactions.service";
import { PlusIcon } from "@heroicons/react/24/outline";

const Transactions = () => {
  const { accessToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
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

  // Mock data for development - replace with API call
  const mockTransactions = [
    {
      _id: "1",
      description: "Grocery Shopping",
      amount: -85.32,
      type: "expense",
      categoryId: { _id: "c1", name: "Food & Dining" },
      date: "2024-06-15T10:30:00.000Z",
      createdAt: "2024-06-15T10:30:00.000Z",
    },
    {
      _id: "2",
      description: "Salary Deposit",
      amount: 3500.0,
      type: "income",
      categoryId: { _id: "c2", name: "Salary" },
      date: "2024-06-15T09:00:00.000Z",
      createdAt: "2024-06-15T09:00:00.000Z",
    },
    {
      _id: "3",
      description: "Electric Bill",
      amount: -120.45,
      type: "expense",
      categoryId: { _id: "c3", name: "Utilities" },
      date: "2024-06-14T14:20:00.000Z",
      createdAt: "2024-06-14T14:20:00.000Z",
    },
    {
      _id: "4",
      description: "Coffee Shop",
      amount: -12.5,
      type: "expense",
      categoryId: { _id: "c1", name: "Food & Dining" },
      date: "2024-06-14T08:15:00.000Z",
      createdAt: "2024-06-14T08:15:00.000Z",
    },
    {
      _id: "5",
      description: "Freelance Payment",
      amount: 750.0,
      type: "income",
      categoryId: { _id: "c4", name: "Freelance" },
      date: "2024-06-13T16:45:00.000Z",
      createdAt: "2024-06-13T16:45:00.000Z",
    },
    {
      _id: "6",
      description: "Movie Tickets",
      amount: -35.0,
      type: "expense",
      categoryId: { _id: "c5", name: "Entertainment" },
      date: "2024-06-12T19:30:00.000Z",
      createdAt: "2024-06-12T19:30:00.000Z",
    },
    {
      _id: "7",
      description: "Gas Station",
      amount: -45.75,
      type: "expense",
      categoryId: { _id: "c6", name: "Transportation" },
      date: "2024-06-11T12:15:00.000Z",
      createdAt: "2024-06-11T12:15:00.000Z",
    },
    {
      _id: "8",
      description: "Dividend Payment",
      amount: 120.0,
      type: "income",
      categoryId: { _id: "c7", name: "Investments" },
      date: "2024-06-10T10:00:00.000Z",
      createdAt: "2024-06-10T10:00:00.000Z",
    },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await getTransactions();
        // setTransactions(response.data);

        // Using mock data for now
        setTimeout(() => {
          setTransactions(mockTransactions);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions");
        setLoading(false);
      }
    };

    fetchTransactions();
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
        // Update existing transaction
        // await apiClient.put(`/transactions/${transactionData._id}`, transactionData, {
        //   headers: { Authorization: `Bearer ${accessToken}` }
        // });

        // Update local state
        setTransactions((prev) =>
          prev.map((t) =>
            t._id === transactionData._id ? { ...t, ...transactionData } : t
          )
        );
      } else {
        // Create new transaction
        // const response = await apiClient.post('/transactions', transactionData, {
        //   headers: { Authorization: `Bearer ${accessToken}` }
        // });

        // Mock response
        const newTransaction = {
          _id: `new-${Date.now()}`,
          ...transactionData,
          createdAt: new Date().toISOString(),
        };

        // Update local state
        setTransactions((prev) => [newTransaction, ...prev]);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving transaction:", err);
      // Handle error (show notification, etc.)
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        // await apiClient.delete(`/transactions/${id}`, {
        //   headers: { Authorization: `Bearer ${accessToken}` }
        // });

        // Update local state
        setTransactions((prev) => prev.filter((t) => t._id !== id));
      } catch (err) {
        console.error("Error deleting transaction:", err);
        // Handle error (show notification, etc.)
      }
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by type
    if (filters.type !== "all" && transaction.type !== filters.type) {
      return false;
    }

    // Filter by category
    if (
      filters.category !== "all" &&
      transaction.categoryId.name !== filters.category
    ) {
      return false;
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
      return (
        transaction.description.toLowerCase().includes(query) ||
        transaction.categoryId.name.toLowerCase().includes(query) ||
        transaction.amount.toString().includes(query)
      );
    }

    return true;
  });

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

  // Get unique categories for filter dropdown
  const categories = [...new Set(transactions.map((t) => t.categoryId.name))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Transactions
            </h1>
            <p className="text-gray-600">
              Manage and track your financial transactions.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Transaction
          </button>
        </div>

        <TransactionFilters
          filters={filters}
          setFilters={setFilters}
          categories={categories}
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
