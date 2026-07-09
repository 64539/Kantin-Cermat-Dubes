import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Stocks')
@ApiBearerAuth('access-token')
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Set stok awal untuk menu (ADMIN only)',
    description: 'Digunakan untuk pertama kali menetapkan stok menu yang baru ditambahkan',
  })
  create(@Body() createStockDto: CreateStockDto) {
    return this.stocksService.create(createStockDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lihat stok semua menu (publik)',
    description: 'Dapat diakses tanpa login untuk menampilkan info stok di halaman menu',
  })
  findAll() {
    return this.stocksService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Lihat stok menu tertentu (publik)',
  })
  findOne(@Param('id') id: string) {
    return this.stocksService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'CASHIER')
  @ApiOperation({
    summary: 'Update stok menu (ADMIN & CASHIER)',
    description: 'ADMIN dan CASHIER dapat memperbarui jumlah stok menu',
  })
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stocksService.update(+id, updateStockDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Reset stok menu ke 0 (ADMIN only)',
  })
  remove(@Param('id') id: string) {
    return this.stocksService.remove(+id);
  }
}
