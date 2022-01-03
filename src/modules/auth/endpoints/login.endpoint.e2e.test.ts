import { HttpStatus, INestApplication } from '@nestjs/common';
import faker from 'faker';
import { createApp } from '@/main';
import {
  setupRandomUser,
  USER_PASSWORD,
} from '@/modules/users/__test__/users.utils';
import { USERS_ERROR } from '@/modules/users/users.constant';
import {
  clearDatabase,
  defineCall,
  expectHttpError,
} from '@/test-utils/common.util';

describe('auth -> LoginEndpoint', () => {
  let app: INestApplication;

  const randomUser = setupRandomUser(() => app);

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await clearDatabase(app);
  });

  const callLogin = defineCall(() => app, 'post', `/auth/login`);

  const randomInput = (data?: Record<string, unknown>) => ({
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(6),
    ...data,
  });

  it('Should return EMAIL_NOT_FOUND when user with provided email was not found', async () => {
    const input = randomInput();

    const res = await callLogin().send(input);

    expectHttpError(res, USERS_ERROR.EMAIL_NOT_FOUND);
  });

  it('Should return INVALID_PASSWORD when provided password does not match email', async () => {
    const user = await randomUser.one();

    const input = randomInput({ email: user.email });

    const res = await callLogin().send(input);

    expectHttpError(res, USERS_ERROR.INVALID_PASSWORD);
  });

  it('Should return LoginPayload', async () => {
    const user = await randomUser.one();

    const input = randomInput({ email: user.email, password: USER_PASSWORD });

    const { status, body } = await callLogin().send(input);

    expect(status).toBe(HttpStatus.CREATED);
    expect(body).toStrictEqual({
      token: expect.any(String),
      user: {
        id: user.id,
        createdAt: user.createdAt.toISOString(),
        email: user.email,
        fullName: user.fullName,
        type: user.type,
      },
    });
  });
});
