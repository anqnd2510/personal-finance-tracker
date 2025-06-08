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
    console.log("Login data to be sent:", loginData);
    const response = await apiClient.post(`${AUTH_API_URL}/login`, loginData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Login API response:", response.data);

    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      // Lưu email người dùng vào localStorage
      if (credentials.email) {
        console.log("Lưu email người dùng:", credentials.email);
        localStorage.setItem("userEmail", credentials.email);
      }

      // Lưu tên người dùng vào localStorage
      if (response.data.fullName) {
        console.log("Lưu tên người dùng từ API:", response.data.fullName);
        localStorage.setItem("userName", response.data.fullName);
      } else if (credentials.email === "bob@example.com") {
        // Hardcode tên cho tài khoản bob@example.com
        console.log("Lưu tên người dùng hardcode cho bob@example.com");
        localStorage.setItem("userName", "Bob Chen");
      } else if (credentials.email) {
        // Nếu không có fullName, sử dụng email làm tên người dùng
        const userName = credentials.email.split("@")[0];
        console.log("Lưu tên người dùng từ email:", userName);
        localStorage.setItem("userName", userName);
      }

      // In ra giá trị đã lưu để debug
      console.log(
        "Tên người dùng đã lưu vào localStorage:",
        localStorage.getItem("userName")
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error in login:", error);
    throw error;
  }
};
