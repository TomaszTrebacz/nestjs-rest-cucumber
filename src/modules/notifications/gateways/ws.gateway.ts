import { OnApplicationBootstrap } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server, WebSocket } from 'ws';
import {
  WS_REDIS_CHANNEL,
  WSMessageType,
  WSRedisMessage,
} from '@/modules/notifications/notifications.constant';
import { RedisService } from '@/modules/redis/services/redis.service';
import { AuthService } from '@/modules/users/services/auth.service';

@WebSocketGateway()
export class WsGateway implements OnGatewayConnection, OnApplicationBootstrap {
  @WebSocketServer()
  private readonly wsServer!: Server;

  readonly userSockets: Map<string, Set<WebSocket>> = new Map();

  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

  async onApplicationBootstrap() {
    await this.redisService.subscribe<WSRedisMessage>(
      WS_REDIS_CHANNEL,
      (message) => {
        for (const recipientId of message.recipientIds) {
          const userSockets = this.userSockets.get(recipientId);

          if (!userSockets) {
            continue;
          }

          for (const ws of userSockets) {
            this.sendWebSocketMessage(ws, message.type, message.data);
          }
        }
      },
    );
  }

  sendWebSocketMessage(
    ws: WebSocket,
    type: WSMessageType,
    data?: Record<string, unknown>,
  ) {
    ws.send(JSON.stringify({ type, data }));
  }

  async handleConnection(ws: WebSocket, req: Request) {
    const session = await this.authService.getSessionFromCookie(req);

    if (!session) {
      ws.close(4403, 'No valid cookie auth token provided');
      return;
    }

    const userSockets = this.userSockets.get(session.user.id);

    if (userSockets) {
      userSockets.add(ws);
    } else {
      this.userSockets.set(session.user.id, new Set([ws]));
    }

    ws.on('message', () => {
      ws.close(4400, 'Messages cannot be send to server');
    });

    ws.on('close', () => {
      const userSockets = this.userSockets.get(session.user.id);

      if (userSockets) {
        userSockets.delete(ws);

        if (userSockets.size === 0) {
          this.userSockets.delete(session.user.id);
        }
      }
    });

    this.sendWebSocketMessage(ws, WSMessageType.AUTHENTICATED);
  }
}
