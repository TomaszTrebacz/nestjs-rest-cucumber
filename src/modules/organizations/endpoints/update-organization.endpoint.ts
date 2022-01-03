import { EntityManager } from '@mikro-orm/postgresql';
import { Body, Controller, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/common/decorators/auth';
import { DefineResponse } from '@/common/decorators/define-response';
import { IsUndefinable } from '@/common/validators';
import {
  OrganizationResponseDto,
  OrganizationIdPathParamDto,
  IsOrganizationNameValid,
  OrganizationNameApiProperty,
} from '@/modules/organizations/dtos/organization.dto';
import { ORGANIZATIONS_TAG } from '@/modules/organizations/organizations.constant';
import { OrganizationsService } from '@/modules/organizations/services/organizations.service';
import { UserType } from '@/modules/users/users.constant';

class UpdateOrganizationBodyDto {
  @OrganizationNameApiProperty()
  @IsUndefinable()
  @IsOrganizationNameValid()
  name?: string;
}

@Controller()
@ApiTags(ORGANIZATIONS_TAG)
export class UpdateOrganizationEndpoint {
  constructor(
    private readonly em: EntityManager,
    private readonly organizationService: OrganizationsService,
  ) {}

  @Patch('/organizations/:organizationId')
  @ApiOperation({ description: 'Update organization' })
  @Auth(UserType.ADMIN)
  @DefineResponse(HttpStatus.OK, OrganizationResponseDto)
  async handler(
    @Param() { organizationId }: OrganizationIdPathParamDto,
    @Body() body: UpdateOrganizationBodyDto,
  ): Promise<OrganizationResponseDto> {
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

    return new OrganizationResponseDto(organization);
  }
}
