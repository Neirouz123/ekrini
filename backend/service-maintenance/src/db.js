const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const defaultConfigPath = path.join(__dirname, 'config', 'db.json');
let mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  try {
    const raw = fs.readFileSync(defaultConfigPath, 'utf8');
    const cfg = JSON.parse(raw);
    mongoUri = cfg.url;
  } catch (err) {
    console.warn('Could not read db config, make sure MONGODB_URI is set');
  }
}

if (mongoUri) {
  mongoose.connect(mongoUri).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('MongoDB connection error:', err.message || err);
  });
} else {
  console.warn('No MongoDB URI configured. Skipping initial connection.');
}

module.exports = mongoose;
