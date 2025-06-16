import apiClient from "./apiClient";

const ACCOUNTS_API_URL = "/auths/accounts";

/**
 * Fetch all accounts from the API (Admin only).
 * @returns {Promise} - Promise containing the list of accounts
 */
export const getAccounts = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for getAccounts");
      return { isSuccess: false, data: [] };
    }

    console.log("getAccounts - Making request to:", ACCOUNTS_API_URL);
    console.log("getAccounts - Using token:", accessToken ? "exists" : "none");

    const response = await apiClient.get(ACCOUNTS_API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("getAccounts - Full response:", response);
    console.log("getAccounts - Response data:", response.data);

    // Kiểm tra cấu trúc response từ Swagger
    if (response.data && response.data.data && response.data.data.accounts) {
      return {
        isSuccess: true,
        data: response.data.data.accounts,
      };
    } else if (response.data && Array.isArray(response.data)) {
      return {
        isSuccess: true,
        data: response.data,
      };
    } else {
      console.warn("Unexpected response structure:", response.data);
      return {
        isSuccess: false,
        data: [],
      };
    }
  } catch (error) {
    console.error("Error fetching accounts:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

/**
 * Fetch a single account by ID.
 * @param {string} accountId - The ID of the account to fetch
 * @return {Promise} - Promise containing the account data
 */
export const getAccountById = async (accountId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for getAccountById");
      return null;
    }

    const response = await apiClient.get(`${ACCOUNTS_API_URL}/${accountId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Account API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching account by ID:", error);
    throw error;
  }
};
/**
 * Create a new account (Admin only).
 * @param {Object} accountData - The account data to create
 * @returns {Promise} - Promise containing the created account
 */
export const createAccount = async (accountData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for createAccount");
      return null;
    }

    const response = await apiClient.post(
      `${ACCOUNTS_API_URL}/create`,
      accountData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Created account:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};
/**
 * Update an existing account (Admin only).
 * @param {string} accountId - The ID of the account to update
 * @param {Object} accountData - The updated account data
 * @returns {Promise} - Promise containing the updated account
 */
export const updateAccount = async (accountId, accountData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for updateAccount");
      return null;
    }

    const response = await apiClient.put(
      `${ACCOUNTS_API_URL}/${accountId}`,
      accountData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Updated account:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
};

/**
 * Delete an account by ID (Admin only).
 * @param {string} accountId - The ID of the account to delete
 * @returns {Promise} - Promise indicating the deletion status
 */
export const deleteAccount = async (accountId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for deleteAccount");
      return null;
    }

    const response = await apiClient.delete(
      `${ACCOUNTS_API_URL}/${accountId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Deleted account:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

/**
 * Deactivate an account by ID (Admin only).
 * @param {string} accountId - The ID of the account to deactivate
 * @returns {Promise} - Promise indicating the deletion status
 */
export const deactivateAccount = async (accountId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for deactivateAccount");
      return null;
    }

    const response = await apiClient.patch(
      `${ACCOUNTS_API_URL}/${accountId}/deactivate`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Deactivated account:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deactivating account:", error);
    throw error;
  }
};
/**
 * Activate an account by ID (Admin only).
 * @param {string} accountId - The ID of the account to activate
 * @returns {Promise} - Promise indicating the activation status
 */
export const activateAccount = async (accountId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for activateAccount");
      return null;
    }

    const response = await apiClient.patch(
      `${ACCOUNTS_API_URL}/${accountId}/activate`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("activated account:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error reactivating account:", error);
    throw error;
  }
};
