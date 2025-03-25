import WebSocket from 'ws';
import { Subject, bufferTime, filter } from 'rxjs';
import { SPORTRADAR_CONFIG } from './sportRadarConfig';

interface ClockUpdate {
  gameId: string;
  period: number;
  clock: {
    minutes: number;
    seconds: number;
    isRunning: boolean;
  };
}

export class SportRadarPushService {
  private wsConnection: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_DELAY = 5000;
  private activeSubscriptions: Set<string> = new Set();
  public clockUpdates$ = new Subject<ClockUpdate>();

  constructor() {
    // Buffer clock updates to prevent flooding
    this.clockUpdates$.pipe(
      bufferTime(100),
      filter(updates => updates.length > 0)
    ).subscribe(updates => {
      // Emit only the latest update
      const latestUpdate = updates[updates.length - 1];
      this.clockUpdates$.next(latestUpdate);
    });
  }

  private connect() {
    console.log('🔍 Connect method called with active subscriptions:', 
      Array.from(this.activeSubscriptions));
    
    if (!SPORTRADAR_CONFIG.API_KEY || this.activeSubscriptions.size === 0) {
      console.log('❌ Connection attempt blocked:', {
        hasApiKey: !!SPORTRADAR_CONFIG.API_KEY,
        activeSubscriptions: this.activeSubscriptions.size
      });
      return;
    }
  
    const wsUrl = `${SPORTRADAR_CONFIG.WS_URL}/clock/subscribe?api_key=${SPORTRADAR_CONFIG.API_KEY}&match=${Array.from(this.activeSubscriptions).join(',')}&status=inprogress`;
    console.log('🔄 Attempting WebSocket connection to:', wsUrl);
  
    try {
      // Close existing connection if any
      if (this.wsConnection) {
        this.wsConnection.close();
        this.wsConnection = null;
      }

      this.wsConnection = new WebSocket(wsUrl);
      
      this.wsConnection.on('open', () => {
        console.log('🟢 WebSocket connected with subscriptions:', Array.from(this.activeSubscriptions));
        this.reconnectAttempts = 0;
      });
  
      this.wsConnection.on('message', (data: WebSocket.Data) => {
        try {
          console.log('📥 Raw WebSocket message received:', data.toString());
          const parsedData = JSON.parse(data.toString());
          console.log('📦 Parsed WebSocket data:', parsedData);
          
          if (parsedData.payload) {
            this.handleGameUpdate(parsedData.payload);
          } else {
            console.log('⚠️ No payload in message');
          }
        } catch (error) {
          console.error('❌ Error parsing message:', error);
        }
      });
  
      this.wsConnection.on('close', (code: number, reason: string) => {
        console.log('🔌 WebSocket disconnected:', {
          code,
          reason,
          wasClean: code === 1000
        });
        this.handleReconnection();
      });
  
      this.wsConnection.on('error', (error) => {
        console.error('🔴 WebSocket error:', {
          error,
          readyState: this.wsConnection?.readyState
        });
        this.handleReconnection();
      });
  
    } catch (error) {
      console.error('❌ Failed to connect:', error);
      this.handleReconnection();
    }
  }

  private handleGameUpdate(payload: any) {
    try {
      console.log('🎮 Processing game update payload:', payload);
      
      if (!payload.game?.id || !payload.period?.number || !payload.clocks?.game) {
        console.error('❌ Invalid payload structure:', payload);
        return;
      }

      const update: ClockUpdate = {
        gameId: payload.game.id,
        period: payload.period.number,
        clock: {
          minutes: Math.floor(payload.clocks.game / 60),
          seconds: payload.clocks.game % 60,
          isRunning: payload.clocks.running
        }
      };
      
      console.log('⏰ Emitting clock update:', update);
      this.clockUpdates$.next(update);
    } catch (error) {
      console.error('❌ Error processing update:', error, 'Payload:', payload);
    }
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS}`);
      setTimeout(() => this.connect(), this.RECONNECT_DELAY);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  public subscribeToGame(gameId: string) {
    console.log('📝 Subscription requested for game:', gameId);
    console.log('Current WebSocket state:', this.wsConnection?.readyState);
    
    if (!this.activeSubscriptions.has(gameId)) {
      this.activeSubscriptions.add(gameId);
      this.connect();
    } else {
      console.log('ℹ️ Game already subscribed:', gameId);
      if (!this.wsConnection || this.wsConnection.readyState !== WebSocket.OPEN) {
        console.log('🔄 Forcing reconnection for existing subscription');
        this.connect();
      }
    }
  }
  
  public unsubscribeFromGame(gameId: string) {
    console.log('🗑️ Unsubscription requested for game:', gameId);
    if (this.activeSubscriptions.has(gameId)) {
      this.activeSubscriptions.delete(gameId);
      console.log('➖ Removed subscription, remaining subscriptions:', Array.from(this.activeSubscriptions));
      
      if (this.activeSubscriptions.size === 0) {
        console.log('🔄 No active subscriptions, closing connection');
        this.wsConnection?.close();
        this.wsConnection = null;
      } else {
        console.log('🔄 Reconnecting with updated subscriptions');
        this.connect();
      }
    }
  }
}

export const sportRadarPushService = new SportRadarPushService();