import { INestApplication } from '@nestjs/common';
import { WebSocket } from 'ws';
import { CONFIG } from '@/config';
import { createApp } from '@/main';
import { WsGateway } from '@/modules/notifications/gateways/ws.gateway';
import { WSMessageType } from '@/modules/notifications/notifications.constant';
import { setupCreateAuthUser } from '@/modules/users/__test__/users.utils';

export const websocketConnect = async (
  authToken: string,
): Promise<WebSocket> => {
  const ws = new WebSocket(`ws://localhost:${CONFIG.APP.PORT}`, {
    headers: {
      cookie: `token=${authToken}`,
    },
  });

  return await new Promise<WebSocket>((resolve, reject) => {
    ws.once('error', reject);

    ws.once('close', (code, reason) => {
      reject({ code, reason: reason.toString() });
    });

    ws.once('message', (rawData) => {
      const message = JSON.parse(rawData.toString());

      if (message?.type === WSMessageType.AUTHENTICATED) {
        resolve(ws);
      }
    });
  });
};

describe('notifications -> WSGateway', () => {
  let app: INestApplication;
  let wsGateway: WsGateway;

  const createAuthUser = setupCreateAuthUser(() => app);

  beforeAll(async () => {
    app = await createApp();

    wsGateway = app.get(WsGateway);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should return 4403 close code when no valid auth token was provided in cookie', async () => {
    expect.assertions(1);
    try {
      await websocketConnect('');
    } catch (err) {
      expect(err).toEqual({
        code: 4403,
        reason: 'No valid cookie auth token provided',
      });
    }
  });

  it('Allow to connect for authenticated user', async () => {
    const authUser = await createAuthUser();
    await websocketConnect(authUser.token);

    expect(wsGateway.userSockets.size).toBe(1);
    expect(wsGateway.userSockets.get(authUser.entity.id)?.size).toBe(1);
  });
});
