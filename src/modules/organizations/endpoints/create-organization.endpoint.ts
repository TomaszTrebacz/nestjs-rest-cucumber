import { EntityManager } from '@mikro-orm/postgresql';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefineResponse } from '@/common/decorators/define-response';
import { AuthGuard } from '@/common/guards/auth.guard';
import {
  IsOrganizationNameValid,
  OrganizationNameApiProperty,
  OrganizationDto,
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
  @AuthGuard(true)
  @DefineResponse(HttpStatus.CREATED, OrganizationDto)
  async handler(@Body() body: CreateOrganizationBodyDto) {
    await this.organizationService.assertNameUniqueness(body.name);

    const organization = new OrganizationEntity(body);

    await this.em.persistAndFlush(organization);

    return organization;
  }
}
