import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SlugUtil } from '../../common/utils/slug.util';
import { CreateBreakingNewsDto, UpdateBreakingNewsDto } from './dto';

@Injectable()
export class BreakingNewsService {
  constructor(private prisma: PrismaService) {}

  async getActive() {
    const now = new Date();
    
    const articles = await this.prisma.article.findMany({
      where: {
        isBreaking: true,
        status: 'PUBLISHED',
        deletedAt: null,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
      orderBy: [
        { priority: 'desc' },
        { publishedAt: 'desc' },
      ],
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
        priority: true,
        isBreaking: true,
      },
    });

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      url: `/article/${article.slug}`,
      priority: article.priority || 0,
      isActive: article.isBreaking,
      expiresAt: null, // يمكن إضافة expiresAt لاحقاً
    }));
  }

  async findAll() {
    const articles = await this.prisma.article.findMany({
      where: {
        isBreaking: true,
        deletedAt: null,
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      url: `/article/${article.slug}`,
      priority: article.priority || 0,
      isActive: article.isBreaking,
      expiresAt: article.expiresAt,
      createdAt: article.createdAt,
      author: article.author,
    }));
  }

  async create(dto: CreateBreakingNewsDto, userId: string) {
    // إنشاء مقال جديد كخبر عاجل
    const slug = SlugUtil.generateUnique(dto.title);
    const article = await this.prisma.article.create({
      data: {
        title: dto.title,
        slug,
        content: dto.title, // محتوى مؤقت
        status: 'PUBLISHED',
        isBreaking: true,
        priority: dto.priority || 0,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        authorId: userId,
        publishedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    return {
      id: article.id,
      title: article.title,
      url: dto.url || `/article/${article.slug}`,
      priority: article.priority || 0,
      isActive: article.isBreaking,
      expiresAt: article.expiresAt,
      createdAt: article.createdAt,
      author: article.author,
    };
  }

  async update(id: string, dto: UpdateBreakingNewsDto) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article || !article.isBreaking) {
      throw new NotFoundException('الخبر العاجل غير موجود');
    }

    const updateData: any = {};

    if (dto.title !== undefined) {
      updateData.title = dto.title;
      updateData.slug = SlugUtil.generateUnique(dto.title);
    }

    if (dto.priority !== undefined) {
      updateData.priority = dto.priority;
    }

    if (dto.isActive !== undefined) {
      updateData.isBreaking = dto.isActive;
    }

    if (dto.expiresAt !== undefined) {
      updateData.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    }

    const updated = await this.prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    return {
      id: updated.id,
      title: updated.title,
      url: dto.url || `/article/${updated.slug}`,
      priority: updated.priority || 0,
      isActive: updated.isBreaking,
      expiresAt: updated.expiresAt,
      createdAt: updated.createdAt,
      author: updated.author,
    };
  }

  async delete(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article || !article.isBreaking) {
      throw new NotFoundException('الخبر العاجل غير موجود');
    }

    await this.prisma.article.update({
      where: { id },
      data: {
        isBreaking: false,
      },
    });

    return { message: 'تم حذف الخبر العاجل بنجاح' };
  }

  async toggle(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('المقال غير موجود');
    }

    const updated = await this.prisma.article.update({
      where: { id },
      data: {
        isBreaking: !article.isBreaking,
      },
    });

    return {
      id: updated.id,
      isActive: updated.isBreaking,
    };
  }
}
