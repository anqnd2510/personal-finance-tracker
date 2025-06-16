import apiClient from "./apiClient";

const BUDGET_API_URL = "/budgets";
/**
 * Fetch all budgets from the API.
 * @returns {Promise} - Promise containing the list of budgets
 */
export const getBudgets = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for getBudgets");
      return [];
    }

    const response = await apiClient.get(BUDGET_API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Budgets API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw error;
  }
};
/**
 * Fetch a single budget by ID.
 * @param {string} budgetId - The ID of the budget to fetch
 * @return {Promise} - Promise containing the budget data
 */
export const getBudgetById = async (budgetId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for getBudgetById");
      return null;
    }

    const response = await apiClient.get(`${BUDGET_API_URL}/${budgetId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Budget API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching budget by ID:", error);
    throw error;
  }
};
/**
 * Create a new budget.
 * @param {Object} budgetData - The budget data to create
 * @returns {Promise} - Promise containing the created budget
 */
export const createBudget = async (budgetData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for createBudget");
      return null;
    }

    const response = await apiClient.post(
      `${BUDGET_API_URL}/create-budget`,
      budgetData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Created budget:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
};
/**
 * Update an existing budget.
 * @param {string} budgetId - The ID of the budget to update
 * @param {Object} budgetData - The updated budget data
 * @returns {Promise} - Promise containing the updated budget
 */
export const updateBudget = async (budgetId, budgetData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for updateBudget");
      return null;
    }

    const response = await apiClient.put(
      `${BUDGET_API_URL}/update-budget/${budgetId}`,
      budgetData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Updated budget:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating budget:", error);
    throw error;
  }
};
/**
 * Delete a budget by ID.
 * @param {string} budgetId - The ID of the budget to delete
 * @returns {Promise} - Promise indicating the deletion status
 */
export const deleteBudget = async (budgetId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for deleteBudget");
      return null;
    }

    const response = await apiClient.delete(
      `${BUDGET_API_URL}/delete-budget/${budgetId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Deleted budget:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting budget:", error);
    throw error;
  }
};
