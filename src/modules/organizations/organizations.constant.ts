import { ConflictException, NotFoundException } from '@nestjs/common';

export const ORGANIZATIONS_TAG = 'Organizations';

export const ORGANIZATIONS_ERROR = {
  ID_NOT_FOUND: new NotFoundException(
    'Organization with provided id was not found',
    'ORGANIZATION_ID_NOT_FOUND',
  ),
  NAME_EXISTS: new ConflictException(
    'Organization with provided name already exists',
    'ORGANIZATION_NAME_EXISTS',
  ),
};

export const ORGANIZATION_VALIDATION = {
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
};
