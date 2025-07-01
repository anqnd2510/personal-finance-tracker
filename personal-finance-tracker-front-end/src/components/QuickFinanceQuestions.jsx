export function QuickFinanceQuestions({ onQuestionClick }) {
  const quickQuestions = [
    "Cách tiết kiệm tiền hiệu quả?",
    "Làm sao để lập ngân sách?",
    "Nên đầu tư vào đâu an toàn?",
    "Cách quản lý nợ thông minh?",
    "Lập quỹ khẩn cấp như thế nào?",
  ];

  return (
    <div className="space-y-3 px-2">
      <p className="text-xs text-gray-500 font-medium text-center">
        💡 Câu hỏi gợi ý:
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {quickQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-full border border-blue-200 transition-colors hover:shadow-sm"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
