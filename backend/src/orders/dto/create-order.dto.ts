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
  @IsInt({ message: 'menu_id harus berupa bilangan bulat' })
  @Min(1, { message: 'menu_id tidak valid' })
  menu_id: number;

  @ApiProperty({ example: 2, description: 'Jumlah item yang dipesan' })
  @IsInt({ message: 'quantity harus berupa bilangan bulat' })
  @Min(1, { message: 'quantity minimal 1' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'Daftar item yang dipesan',
    example: [{ menu_id: 1, quantity: 2 }],
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
    example: 'Tidak pakai pedas',
    description: 'Catatan tambahan untuk pesanan (opsional)',
    required: false,
  })
  @IsString({ message: 'notes harus berupa teks' })
  @IsOptional()
  notes?: string;
}
