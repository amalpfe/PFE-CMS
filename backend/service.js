const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const runGemini = async (userPrompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(userPrompt);
  const response = await result.response;
  return response.text();
};

module.exports = runGemini;
