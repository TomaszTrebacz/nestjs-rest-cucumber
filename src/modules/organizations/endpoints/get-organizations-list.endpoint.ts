import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpStatus, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDecorator } from '@/common/decorators/response.decorator';
import { IsUndefinable } from '@/common/decorators/validation';
import { AuthGuard } from '@/common/guards/auth.guard';
import {
  createListQueryParamDto,
  returnPaginatedResult,
} from '@/common/helpers/list';
import { PaginatedOrganizationDto } from '@/modules/organizations/dtos/organization.dto';
import { OrganizationEntity } from '@/modules/organizations/entities/organization.entity';
import {
  IsOrganizationNameValid,
  OrganizationNameApiProperty,
  ORGANIZATIONS_TAG,
} from '@/modules/organizations/organizations.constant';

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

@Controller('/organizations')
@ApiTags(ORGANIZATIONS_TAG)
export class GetOrganizationsListEndpoint {
  constructor(private readonly em: EntityManager) {}

  @Get()
  @ApiOperation({ description: 'Get organizations list' })
  @AuthGuard(true)
  @ResponseDecorator(HttpStatus.OK, PaginatedOrganizationDto)
  async getOrganizationsListEndpoint(
    @Query() queryParam: GetOrganizationsListQueryParamDto,
  ) {
    const query = this.em.createQueryBuilder(OrganizationEntity);

    if (queryParam.name !== undefined) {
      query.andWhere({ name: { $ilike: `%${queryParam.name}%` } });
    }

    return await returnPaginatedResult(query, queryParam);
  }
}
