// syncService.ts
import { GameClock, StoppageEvent } from './syncTypes';
import { pushLogger } from '../../utils/logging/pushLogger';
import { Subject } from 'rxjs';

class SyncService {
  private activeSyncs: Map<string, GameClock>;
  private stoppages: Map<string, StoppageEvent>;
  private debugPollers: Map<string, NodeJS.Timeout>;
  public clockUpdates$ = new Subject<GameClock>();

  constructor() {
    this.activeSyncs = new Map();
    this.stoppages = new Map();
    this.debugPollers = new Map();
  }

  updateGameClock(gameId: string, clock: Partial<GameClock>): void {
    console.log('⏰ [SyncService] Updating clock:', {
      gameId,
      newClock: clock
    });
    const existing = this.activeSyncs.get(gameId) || {
      gameId,
      period: 1,
      minutes: 12,
      seconds: 0,
      isRunning: false,
      lastUpdated: new Date()
    };
  
    const updatedClock = {
      ...existing,
      ...clock,
      lastUpdated: new Date()
    };
  
    this.activeSyncs.set(gameId, updatedClock);
    this.clockUpdates$.next(updatedClock);
    console.log('✅ [SyncService] Clock updated:', updatedClock);
    pushLogger.updates('Clock updated in sync service:', updatedClock);
  }

  getGameClock(gameId: string): GameClock | undefined {
    return this.activeSyncs.get(gameId);
  }

// In syncService.ts
startDebugPolling(gameId: string, onUpdate?: (clock: GameClock) => void): void {
  if (this.debugPollers.has(gameId)) {
    this.stopDebugPolling(gameId);
  }

  const poller = setInterval(() => {
    const clock = this.getGameClock(gameId);
    if (clock) {
      // Simulate clock updates for debugging
      const updatedClock = {
        ...clock,
        seconds: (clock.seconds - 1 + 60) % 60,
        minutes: clock.seconds === 0 ? Math.max(0, clock.minutes - 1) : clock.minutes,
        isRunning: true
      };
      this.updateGameClock(gameId, updatedClock);
      
      // Call the callback if provided
      if (onUpdate) {
        onUpdate(updatedClock);
      }
    }
  }, 1000);

  this.debugPollers.set(gameId, poller);
}

  stopDebugPolling(gameId: string): void {
    const poller = this.debugPollers.get(gameId);
    if (poller) {
      clearInterval(poller);
      this.debugPollers.delete(gameId);
    }
  }
}

export const syncService = new SyncService();