// import OpenAI from "openai";
// import aiConfig from "../ai.config";




// const openai = new OpenAI({
//   apiKey: aiConfig.apiKey,
// });

// export const generateAIResponse = async (message) => {
//   const response = await openai.responses.create({
//     model: aiConfig.model,
//     input: message,
//   });

//   return response.output_text;
// };




import mockAIData from "../Data/mockAiData.js";

const normalizeMessage = (message) => {
  return message.trim().toLowerCase();
};

const findIntent = (message) => {
  const normalizedMessage = normalizeMessage(message);

  for (const [intent, data] of Object.entries(mockAIData)) {
    if (intent === "fallback") continue;

    const matched = data.keywords.some((keyword) =>
      normalizedMessage.includes(keyword.toLowerCase())
    );

    if (matched) {
      return intent;
    }
  }

  return "fallback";
};

export const generateAIResponse = async (message) => {
  const intent = findIntent(message);

  const responses = mockAIData[intent].responses;

  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];

  return {
    intent,
    response: randomResponse,
  };
};

