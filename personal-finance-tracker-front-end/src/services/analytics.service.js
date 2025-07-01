import apiClient from "./apiClient";

const ANALYTICS_API_URL = "/analytics";
export const getAnalyticsOverview = async (period = "month", date = null) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for analytics");
      throw new Error("Cần đăng nhập để xem thống kê");
    }

    const params = new URLSearchParams({ period });
    if (date) {
      params.append("date", date);
    }

    const response = await apiClient.get(
      `${ANALYTICS_API_URL}/overview?${params}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Analytics overview response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    throw error;
  }
};

export const getCategoryAnalysis = async (period = "month", date = null) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for category analysis");
      throw new Error("Cần đăng nhập để xem phân tích danh mục");
    }

    const params = new URLSearchParams({ period });
    if (date) {
      params.append("date", date);
    }

    const response = await apiClient.get(
      `${ANALYTICS_API_URL}/category-analysis?${params}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Category analysis response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching category analysis:", error);
    throw error;
  }
};
