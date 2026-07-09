import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/** Batasi akses endpoint berdasarkan role. Contoh: @Roles('ADMIN') */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
