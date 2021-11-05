import {
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { IsTrimmed } from '@/common/decorators/validation';
import { composePropertyDecorators } from '@/common/utils';

export const USERS_ERROR = {
  NO_VALID_TOKEN: new UnauthorizedException(
    'No valid auth token provided',
    'NO_VALID_TOKEN',
  ),
  PERMISSION_DENIED: new ForbiddenException(
    'The caller does not have permission to execute the specified operation',
    'PERMISSION_DENIED',
  ),
  ID_NOT_FOUND: new NotFoundException(
    'User with provided id was not found',
    'USER_ID_NOT_FOUND',
  ),
  EMAIL_NOT_FOUND: new NotFoundException(
    'User with provided email was not found',
    'USER_EMAIL_NOT_FOUND',
  ),
  INVALID_PASSWORD: new NotFoundException(
    'Provided password is not valid',
    'USER_INVALID_PASSWORD',
  ),
  RESET_PASSWORD_TOKEN_EXPIRED: new NotFoundException(
    'Provided reset password token has expired',
    'USER_RESET_PASSWORD_TOKEN_EXPIRED',
  ),
  EMAIL_EXISTS: new ConflictException(
    'User with provided email already exists',
    'USER_EMAIL_EXISTS',
  ),
  ALREADY_ONBOARDED: new ConflictException(
    'You are already onboarded',
    'USER_ALREADY_ONBOARDED',
  ),
};

const USER_VALIDATION = {
  EMAIL: {
    MAX_LENGTH: 254,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 64,
  },
  FULL_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
};

export const IsUserEmailValid = composePropertyDecorators(
  IsEmail(),
  MaxLength(USER_VALIDATION.EMAIL.MAX_LENGTH),
  IsTrimmed(),
);

export const IsUserPasswordValid = composePropertyDecorators(
  MinLength(USER_VALIDATION.PASSWORD.MIN_LENGTH),
  MaxLength(USER_VALIDATION.PASSWORD.MAX_LENGTH),
);

export const IsUserFullNameValid = composePropertyDecorators(
  MinLength(USER_VALIDATION.FULL_NAME.MIN_LENGTH),
  MaxLength(USER_VALIDATION.FULL_NAME.MAX_LENGTH),
  IsTrimmed(),
);
