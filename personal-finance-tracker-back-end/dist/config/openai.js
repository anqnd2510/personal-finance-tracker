"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = void 0;
require("dotenv").config();
const openai_1 = require("openai");
exports.openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL || "https://openrouter.ai/api/v1",
});
//# sourceMappingURL=openai.js.map