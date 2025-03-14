import Redis from 'ioredis';
import { REDIS_KEYS } from './redisCacheKeys';

class RedisClient {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      username: 'default',
      password: '5mb06xOA9wuL02Olax1VbUikhbgBYxxy',
      host: 'redis-13344.c232.us-east-1-2.ec2.redns.redis-cloud.com',
      port: 13344
    });

    this.client.on('error', (err: Error) => console.log('Redis Client Error', err));
  }

  // Note: No need for explicit connect() with ioredis as it handles connection automatically

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

  async setGameIdMapping(sportApiGameId: string, radarGameId: string, date: string): Promise<void> {
    const mappingKey = `${REDIS_KEYS.GAME_MAPPING}:${date}`;
    await this.client.hset(mappingKey, sportApiGameId, radarGameId);
    await this.client.expire(mappingKey, 48 * 60 * 60);
  }

  async getGameIdMapping(sportApiGameId: string, date: string): Promise<string | null> {
    const mappingKey = `${REDIS_KEYS.GAME_MAPPING}:${date}`;
    return await this.client.hget(mappingKey, sportApiGameId);
  }
}

export const redisClient = new RedisClient();