import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

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
      'access-token', // <-- nama identifier
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
