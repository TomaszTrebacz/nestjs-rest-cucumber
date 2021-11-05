import { Config } from '@jest/types';
import argon2 from 'argon2';
import NodeEnvironment from 'jest-environment-node';
import { USER_PASSWORD } from '@/modules/users/__test__/users.utils';

class CustomEnvironment extends NodeEnvironment {
  constructor(config: Config.ProjectConfig) {
    super(config);
  }

  async setup() {
    this.global.hashedUserPassword = await argon2.hash(USER_PASSWORD);
  }

  async teardown() {
    await super.teardown();
  }
}

// eslint-disable-next-line import/no-default-export
export default CustomEnvironment;
