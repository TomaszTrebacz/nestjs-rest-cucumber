import faker from 'faker';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { randomEntityData } from '@/test-utils/random-entity-data';

export const USER_PASSWORD = 'iop123';

const randomUserInput = (): Partial<UserEntity> => ({
  email: faker.unique(faker.internet.email),
  password: global.hashedUserPassword,
  fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
});

export const setupRandomUser = randomEntityData(UserEntity, randomUserInput);
