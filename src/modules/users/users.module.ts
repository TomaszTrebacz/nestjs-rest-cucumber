import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/services/users.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  providers: [UsersService],
  exports: [MikroOrmModule, UsersService],
})
export class UsersModule {}
