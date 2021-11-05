import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import IORedis from 'ioredis';
//eslint-disable-next-line import/no-unresolved
import { Subject } from 'rxjs';
import { CONFIG } from '@/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  readonly redisClient = new IORedis(CONFIG.REDIS.PORT, CONFIG.REDIS.HOST);
  private readonly redisPublisher = new IORedis(
    CONFIG.REDIS.PORT,
    CONFIG.REDIS.HOST,
  );
  private readonly eventSubject = new Map<string, Subject<unknown>>();

  async onModuleInit() {
    this.redisClient.on('message', (channel, rawMessage) => {
      const subject = this.eventSubject.get(channel);

      if (subject) {
        subject.next(JSON.parse(rawMessage));
      }
    });
  }

  async onModuleDestroy() {
    this.redisClient.disconnect();
    this.redisPublisher.disconnect();
  }

  async publish(channel: string, message: unknown): Promise<void> {
    await this.redisPublisher.publish(channel, JSON.stringify(message));
  }

  async subscribe<T>(
    channel: string,
    onMessage: (message: T) => void,
  ): Promise<() => Promise<void>> {
    await this.redisClient.subscribe(channel);

    let subject = this.eventSubject.get(channel);

    if (!subject) {
      subject = new Subject<unknown>();
      this.eventSubject.set(channel, subject);
    }

    const subscription = subject.subscribe(onMessage as never);

    return async () => {
      subscription.unsubscribe();

      if (subject?.observers.length === 0) {
        this.eventSubject.delete(channel);
        await this.redisClient.unsubscribe(channel);
      }
    };
  }
}
