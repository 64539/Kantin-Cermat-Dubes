import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// ─────────────────────────────────────────────────────────────────────────────
// MAGIC BYTES — tanda tangan biner nyata di awal file.
// Validasi mimetype dari Content-Type header mudah dipalsukan (spoofed).
// Dengan membaca byte pertama dari buffer, kita memvalidasi isi file yang sesungguhnya.
// ─────────────────────────────────────────────────────────────────────────────
const ALLOWED_MIME_SIGNATURES: Record<string, number[][]> = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header (WebP)
};

function validateMagicBytes(buffer: Buffer): boolean {
  for (const signatures of Object.values(ALLOWED_MIME_SIGNATURES)) {
    for (const sig of signatures) {
      if (sig.every((byte, i) => buffer[i] === byte)) {
        return true;
      }
    }
  }
  return false;
}

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  // Endpoint upload dilindungi JWT — hanya user yang login (ADMIN/CASHIER) yang bisa upload gambar menu
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      // Layer 1: Validasi MIME type dari header (cepat, pemeriksaan awal)
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException('Hanya file gambar (JPEG, PNG, GIF, WebP) yang diperbolehkan!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file gambar (Max 2MB) — Requires Auth' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File tidak boleh kosong!');
    }

    // Layer 2: Validasi magic bytes — verifikasi isi file yang sesungguhnya
    // Multer menyimpan ke disk, jadi kita baca kembali buffer dari disk path
    const fs = require('fs') as typeof import('fs');
    const fileBuffer = fs.readFileSync(file.path);
    if (!validateMagicBytes(fileBuffer)) {
      // Hapus file yang tidak valid dari disk
      fs.unlinkSync(file.path);
      throw new BadRequestException(
        'Konten file tidak valid. File harus berupa gambar asli (JPEG, PNG, GIF, atau WebP).',
      );
    }

    const host = process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;
    return {
      imageUrl: `${host}/uploads/${file.filename}`,
    };
  }
}
