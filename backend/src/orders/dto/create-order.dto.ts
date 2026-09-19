import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1, description: 'ID menu yang dipesan' })
  @IsInt({ message: 'menuId harus berupa bilangan bulat' })
  @Min(1, { message: 'menuId tidak valid' })
  menuId: number;

  @ApiProperty({ example: 2, description: 'Jumlah item yang dipesan' })
  @IsInt({ message: 'quantity harus berupa bilangan bulat' })
  @Min(1, { message: 'quantity minimal 1' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'Daftar item yang dipesan',
    example: [{ menuId: 1, quantity: 2 }],
  })
  @IsArray({ message: 'items harus berupa array' })
  @IsNotEmpty({ message: 'items tidak boleh kosong' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({
    example: 'Meja 5',
    description: 'Nama pelanggan atau catatan meja (opsional)',
    required: false,
  })
  @IsString({ message: 'studentName harus berupa teks' })
  @IsOptional()
  studentName?: string;

  @ApiProperty({
    example: 3,
    description: 'ID user siswa (opsional jika pembeli non-siswa)',
    required: false,
  })
  @IsInt({ message: 'studentId harus berupa bilangan bulat' })
  @IsOptional()
  studentId?: number;

  @ApiProperty({
    example: 'Tidak pakai pedas',
    description: 'Catatan tambahan untuk pesanan (opsional)',
    required: false,
  })
  @IsString({ message: 'notes harus berupa teks' })
  @IsOptional()
  notes?: string;
}
