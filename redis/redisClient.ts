import Redis from 'ioredis';
import { REDIS_KEYS } from './redisCacheKeys';

class RedisClient {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async setClock(gameId: string, clockData: any): Promise<void> {
    await this.client.set(
      `${REDIS_KEYS.GAME_CLOCK}:${gameId}`,
      JSON.stringify(clockData),
      'EX',
      3600 // 1 hour expiration
    );
  }

  async getClock(gameId: string): Promise<any> {
    const data = await this.client.get(`${REDIS_KEYS.GAME_CLOCK}:${gameId}`);
    return data ? JSON.parse(data) : null;
  }
}

export const redisClient = new RedisClient();