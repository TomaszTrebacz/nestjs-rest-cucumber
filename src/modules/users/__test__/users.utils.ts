import { EntityManager } from '@mikro-orm/postgresql';
import { INestApplication } from '@nestjs/common';
import faker from 'faker';
import { createRandomToken, hashString } from '@/common/utils';
import { SessionEntity } from '@/modules/users/entities/session.entity';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { randomEntityData } from '@/test-utils/random-entity-data';

export const USER_PASSWORD = 'iop123';

const randomUserInput = (): Partial<UserEntity> => ({
  email: faker.internet.email(),
  password: global.hashedUserPassword,
  fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
});

export const setupRandomUser = randomEntityData(UserEntity, randomUserInput);

const randomSessionInput = (): Partial<SessionEntity> => ({
  token: Buffer.from(faker.random.alphaNumeric(6)),
  expiresAt: new Date(),
});

type SessionInput = Partial<SessionEntity> & { user: UserEntity };

export const setupRandomSession = randomEntityData<SessionEntity, SessionInput>(
  SessionEntity,
  randomSessionInput,
);

export const setupCreateAuthUser = (appFn: () => INestApplication) => {
  const randomUser = setupRandomUser(appFn);

  return async (input?: Partial<UserEntity>) => {
    const em = appFn().get(EntityManager);

    const user = await randomUser.one(input);

    const token = await createRandomToken();
    const hashedToken = hashString(token);

    const session = new SessionEntity({
      token: hashedToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      user,
    });

    await em.persistAndFlush(session);

    return { entity: user, token };
  };
};
