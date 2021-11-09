import { HttpStatus, INestApplication } from '@nestjs/common';
import { createApp } from '@/main';
import { setupRandomOrganization } from '@/modules/organizations/__test__/organizations.utils';
import { ORGANIZATIONS_ERROR } from '@/modules/organizations/organizations.constant';
import { setupCreateAuthUser } from '@/modules/users/__test__/users.utils';
import { USERS_ERROR } from '@/modules/users/users.constant';
import {
  clearDatabase,
  defineCall,
  expectHttpError,
  unknownId,
} from '@/test-utils/common.util';

describe('organizations -> GetSingleOrganizationEndpoint', () => {
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

  const callGetSingleOrganization = defineCall(
    () => app,
    'get',
    (organizationId: string) => `/organizations/${organizationId}`,
  );

  it('Should return UNAUTHENTICATED when no valid auth token was provided', async () => {
    const res = await callGetSingleOrganization('', unknownId());

    expectHttpError(res, USERS_ERROR.NO_VALID_TOKEN);
  });

  it('Should return PERMISSION_DENIED when called by non admin user', async () => {
    const authUser = await createAuthUser();

    const res = await callGetSingleOrganization(authUser.token, unknownId());

    expectHttpError(res, USERS_ERROR.PERMISSION_DENIED);
  });

  it('Should return NOT_FOUND when organization with provided id was not found', async () => {
    const authUser = await createAuthUser({ isAdmin: true });

    const res = await callGetSingleOrganization(authUser.token, unknownId());

    expectHttpError(res, ORGANIZATIONS_ERROR.ID_NOT_FOUND);
  });

  it('Should return organization', async () => {
    const authUser = await createAuthUser({ isAdmin: true });

    const organization = await randomOrganization.one();

    const { status, body } = await callGetSingleOrganization(
      authUser.token,
      organization.id,
    );

    expect(status).toBe(HttpStatus.OK);
    expect(body).toStrictEqual({
      id: organization.id,
      createdAt: expect.any(String),
      name: organization.name,
    });
  });
});
