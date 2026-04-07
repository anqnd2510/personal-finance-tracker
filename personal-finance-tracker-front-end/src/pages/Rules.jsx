import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getRules, createRule, updateRule, deleteRule } from "../services/rules.service";
import { getCategories } from "../services/categories.service";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const initialForm = {
  name: "",
  descriptionContains: "",
  categoryId: "",
  priority: 100,
  isActive: true,
};

const Rules = () => {
  const [rules, setRules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [rulesResponse, categoriesResponse] = await Promise.all([
          getRules(),
          getCategories(),
        ]);

        const rulesData = Array.isArray(rulesResponse?.data)
          ? rulesResponse.data
          : [];
        const categoriesData = Array.isArray(categoriesResponse?.data)
          ? categoriesResponse.data
          : [];

        setRules(rulesData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching rules page data:", err);
        setError("Không thể tải dữ liệu quy tắc");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((category) => {
      map[category.id || category._id] = category.name;
    });
    return map;
  }, [categories]);

  const openCreateModal = () => {
    setEditingRule(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (rule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name || "",
      descriptionContains: rule.descriptionContains || "",
      categoryId: rule.categoryId || "",
      priority: rule.priority ?? 100,
      isActive: rule.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
    setFormData(initialForm);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.descriptionContains.trim() || !formData.categoryId) {
      setError("Vui lòng nhập đầy đủ name, từ khóa mô tả và category");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...formData,
        priority: Number(formData.priority) || 100,
      };

      if (editingRule) {
        const response = await updateRule(editingRule.id, payload);
        const updated = response?.data || payload;
        setRules((prev) =>
          prev.map((rule) => (rule.id === editingRule.id ? { ...rule, ...updated } : rule))
        );
      } else {
        const response = await createRule(payload);
        const created = response?.data;
        if (created) {
          setRules((prev) => [created, ...prev]);
        }
      }

      closeModal();
    } catch (err) {
      console.error("Error saving rule:", err);
      setError("Không thể lưu quy tắc");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ruleId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa quy tắc này không?")) {
      return;
    }

    try {
      await deleteRule(ruleId);
      setRules((prev) => prev.filter((rule) => rule.id !== ruleId));
    } catch (err) {
      console.error("Error deleting rule:", err);
      setError("Không thể xóa quy tắc");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Rules
            </h1>
            <p className="text-gray-600">
              Tự động gán category cho giao dịch dựa trên nội dung mô tả.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Tạo rule mới
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : rules.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-10 text-center text-gray-500">
            Chưa có rule nào. Hãy tạo rule đầu tiên để tự động phân loại giao dịch.
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Match Text
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {rule.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {rule.descriptionContains}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {categoryMap[rule.categoryId] || "Unknown category"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {rule.priority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rule.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {rule.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(rule)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(rule.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Xóa"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={closeModal}></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 z-10">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingRule ? "Chỉnh sửa rule" : "Tạo rule mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="VD: Shopee Auto Category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description contains</label>
                <input
                  name="descriptionContains"
                  value={formData.descriptionContains}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="VD: Shopee"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Chọn category</option>
                  {categories.map((category) => (
                    <option key={category.id || category._id} value={category.id || category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Kích hoạt rule
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 border border-transparent text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : editingRule ? "Cập nhật" : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Rules;
