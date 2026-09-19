import { Injectable } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaMariaDb({
      host: process.env.DATABASE_HOST || 'db',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || 'kantin-cermat-dubes-12',
      database: process.env.DATABASE_NAME || 'kantin_db',
      port: Number(process.env.DATABASE_PORT) || 3306,
    });
    super({ adapter });
  }
}
