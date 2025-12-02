import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SlugUtil } from '../../common/utils/slug.util';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTagDto) {
    const slug = SlugUtil.generate(dto.name);

    const existingTag = await this.prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      throw new ConflictException('وسم بهذا الاسم موجود بالفعل');
    }

    const tag = await this.prisma.tag.create({
      data: {
        slug,
        name: dto.name,
        nameAr: dto.nameAr || dto.name,
        nameEn: dto.nameEn,
        nameFr: dto.nameFr,
        type: dto.type || 'GENERAL',
      },
    });

    return this.formatTag(tag);
  }

  async findAll(search?: string, type?: string) {
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    const tags = await this.prisma.tag.findMany({
      where,
      orderBy: [{ usageCount: 'desc' }, { name: 'asc' }],
      take: 100,
    });

    return tags.map((tag) => this.formatTag(tag));
  }

  async findPopular(limit: number = 20) {
    const tags = await this.prisma.tag.findMany({
      where: { usageCount: { gt: 0 } },
      orderBy: { usageCount: 'desc' },
      take: limit,
    });

    return tags.map((tag) => this.formatTag(tag));
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('الوسم غير موجود');
    }

    return this.formatTag(tag);
  }

  async findBySlug(slug: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      throw new NotFoundException('الوسم غير موجود');
    }

    return this.formatTag(tag);
  }

  async update(id: string, dto: UpdateTagDto) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('الوسم غير موجود');
    }

    const updateData: any = { ...dto };

    if (dto.name && dto.name !== tag.name) {
      const newSlug = SlugUtil.generate(dto.name);
      const existingTag = await this.prisma.tag.findUnique({
        where: { slug: newSlug },
      });
      if (existingTag && existingTag.id !== id) {
        throw new ConflictException('وسم بهذا الاسم موجود بالفعل');
      }
      updateData.slug = newSlug;
    }

    const updated = await this.prisma.tag.update({
      where: { id },
      data: updateData,
    });

    return this.formatTag(updated);
  }

  async remove(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('الوسم غير موجود');
    }

    // Delete tag associations first
    await this.prisma.articleTag.deleteMany({
      where: { tagId: id },
    });

    await this.prisma.tag.delete({
      where: { id },
    });

    return { message: 'تم حذف الوسم بنجاح' };
  }

  private formatTag(tag: any) {
    return {
      id: tag.id,
      slug: tag.slug,
      name: tag.name,
      nameAr: tag.nameAr,
      nameEn: tag.nameEn,
      nameFr: tag.nameFr,
      type: tag.type,
      usageCount: tag.usageCount,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }
}

