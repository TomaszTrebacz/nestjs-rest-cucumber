import { Controller, HttpStatus, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/common/decorators/auth';
import { AuthUser } from '@/common/decorators/auth-user';
import { DefineResponse } from '@/common/decorators/define-response';
import { AUTH_TAG } from '@/modules/auth/auth.constant';
import { UserResponseDto } from '@/modules/users/dtos/user.dto';
import { UserEntity } from '@/modules/users/entities/user.entity';

@Controller()
@ApiTags(AUTH_TAG)
export class GetAuthUserEndpoint {
  @Get('/auth/me')
  @ApiOperation({ description: 'Get auth user' })
  @Auth()
  @DefineResponse(HttpStatus.OK, UserResponseDto)
  async handler(@AuthUser() authUser: UserEntity) {
    return new UserResponseDto(authUser);
  }
}
