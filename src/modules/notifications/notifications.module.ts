import { forwardRef, Module } from '@nestjs/common';
import { AwsModule } from '@/modules/aws/aws.module';
import { WsGateway } from '@/modules/notifications/gateways/ws.gateway';
import { EmailService } from '@/modules/notifications/services/email.service';
import { RedisModule } from '@/modules/redis/redis.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => RedisModule),
    forwardRef(() => AwsModule),
  ],
  providers: [WsGateway, EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}
