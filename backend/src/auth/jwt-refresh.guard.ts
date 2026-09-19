import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard untuk memproteksi endpoint POST /auth/refresh.
 * Menggunakan strategi 'jwt-refresh' (bukan strategi 'jwt' default).
 */
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
