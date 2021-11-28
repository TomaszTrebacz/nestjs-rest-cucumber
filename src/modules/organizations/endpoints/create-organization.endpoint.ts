import { EntityManager } from '@mikro-orm/postgresql';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, UserType } from '@/common/decorators/auth';
import { DefineResponse } from '@/common/decorators/define-response';
import {
  IsOrganizationNameValid,
  OrganizationNameApiProperty,
  OrganizationResponseDto,
} from '@/modules/organizations/dtos/organization.dto';
import { OrganizationEntity } from '@/modules/organizations/entities/organization.entity';
import { ORGANIZATIONS_TAG } from '@/modules/organizations/organizations.constant';
import { OrganizationsService } from '@/modules/organizations/services/organizations.service';

class CreateOrganizationBodyDto {
  @OrganizationNameApiProperty()
  @IsOrganizationNameValid()
  name!: string;
}

@Controller()
@ApiTags(ORGANIZATIONS_TAG)
export class CreateOrganizationEndpoint {
  constructor(
    private readonly em: EntityManager,
    private readonly organizationService: OrganizationsService,
  ) {}

  @Post('/organizations')
  @ApiOperation({ description: 'Create organization' })
  @Auth(UserType.ADMIN)
  @DefineResponse(HttpStatus.CREATED, OrganizationResponseDto)
  async handler(
    @Body() body: CreateOrganizationBodyDto,
  ): Promise<OrganizationResponseDto> {
    await this.organizationService.assertNameUniqueness(body.name);

    const organization = new OrganizationEntity(body);

    await this.em.persistAndFlush(organization);

    return new OrganizationResponseDto(organization);
  }
}
