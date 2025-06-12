import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const TransactionModal = ({
  isOpen,
  onClose,
  onSave,
  transaction,
  categories,
}) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        _id: transaction._id,
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        type: transaction.type,
        categoryId: transaction.categoryId,
        date: new Date(transaction.date).toISOString().split("T")[0],
      });
    } else {
      setFormData({
        description: "",
        amount: "",
        type: "expense",
        categoryId: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả";
    }
    if (!formData.amount) {
      newErrors.amount = "Vui lòng nhập số tiền";
    } else if (
      isNaN(formData.amount) ||
      Number.parseFloat(formData.amount) <= 0
    ) {
      newErrors.amount = "Số tiền phải là số dương";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
    }
    if (!formData.date) {
      newErrors.date = "Vui lòng chọn ngày";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Prepare data for API
      const finalAmount =
        formData.type === "expense"
          ? -Math.abs(Number.parseFloat(formData.amount))
          : Math.abs(Number.parseFloat(formData.amount));

      const submissionData = {
        ...formData,
        amount: finalAmount,
      };

      onSave(submissionData);
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Stop propagation on modal click to prevent closing when clicking inside the modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
      {/* Backdrop - clicking this will close the modal */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div
        className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full mx-4 z-50"
        onClick={handleModalClick}
      >
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {transaction ? "Chỉnh sửa giao dịch" : "Giao dịch mới"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại giao dịch
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formData.type === "expense"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Chi tiêu</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formData.type === "income"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Thu nhập</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mô tả
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="VD: Mua thực phẩm"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số tiền
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₫</span>
                  </div>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className={`block w-full pl-7 pr-12 py-2 border ${
                      errors.amount ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="0"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              {/* Category - Dropdown */}
              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Danh mục
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.categoryId ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                >
                  <option value="">Chọn danh mục</option>
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.categoryId}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ngày
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.date ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
              >
                {transaction ? "Cập nhật" : "Tạo mới"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
