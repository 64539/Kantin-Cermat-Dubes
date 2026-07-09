import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly db: PrismaService) {}

  /** Cek kategori ada — lempar 400 yang jelas daripada 500 FK violation */
  private async ensureCategoryExists(categoryId: number) {
    const category = await this.db.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new BadRequestException(
        `Kategori dengan id ${categoryId} tidak ditemukan. Buat kategori terlebih dahulu sebelum menambah menu.`,
      );
    }
    return category;
  }

  async create(dto: CreateMenuDto) {
    // Validasi foreign key sebelum insert agar error 400 bukan 500
    await this.ensureCategoryExists(dto.category_id);

    return this.db.menu.create({
      data: {
        name: dto.name,
        price: dto.price,
        categoryId: dto.category_id,
        imageUrl: dto.imageUrl ?? null,
        stock: dto.stock ?? 0,
        status: dto.status ?? true,
      },
      include: { category: true },
    });
  }

  async findAll() {
    return this.db.menu.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const menu = await this.db.menu.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!menu) {
      throw new NotFoundException(`Menu dengan id ${id} tidak ditemukan`);
    }
    return menu;
  }

  async update(id: number, dto: UpdateMenuDto) {
    await this.findOne(id);

    // Jika category_id dikirim, pastikan kategori baru itu ada
    if (dto.category_id !== undefined) {
      await this.ensureCategoryExists(dto.category_id);
    }

    const data: Partial<{
      name: string;
      price: number;
      categoryId: number;
      imageUrl: string | null;
      status: boolean;
    }> = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.category_id !== undefined) data.categoryId = dto.category_id;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.status !== undefined) data.status = dto.status;

    return this.db.menu.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async remove(id: number) {
    const menu = await this.findOne(id);

    // Cek apakah menu masih punya order item aktif
    const activeOrders = await this.db.orderItem.count({
      where: { menuId: id },
    });
    if (activeOrders > 0) {
      throw new BadRequestException(
        `Menu "${menu.name}" tidak bisa dihapus karena masih ada ${activeOrders} order yang terkait.`,
      );
    }

    await this.db.menu.delete({ where: { id } });
    return { message: `Menu "${menu.name}" berhasil dihapus` };
  }
}
