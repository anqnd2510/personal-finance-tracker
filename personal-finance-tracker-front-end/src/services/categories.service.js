import apiClient from "./apiClient";

const CATEGORY_API_URL = "/categories";

/**
 * Fetch all categories from the API.
 * @returns {Promise} - Promise containing the list of categories
 */
export const getCategories = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for getCategories");
      return [];
    }

    const response = await apiClient.get(CATEGORY_API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Categories API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
/**
 * Fetch a single category by ID.
 * @param {string} categoryId - The ID of the category to fetch
 * @return {Promise} - Promise containing the category data
 */
export const getCategoryById = async (categoryId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for getCategoryById");
      return null;
    }

    const response = await apiClient.get(`${CATEGORY_API_URL}/${categoryId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Category API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error;
  }
};
/**
 * Create a new category.
 * @param {Object} categoryData - The data for the new category
 * @return {Promise} - Promise containing the created category data
 */
export const createCategory = async (categoryData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for createCategory");
      return null;
    }

    const response = await apiClient.post(
      `${CATEGORY_API_URL}/create-category`,
      categoryData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Create Category API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};
/**
 * Update an existing category.
 * @param {string} categoryId - The ID of the category to update
 * @param {Object} categoryData - The updated data for the category
 * @return {Promise} - Promise containing the updated category data
 */
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for updateCategory");
      return null;
    }

    const response = await apiClient.put(
      `${CATEGORY_API_URL}/${categoryId}`,
      categoryData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Update Category API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
/**
 * Delete a category by ID.
 * @param {string} categoryId - The ID of the category to delete
 * @return {Promise} - Promise indicating the deletion status
 */
export const deleteCategory = async (categoryId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for deleteCategory");
      return null;
    }

    const response = await apiClient.delete(
      `${CATEGORY_API_URL}/${categoryId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Delete Category API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
