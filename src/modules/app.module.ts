import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import MikroOrmConfig from '../mikro-orm.config';
import { GetAppStatusEndpoint } from './get-app-status.endpoint';
import { AwsModule } from '@/modules/aws/aws.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(MikroOrmConfig),
    UsersModule,
    OrganizationsModule,
    NotificationsModule,
    AwsModule,
  ],
  controllers: [GetAppStatusEndpoint],
})
export class AppModule {}
