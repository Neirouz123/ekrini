const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// initialize DB connection
require('./db');

const maintenanceRouter = require('./routes/maintenanceRoutes');
const materielRouter = require('./routes/materielRoutes');
const vehiculeRouter = require('./routes/vehiculeRoutes');

const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'service-maintenance' });
});

// Routes (prefixed with /api to match other services)
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/materiel', materielRouter);
app.use('/api/vehicule', vehiculeRouter);

// 404
app.use((req, res) => res.status(404).json({ error: 'Route non trouvée' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(PORT, () => console.log(`Service Maintenance running on port ${PORT}`));

module.exports = app;