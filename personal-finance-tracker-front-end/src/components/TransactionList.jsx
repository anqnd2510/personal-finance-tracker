import { useState } from "react";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const TransactionList = ({ transactions, categoryMap, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = transactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return Math.abs(amount).toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const getCategoryName = (categoryId) => {
    return categoryMap[categoryId] || "Chưa phân loại";
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeDetails = () => {
    setSelectedTransaction(null);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {selectedTransaction ? (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Chi tiết giao dịch
            </h3>
            <button
              onClick={closeDetails}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Close details"
            >
              <span className="text-sm text-blue-600 hover:text-blue-800">
                Quay lại danh sách
              </span>
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Mô tả</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {selectedTransaction.description}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Số tiền</dt>
                <dd
                  className={`mt-1 text-sm font-medium ${
                    selectedTransaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedTransaction.type === "income" ? "+" : "-"}
                  {formatAmount(selectedTransaction.amount)} ₫
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Danh mục</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {getCategoryName(selectedTransaction.categoryId)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Loại</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">
                  {selectedTransaction.type === "income"
                    ? "Thu nhập"
                    : "Chi tiêu"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Ngày</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(selectedTransaction.date)} lúc{" "}
                  {formatTime(selectedTransaction.date)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Tạo lúc</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(selectedTransaction.createdAt)} lúc{" "}
                  {formatTime(selectedTransaction.createdAt)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => onEdit(selectedTransaction)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Sửa
            </button>
            <button
              onClick={() => {
                onDelete(selectedTransaction._id);
                closeDetails();
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Xóa
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ngày
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mô tả
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Danh mục
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Số tiền
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Loại
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Không tìm thấy giao dịch nào
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCategoryName(transaction.categoryId)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatAmount(transaction.amount)} ₫
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type === "income"
                            ? "Thu nhập"
                            : "Chi tiêu"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleViewDetails(transaction)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => onEdit(transaction)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <PencilIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            onClick={() => onDelete(transaction._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị{" "}
                    <span className="font-medium">{startIndex + 1}</span> đến{" "}
                    <span className="font-medium">
                      {Math.min(startIndex + itemsPerPage, transactions.length)}
                    </span>{" "}
                    trong{" "}
                    <span className="font-medium">{transactions.length}</span>{" "}
                    kết quả
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <span className="sr-only">Trước</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <span className="sr-only">Sau</span>
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionList;
