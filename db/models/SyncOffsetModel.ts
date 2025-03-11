// SyncOffsetModel.ts

import { SyncOffset } from '/Users/atharvsonawane/musen-app/api/sync/syncTypes';

export class SyncOffsetModel {
  private offsets: Map<string, SyncOffset>;

  constructor() {
    this.offsets = new Map();
  }

  updateOffset(gameId: string, offsetMs: number): void {
    this.offsets.set(gameId, {
      gameId,
      offsetMs,
      lastUpdated: new Date()
    });
  }

  getOffset(gameId: string): SyncOffset | undefined {
    return this.offsets.get(gameId);
  }

  calculateAdjustedTime(gameId: string, currentTime: Date): Date {
    const offset = this.offsets.get(gameId);
    if (!offset) return currentTime;

    return new Date(currentTime.getTime() + offset.offsetMs);
  }

  clearOffset(gameId: string): void {
    this.offsets.delete(gameId);
  }
}

export const syncOffsetModel = new SyncOffsetModel();