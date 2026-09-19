import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateStockDto {
  @ApiProperty({
    example: 1,
    description: 'ID menu yang akan diatur stoknya',
  })
  @IsInt({ message: 'menuId harus berupa bilangan bulat' })
  @Min(1, { message: 'menuId tidak valid' })
  menuId: number;

  @ApiProperty({
    example: 50,
    description: 'Jumlah stok yang akan di-set untuk menu ini',
  })
  @IsInt({ message: 'Stok harus berupa bilangan bulat' })
  @Min(0, { message: 'Stok tidak boleh negatif' })
  stock: number;
}
