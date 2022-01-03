import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_ERROR } from '@/modules/auth/auth.constant';
import { AuthService } from '@/modules/auth/services/auth.service';
import { UserType } from '@/modules/users/users.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const session = await this.authService.getSessionFromHeader(req);

    if (!session) {
      throw AUTH_ERROR.NO_VALID_TOKEN;
    }
    const requiredUserTypes = this.reflector.get<UserType[] | undefined>(
      'requiredUserTypes',
      context.getHandler(),
    );

    if (
      requiredUserTypes !== undefined &&
      !requiredUserTypes.includes(session.user.type)
    ) {
      throw AUTH_ERROR.PERMISSION_DENIED;
    }

    req.session = session;
    req.authUser = session.user;

    return true;
  }
}
