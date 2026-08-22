import ai from "../ai.config.js";
import { loadKnowledgeBase } from "./knowledge.service.js";

export const generateAIResponse = async (message) => {
  const knowledge = await loadKnowledgeBase();

  const response = await ai.models.generateContent({
    model: process.env.AI_MODEL,

    config: {
      systemInstruction: knowledge,
    },

    contents: message,
  });

  return response.text;
};