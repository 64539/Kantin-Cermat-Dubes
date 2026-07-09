import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Tandai endpoint dengan @Public() agar tidak perlu JWT token */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
