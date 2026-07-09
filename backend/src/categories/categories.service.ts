import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly db: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    // Cek nama kategori sudah ada (unique constraint) → 409 bukan 500
    const existing = await this.db.category.findFirst({
      where: { name: { equals: dto.name } },
    });
    if (existing) {
      throw new ConflictException(
        `Kategori dengan nama "${dto.name}" sudah ada`,
      );
    }

    return this.db.category.create({
      data: { name: dto.name },
    });
  }

  async findAll() {
    return this.db.category.findMany({
      include: { menus: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const category = await this.db.category.findUnique({
      where: { id },
      include: { menus: true },
    });
    if (!category) {
      throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);
    }
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    // Cek nama baru tidak bertabrakan dengan kategori lain
    if (dto.name && dto.name !== category.name) {
      const existing = await this.db.category.findFirst({
        where: { name: { equals: dto.name } },
      });
      if (existing) {
        throw new ConflictException(
          `Kategori dengan nama "${dto.name}" sudah ada`,
        );
      }
    }

    return this.db.category.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    // Cek apakah kategori masih punya menu → jika dihapus, menu jadi orphan (FK violation)
    if (category.menus.length > 0) {
      throw new BadRequestException(
        `Kategori "${category.name}" tidak bisa dihapus karena masih memiliki ${category.menus.length} menu. Hapus atau pindahkan menu terlebih dahulu.`,
      );
    }

    await this.db.category.delete({ where: { id } });
    return { message: `Kategori "${category.name}" berhasil dihapus` };
  }
}
