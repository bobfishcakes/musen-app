import { Subject } from 'rxjs';
import { pushLogger } from '/Users/atharvsonawane/musen-app-push-feed/utils/logging/pushLogger';
import { GameClock } from '/Users/atharvsonawane/musen-app-push-feed/api/sync/syncTypes';

class PushFeedService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  
  public feedData$ = new Subject<any>();
  
  connect(gameId: string) {
    try {
      console.log('🔌 [PushFeed] Attempting connection for game:', gameId);
      
      const url = `https://api.sportradar.com/nba/trial/stream/en/clock/subscribe?api_key=${process.env.SPORTRADAR_API_KEY}&match=${gameId}`;
      
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('🟢 [PushFeed] WebSocket connected for game:', gameId);
        pushLogger.info(`Connected to push feed for game ${gameId}`);
      };
      
      this.ws.onmessage = (event) => {
        try {
          console.log('📥 [PushFeed] Raw message received:', event.data);
          
          const data = JSON.parse(event.data);
          console.log('🔍 [PushFeed] Parsed message:', data);
          
          if (data.payload?.game) {
            const gameData = data.payload.game;
            const clockData = data.payload.clocks;
            
            console.log('⚡ [PushFeed] Processing game data:', {
              gameId: gameData.id,
              clock: clockData,
              period: data.payload.period
            });
            
            // Convert game clock from seconds to minutes/seconds
            const totalSeconds = parseInt(clockData.game);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            
            const clock: GameClock = {
              gameId: gameData.id,
              period: data.payload.period.number,
              minutes,
              seconds,
              isRunning: clockData.running,
              lastUpdated: new Date()
            };
            
            console.log('📡 [PushFeed] Emitting clock update:', clock);
            this.feedData$.next(clock);
          } else {
            console.log('⚠️ [PushFeed] Received message without game data:', data);
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('❌ [PushFeed] Error processing message:', errorMessage);
          pushLogger.error(`Error parsing push feed data: ${errorMessage}`);
        }
      };
      
      this.ws.onerror = (error: Event) => {
        console.error('🔴 [PushFeed] WebSocket error:', error);
        pushLogger.error(`WebSocket error: ${error}`);
      };
      
      this.ws.onclose = () => {
        console.log('🔌 [PushFeed] WebSocket closed for game:', gameId);
        this.handleReconnect(gameId);
      };
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('💥 [PushFeed] Connection error:', errorMessage);
      pushLogger.error(`Error connecting to push feed: ${errorMessage}`);
    }
  }

  private handleReconnect(gameId: string) {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      console.log(`🔄 [PushFeed] Attempting reconnect ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS}`);
      setTimeout(() => this.connect(gameId), 5000);
    } else {
      console.log('⛔ [PushFeed] Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.ws) {
      console.log('👋 [PushFeed] Disconnecting WebSocket');
      this.ws.close();
      this.ws = null;
    }
  }
}

export const pushFeedService = new PushFeedService();