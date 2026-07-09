import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Tidak ada role requirement → boleh akses
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: { id: number; email: string; role: string } }>();
    const user = request.user;

    // Bandingkan sebagai string (case-insensitive) agar tidak ada masalah enum reference
    const userRole = (user?.role ?? '').toUpperCase();
    const hasRole = requiredRoles.some(
      (required) => required.toString().toUpperCase() === userRole,
    );

    if (!user || !hasRole) {
      throw new ForbiddenException(
        `Akses ditolak. Role anda: "${user?.role ?? 'tidak diketahui'}", dibutuhkan: "${requiredRoles.join(' atau ')}"`,
      );
    }

    return true;
  }
}
