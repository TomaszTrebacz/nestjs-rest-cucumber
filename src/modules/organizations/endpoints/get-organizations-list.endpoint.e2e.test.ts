import { HttpStatus, INestApplication } from '@nestjs/common';
import { createApp } from '@/main';
import { setupCreateAuthUser } from '@/modules/auth/__test__/auth.utils';
import { AUTH_ERROR } from '@/modules/auth/auth.constant';
import { setupRandomOrganization } from '@/modules/organizations/__test__/organizations.utils';
import { OrganizationEntity } from '@/modules/organizations/entities/organization.entity';
import { UserType } from '@/modules/users/users.constant';
import {
  clearDatabase,
  defineCall,
  expectHttpError,
} from '@/test-utils/common.util';

const expectOrganization = (data: OrganizationEntity) => ({
  id: data.id,
  createdAt: data.createdAt.toISOString(),
  name: data.name,
});

describe('organizations -> GetOrganizationsListEndpoint', () => {
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

  const callGetOrganizationsList = defineCall(
    () => app,
    'get',
    '/organizations',
  );

  it('Should return UNAUTHENTICATED when no valid auth token was provided', async () => {
    const res = await callGetOrganizationsList();

    expectHttpError(res, AUTH_ERROR.NO_VALID_TOKEN);
  });

  it('Should return PERMISSION_DENIED when called by non admin user', async () => {
    const authUser = await createAuthUser();

    const res = await callGetOrganizationsList(authUser.token);

    expectHttpError(res, AUTH_ERROR.PERMISSION_DENIED);
  });

  it('Should return organizations with proper pagination of first page', async () => {
    const authUser = await createAuthUser({ type: UserType.ADMIN });

    await randomOrganization.some(3);

    const { status, body } = await callGetOrganizationsList(
      authUser.token,
    ).query({ perPage: 2 });

    expect(status).toBe(HttpStatus.OK);
    expect(body.totalCount).toBe(3);
    expect(body.nodes).toHaveLength(2);
  });

  it('Should return organizations with proper pagination of second page', async () => {
    const authUser = await createAuthUser({ type: UserType.ADMIN });

    await randomOrganization.some(3);

    const { status, body } = await callGetOrganizationsList(
      authUser.token,
    ).query({ page: 2, perPage: 2 });

    expect(status).toBe(HttpStatus.OK);
    expect(body.totalCount).toBe(3);
    expect(body.nodes).toHaveLength(1);
  });

  it('Should return organizations with proper sort by createdAt ASC', async () => {
    const authUser = await createAuthUser({ type: UserType.ADMIN });

    const organizations = await randomOrganization.many([
      { createdAt: new Date(Date.now() + 2000) },
      { createdAt: new Date(Date.now() + 1000) },
      { createdAt: new Date(Date.now() + 3000) },
    ]);

    const { status, body } = await callGetOrganizationsList(
      authUser.token,
    ).query({ sortBy: 'createdAt', sortDir: 'asc' });

    expect(status).toBe(HttpStatus.OK);
    expect(body.totalCount).toBe(3);
    expect(body.nodes).toStrictEqual([
      expectOrganization(organizations[1]),
      expectOrganization(organizations[0]),
      expectOrganization(organizations[2]),
    ]);
  });

  it('Should return organizations with proper sort by createdAt DESC', async () => {
    const authUser = await createAuthUser({ type: UserType.ADMIN });

    const organizations = await randomOrganization.many([
      { createdAt: new Date(Date.now() + 2000) },
      { createdAt: new Date(Date.now() + 1000) },
      { createdAt: new Date(Date.now() + 3000) },
    ]);

    const { status, body } = await callGetOrganizationsList(
      authUser.token,
    ).query({ sortBy: 'createdAt', sortDir: 'desc' });

    expect(status).toBe(HttpStatus.OK);
    expect(body.totalCount).toBe(3);
    expect(body.nodes).toStrictEqual([
      expectOrganization(organizations[2]),
      expectOrganization(organizations[0]),
      expectOrganization(organizations[1]),
    ]);
  });

  it('Should return organizations with proper sort by name ASC', async () => {
    const authUser = await createAuthUser({ type: UserType.ADMIN });

    const organizations = await randomOrganization.many([
      { name: 'bbb' },
      { name: 'aaa' },
      { name: 'ccc' },
    ]);

    const { status, body } = await callGetOrganizationsList(
      authUser.token,
    ).query({ sortBy: 'name', sortDir: 'asc' });

    expect(status).toBe(HttpStatus.OK);
    expect(body.totalCount).toBe(3);
    expect(body.nodes).toStrictEqual([
      expectOrganization(organizations[1]),
      expectOrganization(organizations[0]),
      expectOrganization(organizations[2]),
    ]);
  });

  it('Should return organizations with proper sort by name DESC', async () => {
    const authUser = await createAuthUser({ type: UserType.ADMIN });

    const organizations = await randomOrganization.many([
      { name: 'bbb' },
      { name: 'aaa' },
      { name: 'ccc' },
    ]);

    const { status, body } = await callGetOrganizationsList(
      authUser.token,
    ).query({ sortBy: 'name', sortDir: 'desc' });

    expect(status).toBe(HttpStatus.OK);
    expect(body.totalCount).toBe(3);
    expect(body.nodes).toStrictEqual([
      expectOrganization(organizations[2]),
      expectOrganization(organizations[0]),
      expectOrganization(organizations[1]),
    ]);
  });

  it('Should return organizations with proper filter by name', async () => {
    const authUser = await createAuthUser({ type: UserType.ADMIN });

    const organizations = await randomOrganization.many([
      { name: 'bbb' },
      { name: 'bCb' },
      { name: 'ccc' },
    ]);

    const { status, body } = await callGetOrganizationsList(
      authUser.token,
    ).query({ name: 'c' });

    expect(status).toBe(HttpStatus.OK);
    expect(body.totalCount).toBe(2);
    expect(body.nodes).toStrictEqual([
      expectOrganization(organizations[1]),
      expectOrganization(organizations[2]),
    ]);
  });
});
