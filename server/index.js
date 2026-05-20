import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Enable CORS for frontend communication
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['POST', 'GET']
}));

// Parse JSON request bodies
app.use(express.json());

// Routes
// Mount contact routes at /api/contact
app.use('/api/contact', contactRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Portfolio backend is running perfectly.' });
});

// Global error handler for unhandled errors
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
