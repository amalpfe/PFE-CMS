const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/assistant', async (req, res) => {
  const { message, history = [] } = req.body;

  const messages = [
    {
      role: 'system',
      content:
        "You are a friendly medical assistant. Ask the user about their symptoms and suggest a suitable doctor.",
    },
    ...history,
    { role: 'user', content: message },
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error('OpenAI Error:', err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data?.error?.message || 'Something went wrong with OpenAI API',
    });
  }
});


module.exports = router;
