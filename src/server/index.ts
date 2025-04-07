const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const BINANCE_API_URL = 'https://api.binance.com/api';

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Route spécifique pour le ping
app.get('/api/v3/ping', async (req, res) => {
  try {
    const response = await axios.get(`${BINANCE_API_URL}/v3/ping`);
    res.json(response.data);
  } catch (error) {
    console.error('Ping error:', error);
    res.status(500).json({ error: 'Failed to ping Binance API' });
  }
});

// Route générique pour les autres endpoints
app.use('/api/*', async (req, res) => {
  try {
    const path = req.path.replace('/api', '');
    const url = `${BINANCE_API_URL}${path}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

    console.log('Proxying request to:', url);

    const headers = {};
    if (req.headers['x-mbx-apikey']) {
      headers['X-MBX-APIKEY'] = req.headers['x-mbx-apikey'];
    }

    const response = await axios({
      method: req.method,
      url,
      headers
    });

    console.log('Binance response:', response.status);
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.response?.data);
    res.status(error.response?.status || 500).json(error.response?.data || {});
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});