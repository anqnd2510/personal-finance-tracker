import apiClient from "./apiClient";

const TRANSACTION_API_URL = "/transactions";

/**
 * Fetch all transactions from the API of the authenticated user.
 * @returns {Promise} - Promise containing the list of transactions
 */
export const getTransactions = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for getTransactions");
      return [];
    }

    const response = await apiClient.get(TRANSACTION_API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Transactions API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

/**
 * Fetch a single transaction by ID.
 * @param {string} transactionId - The ID of the transaction to fetch
 * @return {Promise} - Promise containing the transaction data
 */
export const getTransactionById = async (transactionId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for getTransactionById");
      return null;
    }

    const response = await apiClient.get(
      `${TRANSACTION_API_URL}/${transactionId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Transaction API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);
    throw error;
  }
};
/**
 * Create a new transaction.
 * @param {Object} transactionData - The data of the transaction to create
 * @returns {Promise} - Promise containing the created transaction
 */
export const createTransaction = async (transactionData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for createTransaction");
      return null;
    }

    const response = await apiClient.post(
      `${TRANSACTION_API_URL}/create-transaction`,
      transactionData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Create Transaction API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};
