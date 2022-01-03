import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';
import { AUTH_ERROR } from '@/modules/auth/auth.constant';
import { UserType } from '@/modules/users/users.constant';

export const Auth = (...requiredUserTypes: UserType[]) => {
  const decorators = [
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: AUTH_ERROR.NO_VALID_TOKEN.message,
    }),
  ];

  if (requiredUserTypes.length > 0) {
    const joinedRequiredTypes = requiredUserTypes.join(', ');

    decorators.unshift(SetMetadata('requiredUserTypes', requiredUserTypes));
    decorators.push(
      ApiForbiddenResponse({
        description: `Auth user's type has to be one of "${joinedRequiredTypes}" to proceed this action.`,
      }),
    );
  }

  return applyDecorators(...decorators);
};
