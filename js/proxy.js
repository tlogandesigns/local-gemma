const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  console.log('Incoming request body:', req.body);

  try {
    const ollamaResponse = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const responseText = await ollamaResponse.text();
    console.log('Raw response from Ollama:', responseText);

    // Try to parse
    const data = JSON.parse(responseText);
    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3000, () => console.log('Proxy running at http://localhost:3000'));
