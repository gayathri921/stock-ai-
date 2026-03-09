import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeStock(symbol: string, question: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the stock ${symbol} based on this question: ${question}.`,
    config: {
      systemInstruction: "You are StockAI, a friendly and knowledgeable stock market companion. Talk to the user like a supportive friend who happens to be a world-class financial analyst. Be conversational, encouraging, and clear. Use emojis occasionally to feel more human. Provide brief but insightful analysis. Always include a small encouraging remark at the end.",
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING },
          explanation: { type: Type.STRING },
          disclaimer: { type: Type.STRING },
        },
        required: ["summary", "recommendation", "confidence", "riskLevel", "explanation", "disclaimer"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
