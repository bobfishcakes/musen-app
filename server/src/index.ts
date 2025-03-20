// server/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { gamesRouter } from './routes/games';
import { setupWebSocket } from './websocket';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/games', gamesRouter);

const server = app.listen(PORT, () => {
  console.log('=================================');
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('=================================');
});

// Setup WebSocket with enhanced logging
try {
  console.log('Initializing WebSocket server...');
  const wsServer = setupWebSocket(server);
  console.log('WebSocket server initialization successful');
} catch (error) {
  console.error('Failed to initialize WebSocket server:', error);
}