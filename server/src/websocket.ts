import { Server } from 'http';
import WebSocket from 'ws';

export function setupWebSocket(server: Server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.on('message', (message: WebSocket.RawData) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received:', data);
        
        // Handle different message types here
        if (data.type === 'subscribe' && data.gameId) {
          console.log(`Client subscribed to game: ${data.gameId}`);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}