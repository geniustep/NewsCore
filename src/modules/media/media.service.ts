import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { CreateMediaDto, UpdateMediaDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class MediaService {
  private uploadDir: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
  }

  async upload(
    file: Express.Multer.File,
    dto: CreateMediaDto,
    userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('الملف مطلوب');
    }

    const mediaType = this.getMediaType(file.mimetype);
    const filename = this.generateFilename(file.originalname);
    const relativePath = `${mediaType.toLowerCase()}s/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const fullPath = path.join(this.uploadDir, relativePath);

    // Ensure directory exists
    await fs.mkdir(fullPath, { recursive: true });

    // Save file
    const filePath = path.join(fullPath, filename);
    await fs.writeFile(filePath, file.buffer);

    // Generate thumbnail for images
    let thumbnailUrl = null;
    if (mediaType === 'IMAGE') {
      // In production, use sharp or similar library for thumbnail generation
      thumbnailUrl = `/uploads/${relativePath}/${filename}`;
    }

    const url = `/uploads/${relativePath}/${filename}`;

    // Get image dimensions if it's an image
    let width = null;
    let height = null;
    // In production, use sharp to get dimensions

    const media = await this.prisma.mediaAsset.create({
      data: {
        type: mediaType,
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url,
        thumbnailUrl,
        alt: dto.alt,
        caption: dto.caption,
        credit: dto.credit,
        width,
        height,
        folderId: dto.folderId,
        uploadedById: userId,
      },
    });

    return this.formatMedia(media);
  }

  async findAll(query: {
    type?: string;
    folderId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.folderId) {
      where.folderId = query.folderId;
    } else if (query.folderId === null) {
      where.folderId = null;
    }

    if (query.search) {
      where.OR = [
        { originalName: { contains: query.search, mode: 'insensitive' } },
        { alt: { contains: query.search, mode: 'insensitive' } },
        { caption: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [media, total] = await Promise.all([
      this.prisma.mediaAsset.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          folder: true,
        },
      }),
      this.prisma.mediaAsset.count({ where }),
    ]);

    return {
      data: media.map((m) => this.formatMedia(m)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const media = await this.prisma.mediaAsset.findUnique({
      where: { id },
      include: {
        folder: true,
      },
    });

    if (!media) {
      throw new NotFoundException('الملف غير موجود');
    }

    return this.formatMedia(media);
  }

  async update(id: string, dto: UpdateMediaDto) {
    const media = await this.prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException('الملف غير موجود');
    }

    const updated = await this.prisma.mediaAsset.update({
      where: { id },
      data: dto,
      include: {
        folder: true,
      },
    });

    return this.formatMedia(updated);
  }

  async remove(id: string) {
    const media = await this.prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException('الملف غير موجود');
    }

    // Delete file from disk
    try {
      const filePath = path.join(this.uploadDir, media.url.replace('/uploads/', ''));
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, continue with database deletion
    }

    await this.prisma.mediaAsset.delete({
      where: { id },
    });

    return { message: 'تم حذف الملف بنجاح' };
  }

  // Folder operations
  async createFolder(name: string, parentId?: string) {
    const folder = await this.prisma.mediaFolder.create({
      data: {
        name,
        parentId,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return folder;
  }

  async getFolders(parentId?: string) {
    const where: any = {};
    if (parentId) {
      where.parentId = parentId;
    } else {
      where.parentId = null;
    }

    const folders = await this.prisma.mediaFolder.findMany({
      where,
      include: {
        children: true,
        _count: {
          select: { assets: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      parentId: folder.parentId,
      childrenCount: folder.children.length,
      assetsCount: folder._count.assets,
      createdAt: folder.createdAt,
    }));
  }

  async deleteFolder(id: string) {
    const folder = await this.prisma.mediaFolder.findUnique({
      where: { id },
      include: {
        children: true,
        _count: {
          select: { assets: true },
        },
      },
    });

    if (!folder) {
      throw new NotFoundException('المجلد غير موجود');
    }

    if (folder.children.length > 0) {
      throw new BadRequestException('لا يمكن حذف مجلد يحتوي على مجلدات فرعية');
    }

    if (folder._count.assets > 0) {
      throw new BadRequestException('لا يمكن حذف مجلد يحتوي على ملفات');
    }

    await this.prisma.mediaFolder.delete({
      where: { id },
    });

    return { message: 'تم حذف المجلد بنجاح' };
  }

  private getMediaType(mimeType: string): 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'OTHER' {
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    if (mimeType.startsWith('audio/')) return 'AUDIO';
    if (
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType.includes('spreadsheet') ||
      mimeType.includes('presentation')
    ) {
      return 'DOCUMENT';
    }
    return 'OTHER';
  }

  private generateFilename(originalName: string): string {
    const ext = path.extname(originalName);
    return `${uuidv4()}${ext}`;
  }

  private formatMedia(media: any) {
    return {
      id: media.id,
      type: media.type,
      filename: media.filename,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
      url: media.url,
      thumbnailUrl: media.thumbnailUrl,
      alt: media.alt,
      caption: media.caption,
      credit: media.credit,
      width: media.width,
      height: media.height,
      duration: media.duration,
      folder: media.folder
        ? {
            id: media.folder.id,
            name: media.folder.name,
          }
        : null,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    };
  }
}

