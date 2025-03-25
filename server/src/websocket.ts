import { Server } from 'http';
import WebSocket from 'ws';
import { sportRadarPushService } from './api/sportRadar/sportRadarPushService';
import { pushLogger } from '/Users/atharvsonawane/musen-app/utils/logging/pushLogger';
import { WebSocketServer } from '/Users/atharvsonawane/musen-app/types/websocket.d';

export const setupWebSocket = (server: Server) => {
  console.log('Setting up WebSocket server...');
  
  const wss = new WebSocket.Server({ 
    server,
    path: '/ws' // Add a specific path for WebSocket connections
  });
  
  wss.on('listening', () => {
    console.log('WebSocket server is now listening');
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', async (message: WebSocket.RawData) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'subscribe' && data.gameId) {
          await sportRadarPushService.subscribeToGame(data.gameId);
        } else if (data.type === 'unsubscribe' && data.gameId) {
          sportRadarPushService.unsubscribeFromGame(data.gameId);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
};