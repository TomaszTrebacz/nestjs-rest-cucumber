import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, Param, Delete, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@/common/decorators/auth-user.decorator';
import { ResponseDecorator } from '@/common/decorators/response.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { OrganizationIdDto } from '@/modules/organizations/dtos/organization.dto';
import { ORGANIZATIONS_TAG } from '@/modules/organizations/organizations.constant';
import { OrganizationsService } from '@/modules/organizations/services/organizations.service';
import { UserEntity } from '@/modules/users/entities/user.entity';

@Controller('/organizations/:organizationId')
@ApiTags(ORGANIZATIONS_TAG)
export class DeleteOrganizationEndpoint {
  constructor(
    private readonly em: EntityManager,
    private readonly organizationService: OrganizationsService,
  ) {}

  @Delete()
  @ApiOperation({ description: 'Delete organization' })
  @AuthGuard(true)
  @ResponseDecorator(HttpStatus.NO_CONTENT)
  async deleteOrganization(
    @AuthUser() authUser: UserEntity,
    @Param() { organizationId }: OrganizationIdDto,
  ) {
    const organization = await this.organizationService.findOneByIdOrThrow(
      organizationId,
    );

    await this.em.removeAndFlush(organization);
  }
}
