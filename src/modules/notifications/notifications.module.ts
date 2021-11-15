import { Module } from '@nestjs/common';
import { EmailService } from '@/modules/notifications/services/email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}
