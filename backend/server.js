require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movieRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Movie Vault API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/movies', movieRoutes);

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});