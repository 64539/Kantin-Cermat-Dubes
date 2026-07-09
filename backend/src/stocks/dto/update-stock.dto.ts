import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateStockDto {
  @ApiProperty({
    example: 30,
    description: 'Jumlah stok baru untuk menu ini',
    required: false,
  })
  @IsInt({ message: 'Stok harus berupa bilangan bulat' })
  @Min(0, { message: 'Stok tidak boleh negatif' })
  @IsOptional()
  stock?: number;
}
