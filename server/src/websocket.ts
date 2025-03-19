import { Server } from 'http';
import WebSocket from 'ws';
import { sportRadarPushService } from './api/sportRadar/sportRadarPushService';
import { pushLogger } from '/Users/atharvsonawane/musen-app/utils/logging/pushLogger';

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocket.Server({ server });
  
  wss.on('listening', () => {
    pushLogger.connection('WebSocket server is listening');
  });

  wss.on('connection', (ws: WebSocket) => {
    pushLogger.connection('New WebSocket connection established');
    
    ws.on('message', (message: WebSocket.RawData) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'subscribe') {
          sportRadarPushService.subscribeToGame(data.gameId);
        } else if (data.type === 'unsubscribe') {
          sportRadarPushService.unsubscribeFromGame(data.gameId);
        }
        
        pushLogger.connection('Processed WebSocket message:', data);
      } catch (error) {
        pushLogger.errors('Error processing WebSocket message:', error);
      }
    });

    ws.on('error', (error) => {
      pushLogger.errors('WebSocket error:', error);
    });

    ws.on('close', () => {
      pushLogger.connection('Client disconnected');
    });
  });
};