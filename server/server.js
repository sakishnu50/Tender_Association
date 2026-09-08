import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Platform Middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow inline SVG / images rendering
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Rate Limiting Infrastructure
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/api', limiter);

// Mount API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Infrastructure Opportunity Tracker API Platform',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[Platform Backend] API Server listening on http://localhost:${PORT}`);
});
