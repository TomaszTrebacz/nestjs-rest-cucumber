import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, Param, Delete, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefineResponse } from '@/common/decorators/define-response';
import { AuthGuard, UserType } from '@/common/guards/auth.guard';
import { OrganizationIdPathParamDto } from '@/modules/organizations/dtos/organization.dto';
import { ORGANIZATIONS_TAG } from '@/modules/organizations/organizations.constant';
import { OrganizationsService } from '@/modules/organizations/services/organizations.service';

@Controller()
@ApiTags(ORGANIZATIONS_TAG)
export class DeleteOrganizationEndpoint {
  constructor(
    private readonly em: EntityManager,
    private readonly organizationService: OrganizationsService,
  ) {}

  @Delete('/organizations/:organizationId')
  @ApiOperation({ description: 'Delete organization' })
  @AuthGuard(UserType.ADMIN)
  @DefineResponse(HttpStatus.NO_CONTENT)
  async handler(@Param() { organizationId }: OrganizationIdPathParamDto) {
    const organization = await this.organizationService.findOneByIdOrThrow(
      organizationId,
    );

    await this.em.removeAndFlush(organization);
  }
}
