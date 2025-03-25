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
    
    const existing = this.activeSyncs.get(gameId);
    
    // Only proceed if we have actual clock data
    if (!existing && (!clock.minutes && !clock.seconds && !clock.period)) {
      console.log('⚠️ [SyncService] Skipping update - no valid clock data');
      return;
    }
  
    const updatedClock: GameClock = {
      gameId,
      period: clock.period ?? existing?.period ?? 1,
      minutes: clock.minutes ?? existing?.minutes ?? 0,
      seconds: clock.seconds ?? existing?.seconds ?? 0,
      isRunning: clock.isRunning ?? existing?.isRunning ?? false,
      lastUpdated: new Date()
    };
  
    this.activeSyncs.set(gameId, updatedClock);
    this.clockUpdates$.next(updatedClock);
    console.log('✅ [SyncService] Clock updated:', updatedClock);
  }

  getGameClock(gameId: string): GameClock | undefined {
    return this.activeSyncs.get(gameId);
  }

  startDebugPolling(gameId: string, onUpdate?: (clock: GameClock) => void): void {
    // Stop existing poller if any
    this.stopDebugPolling(gameId);

    // Don't start a new poller - we'll rely on push feed updates only
    const clock = this.getGameClock(gameId);
    if (clock && onUpdate) {
      onUpdate(clock);
    }
  }

  stopDebugPolling(gameId: string): void {
    const poller = this.debugPollers.get(gameId);
    if (poller) {
      clearInterval(poller);
      this.debugPollers.delete(gameId);
    }
  }

  startStoppage(gameId: string, type: 'timeout' | 'review' | 'injury' | 'other'): void {
    const stoppage: StoppageEvent = {
      gameId,
      type,
      startTime: new Date(),
      duration: 0  // Initial duration
    };
    this.stoppages.set(gameId, stoppage);
  }
  
  endStoppage(gameId: string): void {
    const stoppage = this.stoppages.get(gameId);
    if (stoppage) {
      // Calculate duration in seconds
      const duration = (new Date().getTime() - stoppage.startTime.getTime()) / 1000;
      const updatedStoppage: StoppageEvent = {
        ...stoppage,
        duration
      };
      this.stoppages.set(gameId, updatedStoppage);
    }
  }
}

export const syncService = new SyncService();