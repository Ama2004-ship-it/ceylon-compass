const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const placeRoutes = require('./routes/placeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded place images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Ceylon Compass API' });
});

app.get('/api/config', (req, res) => {
  res.json({
    referenceLat: Number(process.env.REFERENCE_LAT || 6.7296579),
    referenceLng: Number(process.env.REFERENCE_LNG || 79.9294361),
    maxRadiusKm: Number(process.env.MAX_RADIUS_KM || 25),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/places', placeRoutes);

// Fallback 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Generic error handler (e.g. multer file-type errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ message: err.message || 'Something went wrong.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Ceylon Compass API running on http://localhost:${PORT}`);
});
