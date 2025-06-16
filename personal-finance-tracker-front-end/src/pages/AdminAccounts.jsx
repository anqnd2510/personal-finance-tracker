import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import AccountList from "../components/AccountList";
import AccountModal from "../components/AccountModal";
import AccountFilters from "../components/AccountFilters";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../services/accounts.service";

const AdminAccounts = () => {
  const { accessToken, user, isAdmin } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    searchQuery: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Helper function để check admin role (support cả "admin" và "ADMIN")
  const isAdminRole = (role) => {
    return role?.toLowerCase() === "admin";
  };

  // Debug: Log user info
  console.log("AdminAccounts - User:", user);
  console.log("AdminAccounts - Is Admin:", isAdmin());
  console.log("AdminAccounts - Access Token:", accessToken ? "exists" : "none");

  // Check if user is admin
  const isAdminUser = isAdmin();

  useEffect(() => {
    if (!isAdminUser) {
      console.log("AdminAccounts - User is not admin, role:", user?.role);
      setError("Bạn không có quyền truy cập trang này");
      setLoading(false);
      return;
    }

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("AdminAccounts - Starting to fetch accounts...");
        const response = await getAccounts();
        console.log("AdminAccounts - getAccounts response:", response);

        if (response && response.isSuccess && Array.isArray(response.data)) {
          console.log("AdminAccounts - Setting accounts:", response.data);
          setAccounts(response.data);
        } else {
          console.warn(
            "AdminAccounts - Unexpected accounts response format:",
            response
          );
          setAccounts([]);
          setError(
            "Không thể tải danh sách tài khoản - định dạng response không đúng"
          );
        }

        setLoading(false);
      } catch (err) {
        console.error("AdminAccounts - Error fetching accounts:", err);
        setError(`Không thể tải danh sách tài khoản: ${err.message}`);
        setAccounts([]);
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [accessToken, isAdminUser, user]);

  const handleOpenModal = (account = null) => {
    setCurrentAccount(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAccount(null);
  };

  const handleSaveAccount = async (accountData) => {
    try {
      if (currentAccount) {
        // Update existing account
        const response = await updateAccount(currentAccount._id, accountData);

        if (response && (response.isSuccess || response.data)) {
          const updatedAccount = response.data || response;
          setAccounts((prev) =>
            prev.map((acc) =>
              acc._id === currentAccount._id ? updatedAccount : acc
            )
          );
        }
      } else {
        // Create new account
        const response = await createAccount(accountData);

        if (response && (response.isSuccess || response.data)) {
          const newAccount = response.data || response;
          setAccounts((prev) => [newAccount, ...prev]);
        }
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving account:", err);
      setError("Không thể lưu tài khoản");
    }
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) {
      try {
        const response = await deleteAccount(id);

        if (response && response.isSuccess !== false) {
          setAccounts((prev) => prev.filter((acc) => acc._id !== id));
        } else {
          setError("Không thể xóa tài khoản");
        }
      } catch (err) {
        console.error("Error deleting account:", err);
        setError("Không thể xóa tài khoản");
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const response = await updateAccount(id, { isActive: newStatus });

      if (response && (response.isSuccess || response.data)) {
        setAccounts((prev) =>
          prev.map((acc) =>
            acc._id === id ? { ...acc, isActive: newStatus } : acc
          )
        );
      }
    } catch (err) {
      console.error("Error toggling account status:", err);
      setError("Không thể thay đổi trạng thái tài khoản");
    }
  };

  // Filter accounts
  const filteredAccounts = Array.isArray(accounts)
    ? accounts.filter((account) => {
        // Filter by role - sử dụng helper function
        if (filters.role !== "all") {
          if (filters.role === "admin" && !isAdminRole(account.role)) {
            return false;
          }
          if (filters.role === "user" && isAdminRole(account.role)) {
            return false;
          }
        }

        // Filter by status
        if (filters.status !== "all") {
          if (filters.status === "active" && !account.isActive) return false;
          if (filters.status === "inactive" && account.isActive) return false;
        }

        // Filter by search query
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          return (
            account.firstName?.toLowerCase().includes(query) ||
            account.lastName?.toLowerCase().includes(query) ||
            account.email?.toLowerCase().includes(query) ||
            account.phoneNumber?.includes(query)
          );
        }

        return true;
      })
    : [];

  // Sort accounts
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (filters.sortBy === "createdAt") {
      return filters.sortOrder === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (filters.sortBy === "name") {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return filters.sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
    if (filters.sortBy === "email") {
      return filters.sortOrder === "asc"
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    }
    return 0;
  });

  // Calculate statistics - sử dụng helper function
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter((acc) => acc.isActive).length;
  const inactiveAccounts = totalAccounts - activeAccounts;
  const adminAccounts = accounts.filter((acc) => isAdminRole(acc.role)).length;

  if (!isAdminUser) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-600 text-lg mb-4">Truy cập bị từ chối</div>
          <p className="text-gray-600">
            Bạn không có quyền truy cập trang quản lý tài khoản.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>User role: {user?.role || "undefined"}</p>
            <p>Is Admin: {isAdminUser ? "true" : "false"}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Quản lý tài khoản
            </h1>
            <p className="text-gray-600">
              Quản lý tất cả tài khoản người dùng trong hệ thống.
            </p>
            {/* Debug info */}
            <div className="mt-2 text-xs text-gray-500">
              <p>Total accounts loaded: {accounts.length}</p>
              <p>Loading: {loading ? "true" : "false"}</p>
              <p>Error: {error || "none"}</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Tạo tài khoản mới
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">#</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tổng tài khoản
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalAccounts}
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
                    <span className="text-white text-sm font-medium">✓</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Đang hoạt động
                    </dt>
                    <dd className="text-lg font-medium text-green-600">
                      {activeAccounts}
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
                    <span className="text-white text-sm font-medium">✗</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Không hoạt động
                    </dt>
                    <dd className="text-lg font-medium text-red-600">
                      {inactiveAccounts}
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
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">@</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Quản trị viên
                    </dt>
                    <dd className="text-lg font-medium text-purple-600">
                      {adminAccounts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AccountFilters filters={filters} setFilters={setFilters} />

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
          <AccountList
            accounts={sortedAccounts}
            onEdit={handleOpenModal}
            onDelete={handleDeleteAccount}
            onToggleStatus={handleToggleStatus}
          />
        )}

        <AccountModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveAccount}
          account={currentAccount}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminAccounts;
