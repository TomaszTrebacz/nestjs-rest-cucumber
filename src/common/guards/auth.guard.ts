import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_ERROR } from '@/modules/auth/auth.constant';
import { AuthService } from '@/modules/auth/services/auth.service';

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
    const isAdmin = this.reflector.get<boolean | undefined>(
      'isAdmin',
      context.getHandler(),
    );

    if (isAdmin !== undefined && session.user.isAdmin !== isAdmin) {
      throw AUTH_ERROR.PERMISSION_DENIED;
    }

    req.session = session;
    req.authUser = session.user;

    return true;
  }
}
