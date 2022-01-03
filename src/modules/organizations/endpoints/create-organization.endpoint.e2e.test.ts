import { HttpStatus, INestApplication } from '@nestjs/common';
import faker from 'faker';
import { createApp } from '@/main';
import { setupCreateAuthUser } from '@/modules/auth/__test__/auth.utils';
import { AUTH_ERROR } from '@/modules/auth/auth.constant';
import { setupRandomOrganization } from '@/modules/organizations/__test__/organizations.utils';
import { ORGANIZATIONS_ERROR } from '@/modules/organizations/organizations.constant';
import { UserType } from '@/modules/users/users.constant';
import {
  clearDatabase,
  defineCall,
  expectHttpError,
  expectUUID,
} from '@/test-utils/common.util';

describe('organizations -> CreateOrganizationEndpoint', () => {
  let app: INestApplication;

  const createAuthUser = setupCreateAuthUser(() => app);
  const randomOrganization = setupRandomOrganization(() => app);

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await clearDatabase(app);
  });

  const callCreateOrganization = defineCall(
    () => app,
    'post',
    '/organizations',
  );

  const randomInput = (data?: Record<string, unknown>) => ({
    name: faker.random.alphaNumeric(6),
    ...data,
  });

  it('Should return AUTH_ERROR.NO_VALID_TOKEN when no valid auth token was provided', async () => {
    const res = await callCreateOrganization();

    expectHttpError(res, AUTH_ERROR.NO_VALID_TOKEN);
  });

  it('Should return AUTH_ERROR.PERMISSION_DENIED when called by non admin user', async () => {
    const authUser = await createAuthUser();

    const res = await callCreateOrganization(authUser.token);

    expectHttpError(res, AUTH_ERROR.PERMISSION_DENIED);
  });

  it('Should return ORGANIZATION_ERROR.NAME_EXISTS when organization with provided name already exists', async () => {
    const authUser = await createAuthUser({ type: UserType.ADMIN });
    const existingOrganizations = await randomOrganization.one();

    const input = randomInput({ name: existingOrganizations.name });

    const res = await callCreateOrganization(authUser.token).send(input);

    expectHttpError(res, ORGANIZATIONS_ERROR.NAME_EXISTS);
  });

  it('Should return CreateOrganizationPayload', async () => {
    const authUser = await createAuthUser({ type: UserType.ADMIN });

    const input = randomInput();

    const { status, body } = await callCreateOrganization(authUser.token).send(
      input,
    );

    expect(status).toBe(HttpStatus.CREATED);
    expect(body).toStrictEqual({
      id: expectUUID,
      createdAt: expect.any(String),
      name: input.name,
    });
  });
});
