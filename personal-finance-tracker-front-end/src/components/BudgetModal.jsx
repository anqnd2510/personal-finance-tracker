import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const BudgetModal = ({ isOpen, onClose, onSave, budget, categories }) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    limitAmount: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (budget) {
      setFormData({
        _id: budget._id,
        categoryId: budget.categoryId,
        limitAmount: budget.limitAmount.toString(),
      });
    } else {
      setFormData({
        categoryId: "",
        limitAmount: "",
      });
    }
    setErrors({});
  }, [budget]);

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
    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
    }
    if (!formData.limitAmount) {
      newErrors.limitAmount = "Vui lòng nhập số tiền ngân sách";
    } else if (
      isNaN(formData.limitAmount) ||
      Number.parseFloat(formData.limitAmount) <= 0
    ) {
      newErrors.limitAmount = "Số tiền phải là số dương";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData = {
        ...formData,
        limitAmount: Number.parseFloat(formData.limitAmount),
        amount: budget ? budget.amount : 0, // Keep existing amount or start with 0
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
              {budget ? "Chỉnh sửa ngân sách" : "Tạo ngân sách mới"}
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
              {/* Category */}
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

              {/* Budget Limit */}
              <div>
                <label
                  htmlFor="limitAmount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số tiền ngân sách
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₫</span>
                  </div>
                  <input
                    type="text"
                    id="limitAmount"
                    name="limitAmount"
                    value={formData.limitAmount}
                    onChange={handleChange}
                    className={`block w-full pl-7 pr-12 py-2 border ${
                      errors.limitAmount ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="0"
                  />
                </div>
                {errors.limitAmount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.limitAmount}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
              >
                {budget ? "Cập nhật" : "Tạo mới"}
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

export default BudgetModal;
