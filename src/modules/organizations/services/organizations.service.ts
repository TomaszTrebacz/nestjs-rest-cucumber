import { FilterQuery } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { OrganizationEntity } from '@/modules/organizations/entities/organization.entity';
import { ORGANIZATIONS_ERROR } from '@/modules/organizations/organizations.constant';

@Injectable()
export class OrganizationsService {
  constructor(private readonly em: EntityManager) {}

  async findOneByIdOrThrow(id: string): Promise<OrganizationEntity> {
    const organization = await this.em.findOne(OrganizationEntity, id);

    if (!organization) {
      throw ORGANIZATIONS_ERROR.ID_NOT_FOUND;
    }

    return organization;
  }

  async assertNameUniqueness(
    name: string,
    otherThanId?: string,
  ): Promise<void> {
    const filterQuery: FilterQuery<OrganizationEntity> = {
      name,
    };

    if (otherThanId !== undefined) {
      filterQuery.id = { $ne: otherThanId };
    }

    const doesNameExists = await this.em.findOne(
      OrganizationEntity,
      filterQuery,
    );

    if (doesNameExists) {
      throw ORGANIZATIONS_ERROR.NAME_EXISTS;
    }
  }
}
