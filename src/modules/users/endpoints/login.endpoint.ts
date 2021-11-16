import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import argon2 from 'argon2';
import { Expose, Type } from 'class-transformer';
import { DefineResponse } from '@/common/decorators/define-response';
import { createRandomToken, hashString } from '@/common/utils';
import {
  IsUserEmailValid,
  IsUserPasswordValid,
  UserDto,
  UserEmailApiProperty,
  UserPasswordApiProperty,
} from '@/modules/users/dtos/user.dto';
import { SessionEntity } from '@/modules/users/entities/session.entity';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { AuthService } from '@/modules/users/services/auth.service';
import { USERS_ERROR, USERS_TAG } from '@/modules/users/users.constant';

class LoginBodyDto {
  @UserEmailApiProperty()
  @IsUserEmailValid()
  email!: string;

  @UserPasswordApiProperty()
  @IsUserPasswordValid()
  password!: string;
}

class LoginResponseDto {
  @ApiProperty({
    description:
      'Token that should be passed with following requests to authenticate user.',
  })
  @Expose()
  token!: string;

  @ApiProperty({ description: 'Logged user.' })
  @Type(() => UserDto)
  @Expose()
  user!: UserDto;
}

@Controller()
@ApiTags(USERS_TAG)
export class LoginEndpoint {
  constructor(
    private readonly em: EntityManager,
    private readonly authService: AuthService,
  ) {}

  @Post('/auth/login')
  @ApiOperation({ description: 'Login' })
  @DefineResponse(HttpStatus.CREATED, LoginResponseDto)
  async handler(@Body() body: LoginBodyDto) {
    const user = await this.em.findOne(UserEntity, {
      email: body.email,
    });

    if (!user) {
      throw USERS_ERROR.EMAIL_NOT_FOUND;
    }

    const isPasswordValid =
      user.password !== null &&
      (await argon2.verify(user.password, body.password));

    if (!isPasswordValid) {
      throw USERS_ERROR.INVALID_PASSWORD;
    }

    const token = await createRandomToken();

    const session = new SessionEntity({
      token: hashString(token),
      expiresAt: this.authService.getNewExpirationDate(),
      user,
    });

    await this.em.persistAndFlush(session);

    return { token, user };
  }
}
