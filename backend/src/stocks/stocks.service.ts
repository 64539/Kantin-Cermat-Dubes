import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StocksService {
  constructor(private readonly db: PrismaService) {}

  async create(dto: CreateStockDto) {
    // Pastikan menu ada
    const menu = await this.db.menu.findUnique({ where: { id: dto.menu_id } });
    if (!menu) {
      throw new NotFoundException(
        `Menu dengan id ${dto.menu_id} tidak ditemukan`,
      );
    }

    // Set stok menu
    const updated = await this.db.menu.update({
      where: { id: dto.menu_id },
      data: {
        stock: dto.stock,
        status: dto.stock > 0, // aktif jika stok > 0
      },
      include: { category: true },
    });

    return {
      message: `Stok menu "${updated.name}" berhasil diset ke ${dto.stock}`,
      data: {
        id: updated.id,
        name: updated.name,
        stock: updated.stock,
        status: updated.status,
        category: updated.category,
        updatedAt: updated.updatedAt,
      },
    };
  }

  async findAll() {
    return this.db.menu.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
        status: true,
        price: true,
        category: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const menu = await this.db.menu.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        stock: true,
        status: true,
        price: true,
        category: true,
        updatedAt: true,
      },
    });
    if (!menu) {
      throw new NotFoundException(`Menu dengan id ${id} tidak ditemukan`);
    }
    return menu;
  }

  async update(id: number, dto: UpdateStockDto) {
    await this.findOne(id);

    const newStock = dto.stock;
    const data: { stock?: number; status?: boolean } = {};

    if (newStock !== undefined) {
      data.stock = newStock;
      // Otomatis aktifkan/nonaktifkan menu berdasarkan stok
      data.status = newStock > 0;
    }

    const updated = await this.db.menu.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        stock: true,
        status: true,
        price: true,
        category: true,
        updatedAt: true,
      },
    });

    return {
      message: `Stok menu "${updated.name}" berhasil diupdate`,
      data: updated,
    };
  }

  async remove(id: number) {
    const menu = await this.findOne(id);
    // Reset stok ke 0 dan nonaktifkan
    await this.db.menu.update({
      where: { id },
      data: { stock: 0, status: false },
    });
    return { message: `Stok menu "${menu.name}" berhasil direset ke 0` };
  }
}
