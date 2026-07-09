import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'Nasi Goreng', description: 'Nama menu' })
  @IsString({ message: 'Nama harus berupa teks' })
  @IsNotEmpty({ message: 'Nama menu wajib diisi' })
  name: string;

  @ApiProperty({
    example: 5000,
    description: 'Harga menu dalam rupiah (bilangan bulat)',
  })
  @IsInt({ message: 'Harga harus berupa bilangan bulat' })
  @IsPositive({ message: 'Harga harus lebih dari 0' })
  price: number;

  @ApiProperty({
    example: 1,
    description: 'ID kategori yang sudah ada di database',
  })
  @IsInt({ message: 'ID kategori harus berupa bilangan bulat' })
  @Min(1, { message: 'ID kategori tidak valid' })
  category_id: number;

  @ApiProperty({
    example: 'https://example.com/gambar.jpg',
    description: 'URL gambar menu (opsional)',
    required: false,
  })
  @IsString({ message: 'URL gambar harus berupa teks' })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: 10,
    description: 'Stok awal menu (default 0)',
    required: false,
    default: 0,
  })
  @IsInt({ message: 'Stok harus berupa bilangan bulat' })
  @Min(0, { message: 'Stok tidak boleh negatif' })
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: true,
    description: 'Status aktif menu (default true)',
    required: false,
    default: true,
  })
  @IsBoolean({ message: 'Status harus berupa boolean' })
  @IsOptional()
  status?: boolean;
}
