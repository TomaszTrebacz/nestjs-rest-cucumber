import faker from 'faker';
import { OrganizationEntity } from '@/modules/organizations/entities/organization.entity';
import { randomEntityData } from '@/test-utils/random-entity-data';

const randomOrganizationInput = (): Partial<OrganizationEntity> => ({
  name: faker.random.alphaNumeric(10),
});

export const setupRandomOrganization = randomEntityData(
  OrganizationEntity,
  randomOrganizationInput,
);
