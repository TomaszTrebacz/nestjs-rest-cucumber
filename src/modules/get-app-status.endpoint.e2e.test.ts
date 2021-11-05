import { HttpStatus, INestApplication } from '@nestjs/common';
import { CONFIG } from '@/config';
import { createApp } from '@/main';
import { defineCall } from '@/test-utils/common.util';

describe('GetAppStatus', () => {
  let app: INestApplication;

  const callGetAppStatus = defineCall(() => app, 'get', '/');

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return OK on status check', async () => {
    const { statusCode, body } = await callGetAppStatus();

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body).toStrictEqual({
      message: 'OK',
      version: CONFIG.APP.VERSION,
      buildTimestamp: CONFIG.APP.BUILD_TIMESTAMP,
    });
  });
});
