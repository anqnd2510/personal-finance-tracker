import apiClient from "./apiClient";

const AUTH_API_URL = "/auths";

/**
 * Hàm đăng nhập người dùng
 * @param {Object} credentials - Thông tin đăng nhập
 * @param {string} credentials.email - Email
 * @param {string} credentials.password - Mật khẩu
 * @returns {Promise} - Promise chứa kết quả đăng nhập
 */
export const login = async (credentials) => {
  try {
    console.log("Calling login API with credentials:", credentials);

    const loginData = {
      email: credentials.email,
      password: credentials.password,
    };

    const response = await apiClient.post(`${AUTH_API_URL}/login`, loginData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Login API response:", response.data);

    const { data } = response.data; // bóc ra `data` từ response
    const { account, token } = data;

    if (token) {
      localStorage.setItem("accessToken", token);

      if (account?.email) {
        localStorage.setItem("userEmail", account.email);
      }

      const fullName = `${account.firstName ?? ""} ${
        account.lastName ?? ""
      }`.trim();
      if (fullName) {
        localStorage.setItem("userName", fullName);
      }

      console.log("Tên người dùng đã lưu vào localStorage:", fullName);
    }

    return {
      accessToken: token,
      ...account, // trả về thông tin account để FE có thể dùng
    };
  } catch (error) {
    console.error("Error in login:", error);
    throw error;
  }
};

/**
 * Hàm lấy thông tin người dùng hiện tại từ API
 * @returns {Promise} - Promise chứa thông tin người dùng
 */
export const getCurrentUser = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for getCurrentUser");
      return null;
    }

    const response = await apiClient.get(`${AUTH_API_URL}/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Current user API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    throw error;
  }
};

/**
 * Hàm đăng kí người dùng mới
 * @param {Object} userData - Thông tin người dùng mới
 * @return {Promise} - Promise chứa kết quả đăng kí
 * @throws {Error} - Ném lỗi nếu có vấn đề trong quá trình đăng kí
 */
export const register = async (userData) => {
  try {
    console.log("Calling register API with userData:", userData);

    const response = await apiClient.post(
      `${AUTH_API_URL}/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Register API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in register:", error);
    throw error;
  }
};
