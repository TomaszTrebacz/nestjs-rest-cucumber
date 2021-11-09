import { EntityManager } from '@mikro-orm/postgresql';
import { Body, Controller, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@/common/decorators/auth-user.decorator';
import { ResponseDecorator } from '@/common/decorators/response.decorator';
import { IsUndefinable } from '@/common/decorators/validation';
import { AuthGuard } from '@/common/guards/auth.guard';
import {
  OrganizationDto,
  OrganizationIdDto,
} from '@/modules/organizations/dtos/organization.dto';
import {
  IsOrganizationNameValid,
  OrganizationNameApiProperty,
  ORGANIZATIONS_TAG,
} from '@/modules/organizations/organizations.constant';
import { OrganizationsService } from '@/modules/organizations/services/organizations.service';
import { UserEntity } from '@/modules/users/entities/user.entity';

class UpdateOrganizationBodyDto {
  @OrganizationNameApiProperty()
  @IsUndefinable()
  @IsOrganizationNameValid()
  name?: string;
}

@Controller('/organizations/:organizationId')
@ApiTags(ORGANIZATIONS_TAG)
export class UpdateOrganizationEndpoint {
  constructor(
    private readonly em: EntityManager,
    private readonly organizationService: OrganizationsService,
  ) {}

  @Patch()
  @ApiOperation({ description: 'Update organization' })
  @AuthGuard(true)
  @ResponseDecorator(HttpStatus.OK, OrganizationDto)
  async updateOrganization(
    @AuthUser() authUser: UserEntity,
    @Param() { organizationId }: OrganizationIdDto,
    @Body() body: UpdateOrganizationBodyDto,
  ) {
    const organization = await this.organizationService.findOneByIdOrThrow(
      organizationId,
    );

    if (body.name !== undefined) {
      await this.organizationService.assertNameUniqueness(
        body.name,
        organizationId,
      );
    }

    this.em.assign(organization, body);

    await this.em.flush();

    return organization;
  }
}
