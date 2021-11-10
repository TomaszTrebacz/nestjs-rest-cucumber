import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, Param, HttpStatus, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDecorator } from '@/common/decorators/response.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import {
  OrganizationDto,
  OrganizationIdDto,
} from '@/modules/organizations/dtos/organization.dto';
import { ORGANIZATIONS_TAG } from '@/modules/organizations/organizations.constant';
import { OrganizationsService } from '@/modules/organizations/services/organizations.service';

@Controller('/organizations/:organizationId')
@ApiTags(ORGANIZATIONS_TAG)
export class GetSingleOrganizationEndpoint {
  constructor(
    private readonly em: EntityManager,
    private readonly organizationService: OrganizationsService,
  ) {}

  @Get()
  @ApiOperation({ description: 'Get single organization' })
  @AuthGuard(true)
  @ResponseDecorator(HttpStatus.OK, OrganizationDto)
  async getSingleOrganizationEndpoint(
    @Param() { organizationId }: OrganizationIdDto,
  ) {
    return await this.organizationService.findOneByIdOrThrow(organizationId);
  }
}
