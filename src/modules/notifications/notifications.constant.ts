export const WS_REDIS_CHANNEL = 'WS_EVENT';

export enum WSMessageType {
  AUTHENTICATED = 'AUTHENTICATED',
}

export type WSRedisMessage = {
  recipientIds: string[];
  type: WSMessageType;
  data: Record<string, unknown>;
};
