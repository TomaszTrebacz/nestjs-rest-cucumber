import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import argon2 from 'argon2';
import { Expose, Type } from 'class-transformer';
import { DefineResponse } from '@/common/decorators/define-response';
import { createRandomToken, hashString } from '@/common/utils';
import { AUTH_TAG } from '@/modules/auth/auth.constant';
import { SessionEntity } from '@/modules/auth/entities/session.entity';
import { AuthService } from '@/modules/auth/services/auth.service';
import {
  IsUserEmailValid,
  IsUserPasswordValid,
  UserDto,
  UserEmailApiProperty,
  UserPasswordApiProperty,
} from '@/modules/users/dtos/user.dto';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { USERS_ERROR } from '@/modules/users/users.constant';

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
@ApiTags(AUTH_TAG)
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
