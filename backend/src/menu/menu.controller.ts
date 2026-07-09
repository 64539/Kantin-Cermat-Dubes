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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Menu')
@ApiBearerAuth('access-token')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Tambah menu baru (ADMIN only)' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Ambil semua menu (publik)' })
  findAll() {
    return this.menuService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Ambil menu berdasarkan id (publik)' })
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update menu (ADMIN only)' })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Hapus menu (ADMIN only)' })
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
