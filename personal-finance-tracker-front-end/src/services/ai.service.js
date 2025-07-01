import apiClient from "./apiClient";

const AI_API_URL = "/ai";

// Sửa lại hàm chatWithAi
export const chatWithAi = async (prompt) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for AI chat");
      throw new Error("Cần đăng nhập để sử dụng AI chat");
    }

    const response = await apiClient.post(
      `${AI_API_URL}/chat`,
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("AI API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
};

// ChatService cho FloatingChat component
export const chatService = {
  getAuthToken() {
    return localStorage.getItem("accessToken");
  },

  buildPrompt(messages, newMessage) {
    let conversationContext =
      "Bạn là trợ lý AI hữu ích cho ứng dụng quản lý tài chính cá nhân.\n\n";

    if (messages.length > 0) {
      conversationContext += "Cuộc trò chuyện trước:\n";

      const recentMessages = messages.slice(-6);

      recentMessages.forEach((msg) => {
        if (msg.role === "user") {
          conversationContext += `Người dùng: ${msg.content}\n`;
        } else if (msg.role === "assistant" && !msg.isError) {
          conversationContext += `Trợ lý: ${msg.content}\n`;
        }
      });

      conversationContext += "\n";
    }

    conversationContext += `Câu hỏi hiện tại: ${newMessage}\n\n`;
    conversationContext +=
      "Hãy trả lời hữu ích về tài chính cá nhân, ngân sách, hoặc quản lý tiền bạc bằng tiếng Việt:";

    return conversationContext;
  },

  async sendMessage(prompt) {
    try {
      const response = await chatWithAi(prompt);

      if (response.statusCode === 200 && response.isSuccess) {
        return {
          success: true,
          response: response.data,
          message: response.message,
        };
      } else {
        throw new Error(response.message || "Không thể lấy phản hồi từ AI");
      }
    } catch (error) {
      console.error("Error in sendMessage:", error);
      return {
        success: false,
        response: null,
        message: error.message || "Có lỗi xảy ra khi gọi AI",
        error: error,
      };
    }
  },

  isAuthenticated() {
    return !!this.getAuthToken();
  },
};
