import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class UpdateMenuDto {
  @ApiProperty({
    example: 'Nasi Goreng Spesial',
    description: 'Nama menu baru',
    required: false,
  })
  @IsString({ message: 'Nama harus berupa teks' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 8000,
    description: 'Harga baru dalam rupiah',
    required: false,
  })
  @IsInt({ message: 'Harga harus berupa bilangan bulat' })
  @IsPositive({ message: 'Harga harus lebih dari 0' })
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 2,
    description: 'ID kategori baru',
    required: false,
  })
  @IsInt({ message: 'ID kategori harus berupa bilangan bulat' })
  @Min(1, { message: 'ID kategori tidak valid' })
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    example: 'https://example.com/gambar-baru.jpg',
    description: 'URL gambar menu baru',
    required: false,
  })
  @IsString({ message: 'URL gambar harus berupa teks' })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: true,
    description: 'Status aktif/nonaktif menu',
    required: false,
  })
  @IsBoolean({ message: 'Status harus berupa boolean (true/false)' })
  @IsOptional()
  status?: boolean;
}
