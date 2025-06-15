const express = require('express');
const router = express.Router();
const axios = require('axios');

const MEDICAL_PROMPT = `
You are a medical triage assistant. Analyze symptoms and suggest ONLY the medical specialty needed.
Rules:
- Output ONLY the specialty name (e.g., "Cardiology")
- Map symptoms to specialties:
  • Chest pain → Cardiology
  • Skin rash → Dermatology
  • Head injury → Neurology
  • Abdominal pain → Gastroenterology
  • Child illness → Pediatrics
- If unsure → "General Physician"

Patient symptoms: 
`;

router.post('/analyze-symptoms', async (req, res) => {
  try {
    const { symptoms } = req.body;
    
    if (!symptoms || typeof symptoms !== 'string') {
      return res.status(400).json({ error: 'Invalid symptoms input' });
    }

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: MEDICAL_PROMPT },
          { role: "user", content: symptoms }
        ],
        temperature: 0.1,
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );

    const specialty = response.data.choices[0].message.content.trim();
    res.json({ specialty });
    
  } catch (error) {
    console.error('DeepSeek API error:', error.response?.data || error.message);
    
    // Specific handling for insufficient balance
    if (error.response?.data?.error?.code === 'invalid_request_error') {
      return res.status(402).json({ // 402 = Payment Required
        error: 'API service temporarily unavailable',
        details: 'Please contact system administrator'
      });
    }

    res.status(500).json({ 
      error: 'AI analysis failed',
      details: error.message
    });
  }
});

module.exports = router;