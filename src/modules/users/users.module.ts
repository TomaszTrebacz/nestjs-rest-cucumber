import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { GetAuthUserEndpoint } from '@/modules/users/endpoints/get-auth-user.endpoint';
import { SessionEntity } from '@/modules/users/entities/session.entity';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { AuthService } from '@/modules/users/services/auth.service';
import { UsersService } from '@/modules/users/services/users.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserEntity, SessionEntity]),
    forwardRef(() => OrganizationsModule),
    forwardRef(() => NotificationsModule),
  ],
  providers: [AuthService, UsersService],
  exports: [MikroOrmModule, AuthService, UsersService],
  controllers: [GetAuthUserEndpoint],
})
export class UsersModule {}
