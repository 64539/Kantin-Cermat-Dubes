import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto, RefreshTokenDto } from './dto/create-auth.dto';
import { Public } from './public.decorator';
import { JwtRefreshGuard } from './jwt-refresh.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login — mendapatkan access_token (15m) dan refresh_token (7d)' })
  login(@Body() dto: CreateAuthDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register user baru (default role: STUDENT)' })
  register(@Body() dto: CreateAuthDto) {
    return this.authService.register(dto);
  }

  /**
   * Endpoint refresh token — client mengirim refresh_token untuk
   * mendapatkan access_token baru tanpa harus login ulang.
   * Guard menggunakan strategi 'jwt-refresh' (secret berbeda).
   */
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Refresh access token menggunakan refresh token (7d)' })
  refreshToken(
    @Request() req: { user: { sub: number; email: string; role: string } },
  ) {
    return this.authService.refreshAccessToken(
      req.user.sub,
      req.user.email,
      req.user.role,
    );
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Lihat info user yang sedang login (verifikasi token & role)',
  })
  getMe(@Request() req: { user: { id: number; email: string; role: string } }) {
    return {
      message: 'Token valid',
      user: req.user,
    };
  }
}
