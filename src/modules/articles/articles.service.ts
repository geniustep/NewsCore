import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SlugUtil } from '../../common/utils/slug.util';
import { CreateArticleDto, UpdateArticleDto, ArticleQueryDto, ArticleStatusEnum } from './dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateArticleDto, authorId: string) {
    // Generate unique slug
    const slug = SlugUtil.generateUnique(dto.title);

    // Calculate reading time and word count
    const wordCount = this.countWords(dto.content);
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

    const article = await this.prisma.article.create({
      data: {
        slug,
        title: dto.title,
        subtitle: dto.subtitle,
        excerpt: dto.excerpt || this.generateExcerpt(dto.content),
        content: dto.content,
        contentHtml: dto.contentHtml,
        status: dto.status || 'DRAFT',
        type: dto.type || 'STANDARD',
        language: dto.language || 'ar',
        coverImageUrl: dto.coverImageUrl,
        coverImageAlt: dto.coverImageAlt,
        videoUrl: dto.videoUrl,
        isPinned: dto.isPinned || false,
        isFeatured: dto.isFeatured || false,
        isBreaking: dto.isBreaking || false,
        allowComments: dto.allowComments ?? true,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        seoKeywords: dto.seoKeywords || [],
        wordCount,
        readingTime,
        authorId,
        publishedAt: dto.status === 'PUBLISHED' ? new Date() : dto.publishedAt ? new Date(dto.publishedAt) : null,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      },
    });

    // Add categories
    if (dto.categoryIds && dto.categoryIds.length > 0) {
      await this.prisma.articleCategory.createMany({
        data: dto.categoryIds.map((categoryId, index) => ({
          articleId: article.id,
          categoryId,
          isPrimary: dto.primaryCategoryId ? categoryId === dto.primaryCategoryId : index === 0,
        })),
      });
    }

    // Add tags
    if (dto.tagIds && dto.tagIds.length > 0) {
      await this.prisma.articleTag.createMany({
        data: dto.tagIds.map((tagId) => ({
          articleId: article.id,
          tagId,
        })),
      });

      // Update tag usage counts
      await this.prisma.tag.updateMany({
        where: { id: { in: dto.tagIds } },
        data: { usageCount: { increment: 1 } },
      });
    }

    // Create initial analytics record
    await this.prisma.articleAnalytics.create({
      data: { articleId: article.id },
    });

    return this.findOne(article.id);
  }

  async findAll(query: ArticleQueryDto) {
    const where: any = {
      deletedAt: null,
    };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { subtitle: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.language) {
      where.language = query.language;
    }

    if (query.authorId) {
      where.authorId = query.authorId;
    }

    if (query.categoryId) {
      where.categories = {
        some: { categoryId: query.categoryId },
      };
    }

    if (query.tagId) {
      where.tags = {
        some: { tagId: query.tagId },
      };
    }

    if (query.isPinned !== undefined) {
      where.isPinned = query.isPinned;
    }

    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured;
    }

    if (query.isBreaking !== undefined) {
      where.isBreaking = query.isBreaking;
    }

    const orderBy: any = {};
    if (query.sortBy === 'viewsTotal') {
      orderBy.analytics = { viewsTotal: query.sortOrder || 'desc' };
    } else {
      orderBy[query.sortBy || 'createdAt'] = query.sortOrder || 'desc';
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                  nameAr: true,
                  color: true,
                },
              },
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                  nameAr: true,
                },
              },
            },
          },
          analytics: {
            select: {
              viewsTotal: true,
              sharesTotal: true,
            },
          },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      data: articles.map((article) => this.formatArticle(article)),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / (query.limit || 10)),
      },
    };
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
          },
        },
        editor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        analytics: true,
        versions: {
          orderBy: { version: 'desc' },
          take: 5,
          include: {
            createdBy: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    if (!article || article.deletedAt) {
      throw new NotFoundException('المقال غير موجود');
    }

    return this.formatArticleDetails(article);
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        analytics: true,
      },
    });

    if (!article || article.deletedAt || article.status !== 'PUBLISHED') {
      throw new NotFoundException('المقال غير موجود');
    }

    // Increment view count
    await this.prisma.articleAnalytics.update({
      where: { articleId: article.id },
      data: {
        viewsTotal: { increment: 1 },
        viewsToday: { increment: 1 },
      },
    });

    return this.formatArticleDetails(article);
  }

  async update(id: string, dto: UpdateArticleDto, userId: string, userRoles: string[]) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article || article.deletedAt) {
      throw new NotFoundException('المقال غير موجود');
    }

    // Check permissions
    const isAdmin = userRoles.includes('admin') || userRoles.includes('super_admin');
    if (!isAdmin && article.authorId !== userId) {
      throw new ForbiddenException('ليس لديك صلاحية تعديل هذا المقال');
    }

    // Create version before update
    await this.prisma.articleVersion.create({
      data: {
        articleId: article.id,
        version: await this.getNextVersion(article.id),
        title: article.title,
        content: article.content,
        createdById: userId,
        reason: 'تحديث المقال',
      },
    });

    const updateData: any = {};

    if (dto.title !== undefined) {
      updateData.title = dto.title;
      // Generate new slug if title changed
      if (dto.title !== article.title) {
        updateData.slug = SlugUtil.generateUnique(dto.title);
      }
    }

    if (dto.subtitle !== undefined) updateData.subtitle = dto.subtitle;
    if (dto.excerpt !== undefined) updateData.excerpt = dto.excerpt;
    if (dto.content !== undefined) {
      updateData.content = dto.content;
      updateData.wordCount = this.countWords(dto.content);
      updateData.readingTime = Math.ceil(updateData.wordCount / 200);
    }
    if (dto.contentHtml !== undefined) updateData.contentHtml = dto.contentHtml;
    if (dto.status !== undefined) {
      updateData.status = dto.status;
      if (dto.status === 'PUBLISHED' && !article.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.language !== undefined) updateData.language = dto.language;
    if (dto.coverImageUrl !== undefined) updateData.coverImageUrl = dto.coverImageUrl;
    if (dto.coverImageAlt !== undefined) updateData.coverImageAlt = dto.coverImageAlt;
    if (dto.videoUrl !== undefined) updateData.videoUrl = dto.videoUrl;
    if (dto.isPinned !== undefined) updateData.isPinned = dto.isPinned;
    if (dto.isFeatured !== undefined) updateData.isFeatured = dto.isFeatured;
    if (dto.isBreaking !== undefined) updateData.isBreaking = dto.isBreaking;
    if (dto.allowComments !== undefined) updateData.allowComments = dto.allowComments;
    if (dto.seoTitle !== undefined) updateData.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined) updateData.seoDescription = dto.seoDescription;
    if (dto.seoKeywords !== undefined) updateData.seoKeywords = dto.seoKeywords;
    if (dto.scheduledAt !== undefined) updateData.scheduledAt = dto.scheduledAt ? new Date(dto.scheduledAt) : null;

    updateData.editorId = userId;

    await this.prisma.article.update({
      where: { id },
      data: updateData,
    });

    // Update categories if provided
    if (dto.categoryIds !== undefined) {
      await this.prisma.articleCategory.deleteMany({
        where: { articleId: id },
      });

      if (dto.categoryIds.length > 0) {
        await this.prisma.articleCategory.createMany({
          data: dto.categoryIds.map((categoryId, index) => ({
            articleId: id,
            categoryId,
            isPrimary: dto.primaryCategoryId ? categoryId === dto.primaryCategoryId : index === 0,
          })),
        });
      }
    }

    // Update tags if provided
    if (dto.tagIds !== undefined) {
      // Get old tags
      const oldTags = await this.prisma.articleTag.findMany({
        where: { articleId: id },
      });

      // Decrement old tag counts
      if (oldTags.length > 0) {
        await this.prisma.tag.updateMany({
          where: { id: { in: oldTags.map((t) => t.tagId) } },
          data: { usageCount: { decrement: 1 } },
        });
      }

      await this.prisma.articleTag.deleteMany({
        where: { articleId: id },
      });

      if (dto.tagIds.length > 0) {
        await this.prisma.articleTag.createMany({
          data: dto.tagIds.map((tagId) => ({
            articleId: id,
            tagId,
          })),
        });

        // Increment new tag counts
        await this.prisma.tag.updateMany({
          where: { id: { in: dto.tagIds } },
          data: { usageCount: { increment: 1 } },
        });
      }
    }

    return this.findOne(id);
  }

  async publish(id: string, userId: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article || article.deletedAt) {
      throw new NotFoundException('المقال غير موجود');
    }

    await this.prisma.article.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        editorId: userId,
      },
    });

    return this.findOne(id);
  }

  async archive(id: string, userId: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article || article.deletedAt) {
      throw new NotFoundException('المقال غير موجود');
    }

    await this.prisma.article.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
        editorId: userId,
      },
    });

    return this.findOne(id);
  }

  async remove(id: string, userId: string, userRoles: string[]) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article || article.deletedAt) {
      throw new NotFoundException('المقال غير موجود');
    }

    const isAdmin = userRoles.includes('admin') || userRoles.includes('super_admin');
    if (!isAdmin && article.authorId !== userId) {
      throw new ForbiddenException('ليس لديك صلاحية حذف هذا المقال');
    }

    // Soft delete
    await this.prisma.article.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'تم حذف المقال بنجاح' };
  }

  private async getNextVersion(articleId: string): Promise<number> {
    const lastVersion = await this.prisma.articleVersion.findFirst({
      where: { articleId },
      orderBy: { version: 'desc' },
    });
    return (lastVersion?.version || 0) + 1;
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  private generateExcerpt(content: string, maxLength: number = 200): string {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  }

  private formatArticle(article: any) {
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      subtitle: article.subtitle,
      excerpt: article.excerpt,
      coverImageUrl: article.coverImageUrl,
      status: article.status,
      type: article.type,
      language: article.language,
      isPinned: article.isPinned,
      isFeatured: article.isFeatured,
      isBreaking: article.isBreaking,
      readingTime: article.readingTime,
      author: article.author,
      categories: article.categories?.map((ac: any) => ({
        ...ac.category,
        isPrimary: ac.isPrimary,
      })),
      tags: article.tags?.map((at: any) => at.tag),
      views: article.analytics?.viewsTotal || 0,
      shares: article.analytics?.sharesTotal || 0,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
    };
  }

  private formatArticleDetails(article: any) {
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      subtitle: article.subtitle,
      excerpt: article.excerpt,
      content: article.content,
      contentHtml: article.contentHtml,
      coverImageUrl: article.coverImageUrl,
      coverImageAlt: article.coverImageAlt,
      videoUrl: article.videoUrl,
      galleryImages: article.galleryImages,
      status: article.status,
      type: article.type,
      language: article.language,
      isPinned: article.isPinned,
      isFeatured: article.isFeatured,
      isBreaking: article.isBreaking,
      allowComments: article.allowComments,
      readingTime: article.readingTime,
      wordCount: article.wordCount,
      seo: {
        title: article.seoTitle,
        description: article.seoDescription,
        keywords: article.seoKeywords,
        canonicalUrl: article.canonicalUrl,
      },
      author: article.author,
      editor: article.editor,
      categories: article.categories?.map((ac: any) => ({
        ...ac.category,
        isPrimary: ac.isPrimary,
      })),
      tags: article.tags?.map((at: any) => at.tag),
      analytics: article.analytics,
      versions: article.versions,
      publishedAt: article.publishedAt,
      scheduledAt: article.scheduledAt,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }
}

