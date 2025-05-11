// src/controllers/AssistantController.js

const db = require("../../config"); // your DB config
function extractSymptoms(text) {
  const symptomList = ["fever", "cough", "fatigue", "shortness of breath", "chest pain"];
  return symptomList.filter(sym => text.toLowerCase().includes(sym));
}

function mapSymptomsToDisease(symptoms) {
  if (symptoms.includes("cough") && symptoms.includes("fever") && symptoms.includes("shortness of breath")) {
    return { name: "Possible Pneumonia", specialty: "Pulmonology" };
  }
  return { name: "General Symptoms", specialty: "General Medicine" };
}


const handleChat = async (req, res) => {
  const { message } = req.body;

  // 1. Extract symptoms (simplified logic)
  const symptoms = extractSymptoms(message);
  const condition = mapSymptomsToDisease(symptoms);

  // 2. Find doctor
  const [doctors] = await db.execute(
    "SELECT * FROM doctor WHERE specialty LIKE ? LIMIT 1",
    [`%${condition.specialty}%`]
  );

  const reply = `Based on your symptoms (${symptoms.join(", ")}), you might have ${condition.name}.
We recommend seeing a ${condition.specialty}.
Dr. ${doctors[0]?.name} is available. Do you want to book an appointment?`;

  // Optionally: store chat
  await db.execute(
    "INSERT INTO chat_messages (sender, text) VALUES (?, ?), (?, ?)",
    ["user", message, "ai", reply]
  );

  res.json({ reply });
};
module.exports = {
handleChat
};
