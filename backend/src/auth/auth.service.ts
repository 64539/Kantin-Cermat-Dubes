import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────
  // Token generation helpers
  // ─────────────────────────────────────────────────────────────────────────

  private generateAccessToken(payload: { sub: number; email: string; role: string }) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(payload: { sub: number; email: string; role: string }) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }

  // ─────────────────────────────────────────────────────────────────────────

  async login(dto: CreateAuthDto) {
    const user = await this.db.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Hanya izinkan role ADMIN dan CASHIER masuk ke portal web admin
    if (user.role === 'STUDENT' && dto.client !== 'android') {
      throw new UnauthorizedException('Akun Siswa tidak diperbolehkan mengakses portal admin web');
    }

    // Hanya izinkan STUDENT masuk ke aplikasi Android
    if (user.role !== 'STUDENT' && dto.client === 'android') {
      throw new UnauthorizedException('Akun Admin/Kasir tidak bisa digunakan di aplikasi siswa');
    }

    // Perbarui waktu login terakhir
    await this.db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.generateAccessToken(payload);
    const refresh_token = this.generateRefreshToken(payload);

    return {
      access_token,
      refresh_token,
      expires_in: 900, // 15 minutes in seconds
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(dto: CreateAuthDto) {
    const existing = await this.db.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.db.user.create({
      data: {
        name: dto.name ?? dto.email,
        email: dto.email,
        password: hashedPassword,
      },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.generateAccessToken(payload);
    const refresh_token = this.generateRefreshToken(payload);

    return {
      access_token,
      refresh_token,
      expires_in: 900,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Digunakan oleh endpoint POST /auth/refresh.
   * Menerima refresh token yang masih valid, lalu menerbitkan
   * access token baru tanpa memaksa user login ulang.
   */
  async refreshAccessToken(userId: number, email: string, role: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Akun tidak ditemukan atau sudah dinonaktifkan');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.generateAccessToken(payload);

    return {
      access_token,
      expires_in: 900,
    };
  }

  async validateUser(userId: number) {
    return this.db.user.findUnique({ where: { id: userId } });
  }
}
