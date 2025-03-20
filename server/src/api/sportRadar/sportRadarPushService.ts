import WebSocket from 'ws';
import { Subject, bufferTime, filter } from 'rxjs';
import { SPORTRADAR_CONFIG } from './sportRadarConfig';
import { GameClock } from '/Users/atharvsonawane/musen-app/api/sync/syncTypes';
import { syncService } from '/Users/atharvsonawane/musen-app/api/sync/syncService';
import { pushLogger } from '/Users/atharvsonawane/musen-app/utils/logging/pushLogger';

export class SportRadarPushService {
  private wsConnection: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 3;
  private readonly RECONNECT_DELAY = 5000;
  private clockUpdates$ = new Subject<GameClock>();
  private activeSubscriptions: Set<string> = new Set();

  constructor() {
    this.setupBufferedUpdates();
    this.connect();
  }

  private connect() {
    try {
      // Build URL with match parameter if there are active subscriptions
      let wsUrl = `${SPORTRADAR_CONFIG.WS_URL}/clock/subscribe?api_key=${SPORTRADAR_CONFIG.API_KEY}`;
      
      if (this.activeSubscriptions.size > 0) {
        const matchIds = Array.from(this.activeSubscriptions).join(',');
        wsUrl += `&match=${matchIds}`;
      }

      this.wsConnection = new WebSocket(wsUrl);

      this.wsConnection.on('open', () => {
        pushLogger.connection('WebSocket connection established');
        this.reconnectAttempts = 0;
      });

      this.wsConnection.on('message', (data: WebSocket.Data) => {
        try {
          const parsedData = JSON.parse(data.toString());
          if (parsedData.payload?.game) {
            this.handleClockUpdate(parsedData.payload);
          }
        } catch (error) {
          pushLogger.errors('Error parsing WebSocket message:', error);
        }
      });

      this.wsConnection.on('close', () => {
        pushLogger.connection('WebSocket connection closed');
        this.handleReconnection();
      });

      this.wsConnection.on('error', (error) => {
        pushLogger.errors('WebSocket error:', error);
        this.handleReconnection();
      });

    } catch (error) {
      pushLogger.errors('Error establishing WebSocket connection:', error);
      this.handleReconnection();
    }
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      pushLogger.connection(`Attempting reconnection ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS}`);
      setTimeout(() => this.connect(), this.RECONNECT_DELAY);
    } else {
      pushLogger.errors('Max reconnection attempts reached');
    }
  }

  private setupBufferedUpdates() {
    this.clockUpdates$.pipe(
      bufferTime(100),
      filter(updates => updates.length > 0)
    ).subscribe(updates => {
      const latestUpdate = updates[updates.length - 1];
      syncService.updateGameClock(latestUpdate.gameId, latestUpdate);
    });
  }

  private handleClockUpdate(payload: any) {
    try {
      const { game, clocks, period } = payload;
      
      console.log('Raw clock update payload:', payload); // Add this line
      
      if (!game?.id || !clocks?.game || !period?.number) {
        pushLogger.errors('Invalid payload structure:', payload);
        return;
      }
  
      const clockData: GameClock = {
        gameId: game.id,
        period: period.number,
        minutes: Math.floor(parseInt(clocks.game) / 60),
        seconds: parseInt(clocks.game) % 60,
        isRunning: clocks.running,
        lastUpdated: new Date()
      };
  
      console.log('Processed clock data:', clockData); // Add this line
      
      this.clockUpdates$.next(clockData);
      pushLogger.updates('Clock update received:', clockData);
    } catch (error) {
      pushLogger.errors('Error handling clock update:', error);
    }
  }

  // Update the method signatures to accept the client WebSocket
  public subscribeToGame(gameId: string, clientWs?: WebSocket) {
    if (!this.activeSubscriptions.has(gameId)) {
      this.activeSubscriptions.add(gameId);
      
      // Reconnect with updated subscription list
      if (this.wsConnection) {
        this.wsConnection.close();
      }
      this.connect();
      
      pushLogger.connection(`Subscribed to game: ${gameId}`);
    }
  }

  public unsubscribeFromGame(gameId: string, clientWs?: WebSocket) {
    if (this.activeSubscriptions.has(gameId)) {
      this.activeSubscriptions.delete(gameId);
      
      // Reconnect with updated subscription list
      if (this.wsConnection) {
        this.wsConnection.close();
      }
      this.connect();
      
      pushLogger.connection(`Unsubscribed from game: ${gameId}`);
    }
  }
}

export const sportRadarPushService = new SportRadarPushService();