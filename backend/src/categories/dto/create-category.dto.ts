import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Makanan Berat' })
  @IsString({ message: 'Nama kategori harus berupa string' })
  @IsNotEmpty({ message: 'Nama kategori wajib diisi' })
  name: string;
}
