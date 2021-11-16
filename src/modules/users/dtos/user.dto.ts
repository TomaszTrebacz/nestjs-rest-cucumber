import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { IsTrimmed } from '@/common/validators';
import { USER_VALIDATION } from '@/modules/users/users.constant';

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

export class UserDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'ID of the user.',
  })
  @Expose()
  id!: string;

  @ApiProperty({
    type: 'date-time',
    description: 'Timestamp of the user creation.',
    example: '1970-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt!: Date;

  @UserEmailApiProperty()
  @Expose()
  email!: string;

  @UserFullNameApiProperty()
  @Expose()
  fullName!: string;

  @ApiProperty({ description: 'Indicates whether user is an admin.' })
  @Expose()
  isAdmin!: boolean;

  @ApiProperty({ description: 'Indicates whether user is already onboarded.' })
  @Expose()
  isOnboarded!: boolean;
}
