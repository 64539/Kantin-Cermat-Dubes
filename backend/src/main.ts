import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─────────────────────────────────────────────────────────────────────────
  // CORS: Strict whitelist — hanya origins yang terdaftar di env yang diizinkan.
  // Sebelumnya app.enableCors() (tanpa argumen) membolehkan SEMUA origin (*),
  // yang merupakan celah keamanan serius pada lingkungan produksi.
  // ─────────────────────────────────────────────────────────────────────────
  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: (origin, callback) => {
      // Izinkan request tanpa origin (Postman, mobile app, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin "${origin}" tidak diizinkan oleh CORS policy`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Pastikan direktori uploads ada
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Sajikan direktori uploads secara statis
  app.use('/uploads', express.static(uploadsDir));

  // Aktifkan validasi global untuk semua DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // hapus field yang tidak ada di DTO
      forbidNonWhitelisted: false,
      transform: true, // otomatis konversi tipe (string → number, dll)
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Kantin Cermat API')
    .setDescription('API untuk sistem kantin Dubes Cermat')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Masukkan token JWT dari endpoint POST /auth/login',
      },
      'access-token',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
