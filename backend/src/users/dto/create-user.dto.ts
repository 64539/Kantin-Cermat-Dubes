import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  MinLength,
  IsNotEmpty,
  IsEmail,
  IsOptional,
} from 'class-validator';

// Gunakan enum lokal — menghindari Prisma module mismatch di runtime
enum UserRoleCreate {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
}

export class CreateUserDto {
  @ApiProperty({ example: 'Alex Andro', description: 'Nama lengkap pengguna' })
  @IsString({ message: 'Nama harus berupa teks' })
  @IsNotEmpty({ message: 'Nama wajib diisi' })
  name: string;

  @ApiProperty({
    example: 'alex@example.com',
    description: 'Email pengguna (harus unik)',
  })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password minimal 8 karakter',
  })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @IsNotEmpty({ message: 'Password wajib diisi' })
  password: string;

  @ApiProperty({
    enum: UserRoleCreate,
    default: UserRoleCreate.CASHIER,
    example: UserRoleCreate.CASHIER,
    description: 'Role pengguna: ADMIN atau CASHIER (default CASHIER)',
    required: false,
  })
  @IsEnum(UserRoleCreate, { message: 'Role harus ADMIN atau CASHIER' })
  @IsOptional()
  role?: string = UserRoleCreate.CASHIER;
}
