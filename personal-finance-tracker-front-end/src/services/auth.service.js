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
