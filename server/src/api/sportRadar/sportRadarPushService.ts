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

  constructor() {
    this.setupBufferedUpdates();
    this.connect();
  }

  private connect() {
    try {
      this.wsConnection = new WebSocket(
        `${SPORTRADAR_CONFIG.BASE_URL}/stream/en/clock/subscribe?api_key=${SPORTRADAR_CONFIG.API_KEY}`
      );

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
      bufferTime(100), // Buffer updates for 100ms
      filter(updates => updates.length > 0)
    ).subscribe(updates => {
      const latestUpdate = updates[updates.length - 1];
      syncService.updateGameClock(latestUpdate.gameId, latestUpdate);
    });
  }

  private handleClockUpdate(payload: any) {
    const { game, clocks, period } = payload;
    
    const clockData: GameClock = {
      gameId: game.id,
      period: period.number,
      minutes: Math.floor(parseInt(clocks.game) / 60),
      seconds: parseInt(clocks.game) % 60,
      isRunning: clocks.running,
      lastUpdated: new Date()
    };

    this.clockUpdates$.next(clockData);
    pushLogger.updates('Clock update received:', clockData);
  }

  public subscribeToGame(gameId: string) {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        match: gameId
      }));
      pushLogger.connection(`Subscribed to game: ${gameId}`);
    }
  }

  public unsubscribeFromGame(gameId: string) {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        unsubscribe: gameId
      }));
      pushLogger.connection(`Unsubscribed from game: ${gameId}`);
    }
  }
}

export const sportRadarPushService = new SportRadarPushService();