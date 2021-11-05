import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@/common/decorators/auth-user.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { OrganizationDto } from '@/modules/organizations/dtos/organization.dto';
import { OrganizationEntity } from '@/modules/organizations/entities/organization.entity';
import {
  IsOrganizationNameValid,
  OrganizationNameApiProperty,
  ORGANIZATIONS_TAG,
} from '@/modules/organizations/organizations.constant';
import { OrganizationsService } from '@/modules/organizations/services/organizations.service';
import { UserEntity } from '@/modules/users/entities/user.entity';

class CreateOrganizationBodyDto {
  @OrganizationNameApiProperty()
  @IsOrganizationNameValid()
  name!: string;
}

@Controller('/organizations')
@ApiTags(ORGANIZATIONS_TAG)
export class CreateOrganizationEndpoint {
  constructor(
    private readonly em: EntityManager,
    private readonly organizationService: OrganizationsService,
  ) {}

  @Post()
  @ApiOperation({ description: 'Create organization' })
  @AuthGuard(true)
  @ApiCreatedResponse({ type: OrganizationDto })
  @UseInterceptors(new TransformInterceptor(OrganizationDto))
  async createOrganization(
    @AuthUser() authUser: UserEntity,
    @Body() body: CreateOrganizationBodyDto,
  ) {
    await this.organizationService.assertNameUniqueness(body.name);

    const organization = new OrganizationEntity(body);

    await this.em.persistAndFlush(organization);

    return organization;
  }
}
