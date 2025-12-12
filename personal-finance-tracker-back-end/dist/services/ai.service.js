"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const openai_1 = require("config/openai");
class AIService {
    async generateResponse(prompt) {
        try {
            const response = await openai_1.openai.chat.completions.create({
                model: "tngtech/deepseek-r1t2-chimera:free",
                messages: [{ role: "user", content: prompt }],
            });
            return response.choices[0].message.content;
        }
        catch (error) {
            console.error("Error generating AI response:", error);
            throw new Error("Failed to generate AI response");
        }
    }
}
exports.AIService = AIService;
//# sourceMappingURL=ai.service.js.map