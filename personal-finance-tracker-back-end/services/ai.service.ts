import { openai } from "config/openai";

export class AIService {
  async generateResponse(prompt: string): Promise<string | null> {
    try {
      const response = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: prompt }],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw new Error("Failed to generate AI response");
    }
  }
}
