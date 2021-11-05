import { MaxLength, MinLength } from 'class-validator';
import { IsTrimmed } from '@/common/decorators/validation';
import { composePropertyDecorators } from '@/common/utils';

export const ORGANIZATIONS_ERROR = {
  // ID_NOT_FOUND: new ApolloError(
  //   'Organization with provided id was not found',
  //   'ORGANIZATION_ID_NOT_FOUND',
  // ),
  // NAME_EXISTS: new ApolloError(
  //   'Organization with provided name already exists',
  //   'ORGANIZATION_NAME_EXISTS',
  // ),
};

const ORGANIZATION_VALIDATION = {
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
};

export const IsOrganizationNameValid = composePropertyDecorators(
  MinLength(ORGANIZATION_VALIDATION.NAME.MIN_LENGTH),
  MaxLength(ORGANIZATION_VALIDATION.NAME.MAX_LENGTH),
  IsTrimmed(),
);
