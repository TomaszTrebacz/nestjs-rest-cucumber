import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '@/modules/users/services/auth.service';
import { USERS_ERROR } from '@/modules/users/users.constant';

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
