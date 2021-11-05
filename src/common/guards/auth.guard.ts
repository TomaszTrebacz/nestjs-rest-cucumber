import {
  applyDecorators,
  SetMetadata,
  UseGuards,
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { AuthService } from '@/modules/users/services/auth.service';
import { USERS_ERROR } from '@/modules/users/users.constant';

@Injectable()
class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const session = await this.authService.getSessionFromHeader(req);

    if (!session) {
      throw USERS_ERROR.NO_VALID_TOKEN;
    }
    const isAdmin = this.reflector.get<boolean | undefined>(
      'isAdmin',
      context.getHandler(),
    );

    if (isAdmin !== undefined && session.user.isAdmin !== isAdmin) {
      throw USERS_ERROR.PERMISSION_DENIED;
    }

    req.session = session;
    req.authUser = session.user;

    return true;
  }
}

export const AuthGuard = (isAdmin?: boolean) => {
  const decorators = [
    UseGuards(AuthenticationGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: USERS_ERROR.NO_VALID_TOKEN.message,
    }),
  ];

  if (isAdmin !== undefined) {
    decorators.unshift(SetMetadata('isAdmin', isAdmin));
    decorators.push(
      ApiForbiddenResponse({
        description: `Auth user isAdmin parameter is not equal to "${isAdmin}".`,
      }),
    );
  }

  return applyDecorators(...decorators);
};
