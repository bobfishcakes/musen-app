import { syncService } from './syncService';
import { GameClock, SyncOffset } from './syncTypes';

export class SyncController {
  async updateClock(gameId: string, clockData: Partial<GameClock>): Promise<void> {
    try {
      syncService.updateGameClock(gameId, clockData);
      // Broadcast update to connected clients
      // Implementation depends on your websocket setup
    } catch (error) {
      console.error('Error updating game clock:', error);
      throw error;
    }
  }

  async getClockStatus(gameId: string): Promise<GameClock | undefined> {
    return syncService.getGameClock(gameId);
  }

  async handleStoppage(gameId: string, type: string): Promise<void> {
    syncService.startStoppage(gameId, type as any);
    // Broadcast stoppage to connected clients
  }
}

export const syncController = new SyncController();