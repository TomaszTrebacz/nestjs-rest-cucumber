import { HttpStatus, INestApplication } from '@nestjs/common';
import { createApp } from '@/main';
import { setupCreateAuthUser } from '@/modules/auth/__test__/auth.utils';
import { AUTH_ERROR } from '@/modules/auth/auth.constant';
import {
  clearDatabase,
  defineCall,
  expectHttpError,
} from '@/test-utils/common.util';

describe('auth -> GetAuthUserEndpoint', () => {
  let app: INestApplication;

  const createAuthUser = setupCreateAuthUser(() => app);

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await clearDatabase(app);
  });

  const callGetAuthUser = defineCall(() => app, 'get', `/auth/me`);

  it('Should return UNAUTHENTICATED when no valid auth token was provided', async () => {
    const res = await callGetAuthUser('');

    expectHttpError(res, AUTH_ERROR.NO_VALID_TOKEN);
  });

  it('Should return auth user', async () => {
    const authUser = await createAuthUser();

    const { status, body } = await callGetAuthUser(authUser.token);

    expect(status).toBe(HttpStatus.OK);
    expect(body).toStrictEqual({
      id: authUser.entity.id,
      createdAt: expect.any(String),
      email: authUser.entity.email,
      fullName: authUser.entity.fullName,
      type: authUser.entity.type,
    });
  });
});
