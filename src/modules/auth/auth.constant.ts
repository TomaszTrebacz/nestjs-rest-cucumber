import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

export const AUTH_TAG = 'Auth';

export const AUTH_ERROR = {
  NO_VALID_TOKEN: new UnauthorizedException(
    'No valid auth token provided',
    'NO_VALID_TOKEN',
  ),
  PERMISSION_DENIED: new ForbiddenException(
    'The caller does not have permission to execute the specified operation',
    'PERMISSION_DENIED',
  ),
};
