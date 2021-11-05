import { HttpStatus, INestApplication } from '@nestjs/common';
import faker from 'faker';
import { createApp } from '@/main';
import { setupRandomOrganization } from '@/modules/organizations/__test__/organizations.utils';
import { ORGANIZATIONS_ERROR } from '@/modules/organizations/organizations.constant';
import { setupCreateAuthUser } from '@/modules/users/__test__/users.utils';
import { USERS_ERROR } from '@/modules/users/users.constant';
import {
  clearDatabase,
  defineCall,
  expectHttpError,
  expectUUID,
} from '@/test-utils/common.util';

describe('organizations -> CreateOrganizationEndpoint', () => {
  let app: INestApplication;

  const randomOrganization = setupRandomOrganization(() => app);

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  const createAuthUser = setupCreateAuthUser(() => app);

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

  it('Should return UNAUTHENTICATED when no valid auth token was provided', async () => {
    const res = await callCreateOrganization();

    expectHttpError(res, USERS_ERROR.NO_VALID_TOKEN);
  });

  it('Should return PERMISSION_DENIED when called by non admin user', async () => {
    const authUser = await createAuthUser();

    const res = await callCreateOrganization(authUser.token);

    expectHttpError(res, USERS_ERROR.PERMISSION_DENIED);
  });

  it('Should return ORGANIZATION_ERROR.NAME_EXISTS when organization with provided name already exists', async () => {
    const authUser = await createAuthUser({ isAdmin: true });
    const existingOrganizations = await randomOrganization.one();

    const input = randomInput({ name: existingOrganizations.name });

    const res = await callCreateOrganization(authUser.token).send(input);

    expectHttpError(res, ORGANIZATIONS_ERROR.NAME_EXISTS);
  });

  it('Should return CreateOrganizationPayload', async () => {
    const authUser = await createAuthUser({ isAdmin: true });

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
