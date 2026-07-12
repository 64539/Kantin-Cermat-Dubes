import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

// Hindari import Role dari Prisma untuk menghindari module mismatch
// Gunakan enum lokal dengan nilai yang sama
export enum UserRole {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  STUDENT = 'STUDENT',
}

/**
 * DTO untuk update user — standalone (tidak extend CreateUserDto)
 * agar tidak ada konflik tipe Role dari Prisma vs string.
 * Semua field opsional karena update bersifat parsial.
 */
export class UpdateUserDto {
  @ApiProperty({
    example: 'Alex Andro',
    description: 'Nama pengguna baru (opsional)',
    required: false,
  })
  @IsString({ message: 'Nama harus berupa teks' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'alex@example.com',
    description: 'Email baru (opsional)',
    required: false,
  })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'Password baru minimal 8 karakter (opsional)',
    required: false,
  })
  @IsString({ message: 'Password harus berupa teks' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @IsOptional()
  password?: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.STUDENT,
    description: 'Role pengguna: ADMIN, CASHIER, atau STUDENT (opsional)',
    required: false,
  })
  @IsEnum(UserRole, { message: 'Role harus ADMIN, CASHIER, atau STUDENT' })
  @IsOptional()
  role?: UserRole;
}
