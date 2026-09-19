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
    // Validasi studentId jika disertakan
    if (dto.studentId) {
      const studentUser = await this.db.user.findUnique({
        where: { id: dto.studentId },
      });
      if (!studentUser) {
        throw new BadRequestException(
          `Siswa dengan ID ${dto.studentId} tidak ditemukan`,
        );
      }
    }

    // Cek items tidak kosong
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order harus memiliki minimal 1 item');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ATOMIC TRANSACTION: Seluruh proses validasi stok, pembuatan order,
    // pengurangan stok, dan update status dijalankan dalam satu transaksi DB.
    // Jika SATU query gagal, SEMUA perubahan otomatis di-rollback.
    // Ini mencegah race condition pada pemesanan bersamaan (concurrent orders).
    // ─────────────────────────────────────────────────────────────────────────
    const order = await this.db.$transaction(async (tx) => {
      let totalAmount = 0;

      // Validasi & lock semua menu secara sequential untuk menghindari
      // phantom read di dalam transaksi yang sama
      const validatedItems: {
        menuId: number;
        quantity: number;
        priceAtPurchase: number;
      }[] = [];

      for (const item of dto.items) {
        const menu = await tx.menu.findUnique({
          where: { id: item.menuId },
        });

        // FK violation → 400 bukan 500
        if (!menu) {
          throw new BadRequestException(
            `Menu dengan id ${item.menuId} tidak ditemukan`,
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
        validatedItems.push({
          menuId: item.menuId,
          quantity: item.quantity,
          priceAtPurchase: menu.price,
        });
      }

      // Generate unique order number (e.g. INV-20260710-1234)
      const now = new Date();
      const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `INV-${datePart}-${randomPart}`;

      // Buat order beserta semua items dalam satu operasi
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          totalAmount,
          studentName: dto.studentName ?? null,
          studentId: dto.studentId ?? null,
          items: { create: validatedItems },
        },
        include: {
          items: {
            include: { menu: { include: { category: true } } },
          },
        },
      });

      // Kurangi stok setiap menu SECARA SEQUENTIAL di dalam transaksi
      // Sequential (bukan Promise.all) untuk menjaga isolasi transaksi
      for (const item of dto.items) {
        await tx.menu.update({
          where: { id: item.menuId },
          data: { stock: { decrement: item.quantity } },
        });

        // Nonaktifkan menu yang stoknya habis setelah pengurangan
        const updatedMenu = await tx.menu.findUnique({
          where: { id: item.menuId },
          select: { stock: true },
        });
        if (updatedMenu && updatedMenu.stock <= 0) {
          await tx.menu.update({
            where: { id: item.menuId },
            data: { status: false, stock: 0 },
          });
        }
      }

      return createdOrder;
    });

    return order;
  }

  async findAll(user?: { id: number; role: string }) {
    const whereClause: any = {};
    if (user && user.role === 'STUDENT') {
      whereClause.studentId = user.id;
    }

    return this.db.order.findMany({
      where: whereClause,
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
