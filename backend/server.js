require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { testConnection } = require('./config/db');

const app = express();

// --- Core middleware ---
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
// Everything the API exposes lives under /api, versioned implicitly.
// New feature routers are added inside routes/index.js only.
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Auth App API is running. See /api/health.' });
});

// --- 404 + error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await testConnection();
    console.log('MySQL connection OK.');
  } catch (err) {
    console.warn('Warning: could not connect to MySQL at startup:', err.message);
    console.warn('The server will still start, but DB-backed routes will fail until this is fixed.');
  }

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start();
