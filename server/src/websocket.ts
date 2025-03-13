// api/websocket.ts

import { Server } from 'http';
import WebSocket from 'ws';
import { syncService } from '/Users/atharvsonawane/musen-app/api/sync/syncService';
import { GameClock } from '/Users/atharvsonawane/musen-app/api/sync/syncTypes';

// Define message types
interface WebSocketMessage {
  type: 'subscribe' | 'clock_update';
  gameId?: string;
  clockData?: Partial<GameClock>;
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.on('message', async (message: WebSocket.RawData) => {
      try {
        const data: WebSocketMessage = JSON.parse(message.toString());
      
        switch (data.type) {
          case 'subscribe':
            if (data.gameId) {
              // Handle game subscription
              console.log(`Client subscribed to game: ${data.gameId}`);
              // Example: Add client to a game-specific subscription list
              // subscriptions.set(data.gameId, ws);
            }
            break;

          case 'clock_update':
            if (data.gameId && data.clockData) {
              // Handle clock updates
              await syncService.updateGameClock(data.gameId, data.clockData);
              // Broadcast update to other clients
              wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({
                    type: 'clock_update',
                    gameId: data.gameId,
                    clockData: data.clockData
                  }));
                }
              });
            }
            break;

          default:
            console.warn('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      // Clean up any subscriptions if needed
    });
  });

  return wss;
}