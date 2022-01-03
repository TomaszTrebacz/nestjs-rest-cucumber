import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { IsTrimmed } from '@/common/validators';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { USER_VALIDATION, UserType } from '@/modules/users/users.constant';

export const UserEmailApiProperty = () =>
  ApiProperty({
    type: 'string',
    format: 'email',
    maxLength: USER_VALIDATION.EMAIL.MAX_LENGTH,
    description: 'Email of the user.',
  });

export const IsUserEmailValid = () =>
  applyDecorators(
    IsEmail(),
    MaxLength(USER_VALIDATION.EMAIL.MAX_LENGTH),
    IsTrimmed(),
  );

export const UserPasswordApiProperty = () =>
  ApiProperty({
    type: 'string',
    format: 'password',
    minLength: USER_VALIDATION.PASSWORD.MIN_LENGTH,
    maxLength: USER_VALIDATION.PASSWORD.MAX_LENGTH,
    description: 'Password of the user.',
  });

export const IsUserPasswordValid = () =>
  applyDecorators(
    MinLength(USER_VALIDATION.PASSWORD.MIN_LENGTH),
    MaxLength(USER_VALIDATION.PASSWORD.MAX_LENGTH),
  );

export const IsUserFullNameValid = () =>
  applyDecorators(
    MinLength(USER_VALIDATION.FULL_NAME.MIN_LENGTH),
    MaxLength(USER_VALIDATION.FULL_NAME.MAX_LENGTH),
    IsTrimmed(),
  );

export const UserFullNameApiProperty = () =>
  ApiProperty({
    type: 'string',
    minLength: USER_VALIDATION.FULL_NAME.MIN_LENGTH,
    maxLength: USER_VALIDATION.FULL_NAME.MAX_LENGTH,
    description: 'Full name of the user.',
  });

export const UserTypeApiProperty = () =>
  ApiProperty({
    type: 'string',
    enum: UserType,
    description: 'Type of the user.',
  });

export class UserResponseDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'ID of the user.',
  })
  id: string;

  @ApiProperty({
    type: 'date-time',
    description: 'Timestamp of the user creation.',
    example: '1970-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @UserEmailApiProperty()
  email: string;

  @UserFullNameApiProperty()
  fullName: string;

  @UserTypeApiProperty()
  type: UserType;

  constructor(data: UserEntity) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.email = data.email;
    this.fullName = data.fullName;
    this.type = data.type;
  }
}
