import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, AlertCircle } from "lucide-react";
import { chatService } from "../services/ai.service";
import { QuickFinanceQuestions } from "./QuickFinanceQuestions";

// Component để format markdown-like text
const FormattedMessage = ({ content }) => {
  // Hàm để format text với markdown-like syntax
  const formatText = (text) => {
    // Split text thành các dòng
    const lines = text.split("\n");
    const formattedLines = [];

    lines.forEach((line, index) => {
      // Headers (###)
      if (line.startsWith("### ")) {
        formattedLines.push(
          <h3
            key={index}
            className="text-base font-bold text-blue-700 mt-4 mb-2 first:mt-0"
          >
            {line.replace("### ", "").replace(/\*\*/g, "")}
          </h3>
        );
      }
      // Subheaders với **text:**
      else if (line.includes("**") && line.includes(":")) {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        formattedLines.push(
          <p
            key={index}
            className="font-semibold text-gray-800 mt-3 mb-1"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      }
      // List items bắt đầu với -
      else if (line.trim().startsWith("- ")) {
        const cleanLine = line
          .replace(/^- /, "")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        formattedLines.push(
          <li
            key={index}
            className="ml-4 mb-2 text-gray-700 list-disc"
            dangerouslySetInnerHTML={{ __html: cleanLine }}
          />
        );
      }
      // Empty lines
      else if (line.trim() === "") {
        formattedLines.push(<br key={index} />);
      }
      // Regular paragraphs
      else if (line.trim()) {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        formattedLines.push(
          <p
            key={index}
            className="text-gray-700 mb-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      }
    });

    return formattedLines;
  };

  return <div className="space-y-1">{formatText(content)}</div>;
};

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollAreaRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setError(null);
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickQuestion = (question) => {
    setInput(question);
    // Hoặc tự động submit luôn:
    // handleSubmit({ preventDefault: () => {} })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const prompt =
        messages.length > 0
          ? chatService.buildPrompt(messages, userMessage.content)
          : `Bạn là trợ lý AI hữu ích cho ứng dụng quản lý tài chính cá nhân. Hãy giúp người dùng với câu hỏi: ${userMessage.content}`;

      const result = await chatService.sendMessage(prompt);

      if (result.success) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.response,
        };

        setMessages([...newMessages, assistantMessage]);
      } else {
        throw new Error(result.message || "Không thể lấy phản hồi");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setError(error.message);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
        isError: true,
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={toggleChat}
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Mở AI Chat</span>
          </button>
        )}

        {/* Chat Interface - Made larger for better readability */}
        {isOpen && (
          <div className="w-96 h-[500px] shadow-2xl border-0 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex flex-row items-center justify-between space-y-0 pb-3 pt-3 px-4 bg-blue-600 text-white">
              <div className="text-sm font-medium flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Trợ lý AI Tài chính
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="h-6 w-6 p-0 text-white hover:bg-blue-700 rounded flex items-center justify-center"
                    title="Xóa chat"
                  >
                    <AlertCircle className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={toggleChat}
                  className="h-6 w-6 p-0 text-white hover:bg-blue-700 rounded flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-0 flex flex-col h-[440px]">
              {/* Error Banner */}
              {error && (
                <div className="bg-red-50 border-b border-red-200 p-2">
                  <div className="flex items-center gap-2 text-red-700 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="space-y-4">
                      <div className="text-center text-gray-500 text-sm py-4">
                        <Bot className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>Xin chào! Tôi là trợ lý AI tài chính của bạn.</p>
                        <p>Hãy hỏi tôi về tiết kiệm, đầu tư, ngân sách...</p>
                      </div>
                      <QuickFinanceQuestions
                        onQuestionClick={handleQuickQuestion}
                      />
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex gap-3 items-start max-w-[85%] ${
                          message.role === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-xs ${
                            message.role === "user"
                              ? "bg-blue-600 text-white"
                              : message.isError
                              ? "bg-red-200 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : message.isError ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg px-4 py-3 text-sm ${
                            message.role === "user"
                              ? "bg-blue-600 text-white"
                              : message.isError
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-50 text-gray-900 border border-gray-200"
                          }`}
                        >
                          {message.role === "assistant" && !message.isError ? (
                            <FormattedMessage content={message.content} />
                          ) : (
                            <div className="whitespace-pre-wrap">
                              {message.content}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-green-100 text-green-700">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t p-4 bg-gray-50">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Hỏi về tài chính, tiết kiệm, đầu tư..."
                    className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center justify-center"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
