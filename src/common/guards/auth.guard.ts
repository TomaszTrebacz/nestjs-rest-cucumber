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
    const userType = this.reflector.get<UserType | undefined>(
      'userType',
      context.getHandler(),
    );

    if (userType !== undefined && session.user.type !== userType) {
      throw AUTH_ERROR.PERMISSION_DENIED;
    }

    req.session = session;
    req.authUser = session.user;

    return true;
  }
}
