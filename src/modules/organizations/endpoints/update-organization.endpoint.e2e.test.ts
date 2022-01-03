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
  unknownId,
} from '@/test-utils/common.util';

describe('organizations -> UpdateOrganizationEndpoint', () => {
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

  const callUpdateOrganization = defineCall(
    () => app,
    'patch',
    (organizationId: string) => `/organizations/${organizationId}`,
  );

  const randomInput = (data?: Record<string, unknown>) => ({
    name: faker.random.alphaNumeric(6),
    ...data,
  });

  it('Should return UNAUTHENTICATED when no valid auth token was provided', async () => {
    const res = await callUpdateOrganization('', unknownId());

    expectHttpError(res, AUTH_ERROR.NO_VALID_TOKEN);
  });

  it('Should return PERMISSION_DENIED when called by non admin user', async () => {
    const authUser = await createAuthUser();

    const res = await callUpdateOrganization(authUser.token, unknownId());

    expectHttpError(res, AUTH_ERROR.PERMISSION_DENIED);
  });

  it('Should return NOT_FOUND when organization with provided id was not found', async () => {
    const authUser = await createAuthUser({ type: UserType.ADMIN });

    const res = await callUpdateOrganization(authUser.token, unknownId());

    expectHttpError(res, ORGANIZATIONS_ERROR.ID_NOT_FOUND);
  });

  it('Should return ORGANIZATION_ERROR.NAME_EXISTS when organization with provided name already exists', async () => {
    const authUser = await createAuthUser({ type: UserType.ADMIN });

    const organization = await randomOrganization.one();
    const existingOrganizations = await randomOrganization.one();

    const input = randomInput({
      name: existingOrganizations.name,
    });

    const res = await callUpdateOrganization(
      authUser.token,
      organization.id,
    ).send(input);

    expectHttpError(res, ORGANIZATIONS_ERROR.NAME_EXISTS);
  });

  it('Should return UpdateOrganizationPayload', async () => {
    const authUser = await createAuthUser({ type: UserType.ADMIN });

    const organization = await randomOrganization.one();

    const input = randomInput();

    const { status, body } = await callUpdateOrganization(
      authUser.token,
      organization.id,
    ).send(input);

    expect(status).toBe(HttpStatus.OK);
    expect(body).toStrictEqual({
      id: organization.id,
      createdAt: expect.any(String),
      name: input.name,
    });
  });
});
