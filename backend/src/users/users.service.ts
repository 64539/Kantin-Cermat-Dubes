import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.db.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.db.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: (dto.role ?? 'CASHIER') as any, // cast ke any agar cocok dengan Prisma enum
      },
    });

    // Jangan kembalikan password
    const { password: _, ...result } = user;
    return result;
  }

  async findAll() {
    return this.db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.db.user.findUnique({ where: { email } });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id); // pastikan user ada

    // Cek email baru tidak bentrok dengan user lain
    if (dto.email) {
      const emailConflict = await this.db.user.findFirst({
        where: { email: dto.email, NOT: { id } },
      });
      if (emailConflict) {
        throw new ConflictException('Email sudah digunakan oleh user lain');
      }
    }

    // Bangun object data secara eksplisit dengan cast ke any untuk menghindari
    // konflik tipe antara UserRole (lokal) dan Role (Prisma generated)
    const data: Record<string, unknown> = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.role !== undefined) data.role = dto.role; // string 'ADMIN'|'CASHIER' valid di DB
    if (dto.password !== undefined) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('Tidak ada field yang diupdate');
    }

    return this.db.user.update({
      where: { id },
      data: data as any, // cast ke any — nilai sudah divalidasi oleh DTO @IsEnum
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // pastikan user ada
    await this.db.user.delete({ where: { id } });
    return { message: `User dengan id ${id} berhasil dihapus` };
  }
}
