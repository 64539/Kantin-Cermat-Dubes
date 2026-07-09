import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateStockDto {
  @ApiProperty({
    example: 1,
    description: 'ID menu yang akan diatur stoknya',
  })
  @IsInt({ message: 'menu_id harus berupa bilangan bulat' })
  @Min(1, { message: 'menu_id tidak valid' })
  menu_id: number;

  @ApiProperty({
    example: 50,
    description: 'Jumlah stok yang akan di-set untuk menu ini',
  })
  @IsInt({ message: 'Stok harus berupa bilangan bulat' })
  @Min(0, { message: 'Stok tidak boleh negatif' })
  stock: number;
}
