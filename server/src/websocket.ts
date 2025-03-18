import { Server } from 'http';
import WebSocket from 'ws';

export const setupWebSocket = (server: Server) => {
  console.log('Setting up WebSocket server...');
  
  const wss = new WebSocket.Server({ server });
  
  wss.on('listening', () => {
    console.log('WebSocket server is listening');
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', (message: WebSocket.RawData) => {
      console.log('Received WebSocket message:', message.toString());
      // ... rest of your message handling code
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
};