import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
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
})
export class OrganizationsModule {}
