import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail({}, { message: 'Email tidak valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString({ message: 'Password harus berupa string' })
  @IsNotEmpty({ message: 'Password wajib diisi' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;

  @ApiProperty({ example: 'John Doe', required: false, description: 'Nama lengkap (hanya untuk register)' })
  @IsString({ message: 'Nama harus berupa string' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'android', required: false, description: 'Identifier client (android/web)' })
  @IsString({ message: 'Client harus berupa string' })
  @IsOptional()
  client?: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGci...', description: 'Refresh token yang diterima saat login' })
  @IsString({ message: 'Refresh token harus berupa string' })
  @IsNotEmpty({ message: 'Refresh token wajib diisi' })
  refreshToken: string;
}
