const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔽 Add the symptom-specialty map here
const symptomSpecialtyMap = {
  fever: 'General Physician',
  cough: 'General Physician',
  headache: 'Neurologist',
  nausea: 'Gastroenterologist',
  stomachache: 'Gastroenterologist',
  skin: 'Dermatologist',
  rash: 'Dermatologist',
  acne: 'Dermatologist',
  menstrual: 'Gynecologist',
  pregnancy: 'Gynecologist',
  child: 'Pediatrician',
  baby: 'Pediatrician',
};

// AI logic starts here
exports.gemini = async (req, res) => {
  const { prompt, modelName = 'gemini-1.5-flash' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const instructions = `
You are a clinic AI assistant. Ask the patient for their symptoms. When they respond, analyze the symptoms and suggest which specialist they should see.
The possible specialities are: General Physician, Gynecologist, Dermatologist, Pediatrician, Neurologist, Gastroenterologist.
If symptoms are unclear, ask for more information.
Respond politely, clearly, and only in a helpful medical tone.
`;

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent([instructions, prompt]);
    const response = await result.response;
    const text = response.text();
    res.json({ text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate content from Gemini API.' });
  }
};
