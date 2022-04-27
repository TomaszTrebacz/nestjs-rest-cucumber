import { HttpStatus, INestApplication } from '@nestjs/common';
import faker from 'faker';
import { defineFeature, DefineStepFunction, loadFeature } from 'jest-cucumber';
import { createApp } from '@/main';
import {
  setupRandomUser,
  USER_PASSWORD,
} from '@/modules/users/__test__/users.utils';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { USERS_ERROR } from '@/modules/users/users.constant';
import {
  clearDatabase,
  defineCall,
  expectHttpError,
} from '@/test-utils/common.util';

const feature = loadFeature('./login.endpoint.e2e.test.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let app: INestApplication;
  let user: UserEntity;

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

  const givenRandomUserIsCreatedInDatabase = (given: DefineStepFunction) => {
    given('random user is created in database', async () => {
      user = await randomUser.one();
    });
  };

  test('Email is not found', ({ given, then }) => {
    let input: Record<string, unknown>;

    given('email which does not exist in database', () => {
      input = randomInput();
    });

    then('API throws error that email was not found', async () => {
      const res = await callLogin().send(input);

      expectHttpError(res, USERS_ERROR.EMAIL_NOT_FOUND);
    });
  });

  test('Password is invalid', ({ given, when, then }) => {
    let input: Record<string, unknown>;

    givenRandomUserIsCreatedInDatabase(given);

    when('password is different from the one in database', () => {
      input = randomInput({ email: user.email });
    });

    then('API throws error that password is invalid', async () => {
      const res = await callLogin().send(input);

      expectHttpError(res, USERS_ERROR.INVALID_PASSWORD);
    });
  });

  test('Login is successful', ({ given, when, then, and }) => {
    let input: Record<string, unknown>;
    let status: number;
    let body: Record<string, unknown>;

    givenRandomUserIsCreatedInDatabase(given);

    when('credentials are valid', () => {
      input = randomInput({ email: user.email, password: USER_PASSWORD });
    });

    then('API should return status 201', async () => {
      ({ status, body } = await callLogin().send(input));

      expect(status).toBe(HttpStatus.CREATED);
    });

    and('API should return user with token', () => {
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
});
