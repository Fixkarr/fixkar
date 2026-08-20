import ai from "../ai.config.js";


export const generateAIResponse = async (message) => {
  const response = await ai.models.generateContent({
    model: process.env.AI_MODEL,
    contents: message,
  });

  return response.text;
};