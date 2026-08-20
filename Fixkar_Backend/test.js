import { generateAIResponse } from "./Ai_Assistant/AiServices/ai.service.js";


const testMessages = [
  "Hello",
  "What is Fixkar?",
  "I want to build a website",
  "How can I contact you?",
  "What is the price?",
  "Tell me about quantum physics",
  "Can you help me with my car repair?",
  "I need assistance with my plumbing issue",
  "What are your working hours?",
];

for (const message of testMessages) {
  const result = await generateAIResponse(message);

  console.log("\nUser:", message);
  console.log("Intent:", result.intent);
  console.log("AI:", result.response);
}