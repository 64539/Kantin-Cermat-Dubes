import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly db: PrismaService) {}

  async create(dto: CreateOrderDto) {
    // Cek items tidak kosong
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order harus memiliki minimal 1 item');
    }

    let totalAmount = 0;

    // Validasi semua menu sekaligus lalu hitung total
    const items = await Promise.all(
      dto.items.map(async (item) => {
        const menu = await this.db.menu.findUnique({
          where: { id: item.menu_id },
        });

        // FK violation → 400 bukan 500
        if (!menu) {
          throw new BadRequestException(
            `Menu dengan id ${item.menu_id} tidak ditemukan`,
          );
        }
        if (!menu.status) {
          throw new BadRequestException(
            `Menu "${menu.name}" sedang tidak tersedia (habis/nonaktif)`,
          );
        }
        if (menu.stock < item.quantity) {
          throw new BadRequestException(
            `Stok menu "${menu.name}" tidak cukup. Tersisa: ${menu.stock}, diminta: ${item.quantity}`,
          );
        }

        totalAmount += menu.price * item.quantity;
        return {
          menuId: item.menu_id,
          quantity: item.quantity,
          price: menu.price,
        };
      }),
    );

    // Buat order
    const order = await this.db.order.create({
      data: {
        totalAmount,
        studentName: dto.studentName ?? null,
        items: { create: items },
      },
      include: {
        items: {
          include: { menu: { include: { category: true } } },
        },
      },
    });

    // Kurangi stok setiap menu setelah order berhasil dibuat
    await Promise.all(
      dto.items.map((item) =>
        this.db.menu.update({
          where: { id: item.menu_id },
          data: { stock: { decrement: item.quantity } },
        }),
      ),
    );

    // Nonaktifkan menu yang stoknya habis setelah pengurangan
    await Promise.all(
      dto.items.map(async (item) => {
        const updatedMenu = await this.db.menu.findUnique({
          where: { id: item.menu_id },
          select: { stock: true },
        });
        if (updatedMenu && updatedMenu.stock <= 0) {
          await this.db.menu.update({
            where: { id: item.menu_id },
            data: { status: false, stock: 0 },
          });
        }
      }),
    );

    return order;
  }

  async findAll() {
    return this.db.order.findMany({
      include: {
        items: {
          include: { menu: { include: { category: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const order = await this.db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { menu: { include: { category: true } } },
        },
      },
    });
    if (!order) {
      throw new NotFoundException(`Order dengan id ${id} tidak ditemukan`);
    }
    return order;
  }

  async update(id: number, dto: UpdateOrderDto) {
    const order = await this.findOne(id);

    // Jangan update order yang sudah COMPLETED atau CANCELLED
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      throw new BadRequestException(
        `Order dengan status "${order.status}" tidak bisa diubah lagi`,
      );
    }

    const data: { status?: string; studentName?: string } = {};
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.studentName !== undefined) data.studentName = dto.studentName;

    return this.db.order.update({
      where: { id },
      data: data as any,
      include: {
        items: {
          include: { menu: { include: { category: true } } },
        },
      },
    });
  }

  async remove(id: number) {
    const order = await this.findOne(id);

    // Hanya order PENDING yang boleh dihapus
    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        `Order dengan status "${order.status}" tidak bisa dihapus. Hanya order PENDING yang bisa dihapus.`,
      );
    }

    await this.db.order.delete({ where: { id } });
    return { message: `Order #${id} berhasil dihapus` };
  }
}
