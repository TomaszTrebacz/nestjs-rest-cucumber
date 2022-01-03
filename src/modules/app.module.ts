import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { UsersModule } from '@/modules/users/users.module';
import mikroOrmConfig from '../mikro-orm.config';
import { GetAppStatusEndpoint } from './get-app-status.endpoint';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    NotificationsModule,
  ],
  controllers: [GetAppStatusEndpoint],
})
export class AppModule {}
