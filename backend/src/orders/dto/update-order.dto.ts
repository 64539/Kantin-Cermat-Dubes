import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
    description: 'Status baru untuk pesanan ini',
    required: false,
  })
  @IsEnum(OrderStatus, {
    message: `Status tidak valid. Pilih salah satu: ${Object.values(OrderStatus).join(', ')}`,
  })
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({
    example: 'Meja 3',
    description: 'Nama pelanggan atau nomor meja',
    required: false,
  })
  @IsString({ message: 'studentName harus berupa teks' })
  @IsOptional()
  studentName?: string;

  @ApiProperty({
    example: 'Tidak pakai pedas',
    description: 'Catatan tambahan pesanan',
    required: false,
  })
  @IsString({ message: 'notes harus berupa teks' })
  @IsOptional()
  notes?: string;
}
