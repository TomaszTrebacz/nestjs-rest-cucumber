import path from 'path';
import { Options } from '@mikro-orm/core';
import readlineSync from 'readline-sync';
import mikroOrmConfig from './mikro-orm.config';

const config: Options = {
  ...mikroOrmConfig,
  migrations: {
    tableName: 'migrations',
    path: path.join(__dirname, 'migrations'),
    pattern: /^\d+[a-z0-9-]+.[t|j]s$/,
    fileName(timestamp) {
      const migrationName = readlineSync
        .question(
          "What does this migration do? (Keep it short, it's going in the file name)\n> ",
        )
        .replace(/[^\w\s-]/g, '') // Remove any non-alphanumeric or whitespace characters
        .replace(/\s+/g, '-') // Replace any number of whitespace characters with the "-" char
        .toLowerCase();

      return `${timestamp}-${migrationName}`;
    },
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
