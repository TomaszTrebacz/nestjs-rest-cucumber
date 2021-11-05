import { EntityManager } from '@mikro-orm/postgresql';
import { INestApplication, HttpException } from '@nestjs/common';
import faker from 'faker';
import request, { Response } from 'supertest';

export const clearDatabase = async (app: INestApplication) => {
  const em = app.get(EntityManager);

  const migrationsTableName = em.config.get('migrations').tableName;

  await em.getConnection().execute(`
      DO $$
      DECLARE
          table_name text;
      BEGIN
          SET session_replication_role = 'replica';
          
          FOR table_name IN
              SELECT tables.table_name
              FROM information_schema.tables
              WHERE
                  tables.table_schema = 'public'
                  AND tables.table_name != '${migrationsTableName}'
          LOOP
              EXECUTE format('DELETE FROM %s', table_name);
          END LOOP;
          
          SET session_replication_role = 'origin';
      END $$;
  `);
};

type ReqMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
type PathFn = (...args: string[]) => string;

export const defineCall =
  <T extends PathFn>(
    appFn: () => INestApplication,
    method: ReqMethod,
    path: T | string,
  ) =>
  (authToken = '', ...params: Parameters<T>): request.Test => {
    const methodPath = typeof path === 'string' ? path : path(...params);

    return request(appFn().getHttpServer())
      [method](methodPath)
      .set('Authorization', `Bearer ${authToken}`);
  };

export const unknownId = () => faker.datatype.uuid();

export const unknownUploadToken = () => faker.random.alphaNumeric(24);

export const expectUUID = expect.stringMatching(
  /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/,
);

export const expectHttpError = (
  res: Response,
  exception: HttpException,
): void => {
  expect(res.status).toBe(exception.getStatus());
  expect(res.body).toStrictEqual(exception.getResponse());
};
