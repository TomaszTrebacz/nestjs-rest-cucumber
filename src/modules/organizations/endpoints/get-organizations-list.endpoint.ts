import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpStatus, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefineResponse } from '@/common/decorators/define-response';
import { AuthGuard } from '@/common/guards/auth.guard';
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
  @AuthGuard(true)
  @DefineResponse(HttpStatus.OK, PaginatedOrganizationResponseDto)
  async handler(@Query() queryParam: GetOrganizationsListQueryParamDto) {
    const query = this.em.createQueryBuilder(OrganizationEntity);

    if (queryParam.name !== undefined) {
      query.andWhere({ name: { $ilike: `%${queryParam.name}%` } });
    }

    return await returnPaginatedResult(query, queryParam);
  }
}
