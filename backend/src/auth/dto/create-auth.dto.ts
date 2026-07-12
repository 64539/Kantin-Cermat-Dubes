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

  @ApiProperty({ example: 'android', required: false })
  @IsString({ message: 'Client harus berupa string' })
  @IsOptional()
  client?: string;
}
