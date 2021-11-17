import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import MikroOrmConfig from '../mikro-orm.config';
import { GetAppStatusEndpoint } from './get-app-status.endpoint';
import { AuthModule } from '@/modules/auth/auth.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(MikroOrmConfig),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    NotificationsModule,
  ],
  controllers: [GetAppStatusEndpoint],
})
export class AppModule {}
