import { GoogleGenAI, Type } from "@google/genai";
import { FortuneResponse } from "../types";

const apiKey = process.env.API_KEY;

export const getFortuneInterpretation = async (stickName: string): Promise<FortuneResponse> => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a mystical fortune teller interpreting the "60 Jiazi" (Chinese Sixty-Year Cycle) fortune sticks. 
    The user has drawn the stick named "${stickName}". 
    
    Your task is to interpret this specific fortune stick ("${stickName}") but with a strong "Spirit Animal" theme.
    
    1. Identify a Spirit Animal that metaphorically represents the energy of this specific Jiazi stick (e.g., based on the Earthly Branch or the elemental nature of the stick).
    2. Write a short, poetic interpretation (4 lines max) in Traditional Chinese.
    3. Give concrete advice.
    4. Determine the auspiciousness.

    Return ONLY JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          animalGuardian: { type: Type.STRING, description: "The name of the spirit animal (e.g., 'Gold-Plated Tiger' or 'Mystic Crane')" },
          animalTrait: { type: Type.STRING, description: "A key personality trait of this animal related to the fortune" },
          poem: { type: Type.STRING, description: "A 4-line poem in Traditional Chinese interpreting the fortune" },
          luckyColor: { type: Type.STRING, description: "A lucky color associated with this fortune" },
          advice: {
            type: Type.OBJECT,
            properties: {
              general: { type: Type.STRING },
              career: { type: Type.STRING },
              love: { type: Type.STRING }
            },
            required: ["general", "career", "love"]
          },
          auspiciousness: { 
            type: Type.STRING, 
            enum: ["Great Fortune", "Good Fortune", "Neutral", "Caution"] 
          }
        },
        required: ["animalGuardian", "animalTrait", "poem", "luckyColor", "advice", "auspiciousness"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Oracle");
  
  return JSON.parse(text) as FortuneResponse;
};
