import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpStatus, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/common/decorators/auth';
import { DefineResponse } from '@/common/decorators/define-response';
import {
  createListQueryParamDto,
  returnPaginatedResult,
} from '@/common/helpers/list';
import { IsUndefinable } from '@/common/validators';
import {
  PaginatedOrganizationResponseDto,
  IsOrganizationNameValid,
  OrganizationNameApiProperty,
} from '@/modules/organizations/dtos/organization.dto';
import { OrganizationEntity } from '@/modules/organizations/entities/organization.entity';
import { ORGANIZATIONS_TAG } from '@/modules/organizations/organizations.constant';
import { UserType } from '@/modules/users/users.constant';

const organizationSortMap: Record<string, string> = {
  createdAt: 'created_at',
  name: 'name',
};

class GetOrganizationsListQueryParamDto extends createListQueryParamDto(
  organizationSortMap,
  'createdAt',
) {
  @OrganizationNameApiProperty()
  @IsOrganizationNameValid()
  @IsUndefinable()
  name?: string;
}

@Controller()
@ApiTags(ORGANIZATIONS_TAG)
export class GetOrganizationsListEndpoint {
  constructor(private readonly em: EntityManager) {}

  @Get('/organizations')
  @ApiOperation({ description: 'Get organizations list' })
  @Auth(UserType.ADMIN)
  @DefineResponse(HttpStatus.OK, PaginatedOrganizationResponseDto)
  async handler(@Query() queryParam: GetOrganizationsListQueryParamDto) {
    const query = this.em.createQueryBuilder(OrganizationEntity);

    if (queryParam.name !== undefined) {
      query.andWhere({ name: { $ilike: `%${queryParam.name}%` } });
    }

    const paginatedOrganizations = await returnPaginatedResult(
      query,
      queryParam,
    );

    return new PaginatedOrganizationResponseDto(paginatedOrganizations);
  }
}
