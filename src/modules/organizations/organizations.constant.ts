import { ConflictException, NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsTrimmed } from '@/common/decorators/validation';
import { composePropertyDecorators } from '@/common/utils';

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

const ORGANIZATION_VALIDATION = {
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
};
export const OrganizationNameApiProperty = () =>
  ApiProperty({
    type: 'string',
    minLength: ORGANIZATION_VALIDATION.NAME.MIN_LENGTH,
    maxLength: ORGANIZATION_VALIDATION.NAME.MAX_LENGTH,
    description: 'Name of the organization.',
  });

export const IsOrganizationNameValid = composePropertyDecorators(
  IsString(),
  MinLength(ORGANIZATION_VALIDATION.NAME.MIN_LENGTH),
  MaxLength(ORGANIZATION_VALIDATION.NAME.MAX_LENGTH),
  IsTrimmed(),
);
