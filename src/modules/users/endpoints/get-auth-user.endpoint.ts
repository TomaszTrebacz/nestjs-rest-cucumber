import { Controller, HttpStatus, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/common/decorators/auth';
import { AuthUser } from '@/common/decorators/auth-user';
import { DefineResponse } from '@/common/decorators/define-response';
import { UserDto } from '@/modules/users/dtos/user.dto';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { USERS_TAG } from '@/modules/users/users.constant';

@Controller()
@ApiTags(USERS_TAG)
export class GetAuthUserEndpoint {
  @Get('/users/me')
  @ApiOperation({ description: 'Get auth user' })
  @Auth()
  @DefineResponse(HttpStatus.OK, UserDto)
  async handler(@AuthUser() authUser: UserEntity) {
    return authUser;
  }
}
