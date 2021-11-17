import { INestApplication } from '@nestjs/common';
import faker from 'faker';
import { PartiallyRequired } from '@/common/types';
import { createRandomToken, hashString } from '@/common/utils';
import { SessionEntity } from '@/modules/auth/entities/session.entity';
import { setupRandomUser } from '@/modules/users/__test__/users.utils';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { randomEntityData } from '@/test-utils/random-entity-data';

const randomSessionInput = (): Partial<SessionEntity> => ({
  token: Buffer.from(faker.random.alphaNumeric(6)),
  expiresAt: new Date(),
});

type SessionInput = PartiallyRequired<SessionEntity, 'user'>;

export const setupRandomSession = randomEntityData<SessionEntity, SessionInput>(
  SessionEntity,
  randomSessionInput,
);

export const setupCreateAuthUser = (appFn: () => INestApplication) => {
  const randomUser = setupRandomUser(appFn);
  const randomSession = setupRandomSession(appFn);

  return async (input?: Partial<UserEntity>) => {
    const user = await randomUser.one(input);

    const token = await createRandomToken();
    await randomSession.one({
      token: hashString(token),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      user,
    });

    return { entity: user, token };
  };
};
