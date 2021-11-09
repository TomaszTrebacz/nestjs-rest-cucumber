import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { CreateOrganizationEndpoint } from '@/modules/organizations/endpoints/create-organization.endpoint';
import { DeleteOrganizationEndpoint } from '@/modules/organizations/endpoints/delete-organization.endpoint';
import { UpdateOrganizationEndpoint } from '@/modules/organizations/endpoints/update-organization.endpoint';
import { OrganizationEntity } from '@/modules/organizations/entities/organization.entity';
import { OrganizationsService } from '@/modules/organizations/services/organizations.service';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([OrganizationEntity]),
    forwardRef(() => UsersModule),
  ],
  providers: [OrganizationsService],
  exports: [MikroOrmModule, OrganizationsService],
  controllers: [
    CreateOrganizationEndpoint,
    UpdateOrganizationEndpoint,
    DeleteOrganizationEndpoint,
  ],
})
export class OrganizationsModule {}
