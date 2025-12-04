'use strict';

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Serve static files (including receptionniste.html) from project root
app.use(express.static(path.join(__dirname)));

app.get('/', (_req, res) => {
  res.redirect('/receptionniste.html');
});

app.post('/api/tts', async (req, res) => {
  try {
    const { voice, text } = req.body || {};
    if (!voice || !text) {
      return res.status(400).json({ error: 'Missing voice or text' });
    }

    const voiceMap = {
      simon: process.env.ELEVENLABS_VOICE_ID_SIMON,
      lena: process.env.ELEVENLABS_VOICE_ID_LENA
    };

    const voiceId = voiceMap[voice];
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey || !voiceId) {
      return res.status(500).json({ error: 'Server voice configuration missing' });
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const modelId = 'eleven_multilingual_v2';
    // Voice tuning: reduce breathiness for Léna by lowering style and upping stability
    const defaultSettings = { stability: 0.55, similarity_boost: 0.75, style: 0.25, use_speaker_boost: true };
    // Make Léna calmer and a touch slower by increasing stability and decreasing expressiveness
    const lenaSettings = { stability: 0.85, similarity_boost: 0.65, style: 0.05, use_speaker_boost: false };
    const voiceSettings = voice === 'lena' ? lenaSettings : defaultSettings;

    const ttsResponse = await axios.post(
      url,
      { text, model_id: modelId, voice_settings: voiceSettings },
      {
        headers: {
          'xi-api-key': apiKey,
          'accept': 'audio/mpeg',
          'content-type': 'application/json'
        },
        responseType: 'stream',
        timeout: 30000
      }
    );

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Disposition', 'inline; filename="tts.mp3"');
    ttsResponse.data.pipe(res);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data || err.message || 'TTS error';
    res.status(status).json({ error: 'TTS_FAILED', details: message });
  }
});

app.listen(PORT, () => {
  console.log(`SYMI server listening on http://localhost:${PORT}`);
});


