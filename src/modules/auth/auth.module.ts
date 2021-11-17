import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { GetAuthUserEndpoint } from '@/modules/auth/endpoints/get-auth-user.endpoint';
import { LoginEndpoint } from '@/modules/auth/endpoints/login.endpoint';
import { SessionEntity } from '@/modules/auth/entities/session.entity';
import { AuthService } from '@/modules/auth/services/auth.service';
import { NotificationsModule } from '@/modules/notifications/notifications.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([SessionEntity]),
    forwardRef(() => NotificationsModule),
  ],
  providers: [AuthService],
  exports: [MikroOrmModule, AuthService],
  controllers: [LoginEndpoint, GetAuthUserEndpoint],
})
export class AuthModule {}
