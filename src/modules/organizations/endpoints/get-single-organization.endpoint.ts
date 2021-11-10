import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, Param, HttpStatus, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefineResponse } from '@/common/decorators/define-response';
import { AuthGuard } from '@/common/guards/auth.guard';
import {
  OrganizationDto,
  OrganizationIdPathParamDto,
} from '@/modules/organizations/dtos/organization.dto';
import { ORGANIZATIONS_TAG } from '@/modules/organizations/organizations.constant';
import { OrganizationsService } from '@/modules/organizations/services/organizations.service';

@Controller()
@ApiTags(ORGANIZATIONS_TAG)
export class GetSingleOrganizationEndpoint {
  constructor(
    private readonly em: EntityManager,
    private readonly organizationService: OrganizationsService,
  ) {}

  @Get('/organizations/:organizationId')
  @ApiOperation({ description: 'Get single organization' })
  @AuthGuard(true)
  @DefineResponse(HttpStatus.OK, OrganizationDto)
  async handler(@Param() { organizationId }: OrganizationIdPathParamDto) {
    return await this.organizationService.findOneByIdOrThrow(organizationId);
  }
}
