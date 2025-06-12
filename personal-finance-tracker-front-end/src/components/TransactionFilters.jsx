"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

const TransactionFilters = ({ filters, setFilters, categories }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        {/* Search bar */}
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm giao dịch..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Toggle filters button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FunnelIcon className="h-4 w-4 mr-2" />
          {isExpanded ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
        </button>
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {/* Type filter */}
          <div>
            <label
              htmlFor="type-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Loại
            </label>
            <select
              id="type-filter"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">Tất cả loại</option>
              <option value="income">Thu nhập</option>
              <option value="expense">Chi tiêu</option>
            </select>
          </div>

          {/* Date range filter */}
          <div>
            <label
              htmlFor="date-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Khoảng thời gian
            </label>
            <select
              id="date-filter"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label
              htmlFor="category-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Danh mục
            </label>
            <select
              id="category-filter"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort options */}
          <div>
            <label
              htmlFor="sort-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sắp xếp theo
            </label>
            <div className="flex space-x-2">
              <select
                id="sort-filter"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="date">Ngày</option>
                <option value="amount">Số tiền</option>
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="desc">Giảm dần</option>
                <option value="asc">Tăng dần</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
