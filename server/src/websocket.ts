// server/src/websocket.ts
import { Server } from 'http';
import WebSocket from 'ws';
import { sportRadarPushService } from './api/sportRadar/sportRadarPushService';
import { pushLogger } from '/Users/atharvsonawane/musen-app/utils/logging/pushLogger';

export const setupWebSocket = (server: Server) => {
  console.log('Setting up WebSocket server...');
  
  const wss = new WebSocket.Server({ server });
  
  wss.on('listening', () => {
    console.log('WebSocket server is now listening');
    pushLogger.connection('WebSocket server is listening');
  });

  wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
    pushLogger.errors('WebSocket server error:', error);
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');
    pushLogger.connection('New WebSocket connection established');
    
    // Keep track of subscribed games for this connection
    const subscribedGames = new Set<string>();

    ws.on('message', (message: WebSocket.RawData) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received WebSocket message:', data);
        
        if (data.type === 'subscribe') {
          console.log('Subscribing to game:', data.gameId);
          sportRadarPushService.subscribeToGame(data.gameId);
          subscribedGames.add(data.gameId);
          
          // Send confirmation back to client
          ws.send(JSON.stringify({
            type: 'subscribed',
            gameId: data.gameId,
            timestamp: new Date().toISOString()
          }));
        } else if (data.type === 'unsubscribe') {
          console.log('Unsubscribing from game:', data.gameId);
          sportRadarPushService.unsubscribeFromGame(data.gameId);
          subscribedGames.delete(data.gameId);
          
          // Send confirmation back to client
          ws.send(JSON.stringify({
            type: 'unsubscribed',
            gameId: data.gameId,
            timestamp: new Date().toISOString()
          }));
        }
        
        pushLogger.connection('Processed WebSocket message:', data);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        pushLogger.errors('Error processing WebSocket message:', error);
        
        // Send error back to client
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message',
          timestamp: new Date().toISOString()
        }));
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket connection error:', error);
      pushLogger.errors('WebSocket error:', error);
    });

    ws.on('close', () => {
      console.log('Client disconnected, cleaning up subscriptions');
      // Cleanup subscriptions when client disconnects
      subscribedGames.forEach(gameId => {
        sportRadarPushService.unsubscribeFromGame(gameId);
      });
      subscribedGames.clear();
      pushLogger.connection('Client disconnected');
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connected',
      timestamp: new Date().toISOString()
    }));
  });

  console.log('WebSocket server setup completed');
  return wss;
};