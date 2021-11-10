import { Controller, HttpStatus, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@/common/decorators/auth-user.decorator';
import { ResponseDecorator } from '@/common/decorators/response.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { UserDto } from '@/modules/users/dtos/user.dto';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { USERS_TAG } from '@/modules/users/users.constant';

@Controller('/users/me')
@ApiTags(USERS_TAG)
export class GetAuthUserEndpoint {
  @Get()
  @ApiOperation({ description: 'Get auth user' })
  @AuthGuard()
  @ResponseDecorator(HttpStatus.OK, UserDto)
  async getSingleOrganizationEndpoint(@AuthUser() authUser: UserEntity) {
    return authUser;
  }
}
