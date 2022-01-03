import { MikroORM } from '@mikro-orm/core';
import argon2 from 'argon2';
import yargs from 'yargs';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { UserType } from '@/modules/users/users.constant';
import ormConfig from '../mikro-orm.config';

const args = yargs
  .wrap(120)
  .version(false)
  .usage('Example usage:\n')
  .usage('npm run script:createAdmin -- -e eg@example.com -p somePass')
  .options({
    email: {
      alias: 'e',
      description: 'User email',
      type: 'string',
      demandOption: true,
    },
    password: {
      alias: 'p',
      description: 'User password',
      type: 'string',
      demandOption: true,
    },
  })
  .help()
  .alias('h', 'help')
  .parse();

(async () => {
  const orm = await MikroORM.init(ormConfig);
  const em = orm.em.fork();

  try {
    const { email, password } = await args;

    const existingUser = await em.findOne(UserEntity, {
      email,
    });

    if (existingUser) {
      throw new Error('User with provided email already exists');
    }

    const adminUser = new UserEntity({
      email,
      password: await argon2.hash(password),
      type: UserType.ADMIN,
    });

    await em.persistAndFlush(adminUser);
    console.log('Admin user was created successfully');
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(`Error: ${err?.message}`);
  } finally {
    await orm.close();
  }
})();
