const express = require('express');
const cors = require('cors');
//const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const alertRoutes = require('./routes/alerts');
const sosRoutes = require('./routes/sos');
const verificationRoutes = require('./routes/verification');
const missingPersonsRoutes = require('./routes/missing-persons');
const systemRoutes = require('./routes/system');
const authRoutes = require('./routes/auth');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimit');

const app = express();

// Security middleware
//app.use(helmet({
  //crossOriginResourcePolicy: { policy: "cross-origin" }
//}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
// app.use('/api/sos', sosRoutes);
app.use('/api/verify', verificationRoutes);
app.use('/api/missing-persons', missingPersonsRoutes);
app.use('/api/system', systemRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Voices Under Fire API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;