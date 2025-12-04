import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SlugUtil } from '../../common/utils/slug.util';
import {
  CreatePageDto,
  UpdatePageDto,
  PageQueryDto,
  CreatePageTranslationDto,
  UpdatePageTranslationDto,
} from './dto';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePageDto, authorId: string) {
    // Generate unique slug
    const slug = SlugUtil.generateUnique(dto.title);

    // If setting as homepage, unset any existing homepage
    if (dto.isHomepage) {
      await this.prisma.page.updateMany({
        where: { isHomepage: true, language: dto.language || 'ar' },
        data: { isHomepage: false },
      });
    }

    const page = await this.prisma.page.create({
      data: {
        slug,
        title: dto.title,
        content: dto.content,
        contentHtml: dto.contentHtml,
        excerpt: dto.excerpt || this.generateExcerpt(dto.content),
        status: dto.status || 'DRAFT',
        language: dto.language || 'ar',
        featuredImageUrl: dto.featuredImageUrl,
        featuredImageAlt: dto.featuredImageAlt,
        parentId: dto.parentId,
        template: dto.template || 'default',
        isHomepage: dto.isHomepage || false,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        seoKeywords: dto.seoKeywords || [],
        allowComments: dto.allowComments || false,
        showInMenu: dto.showInMenu || false,
        authorId,
        publishedAt: dto.status === 'PUBLISHED' ? new Date() : null,
      },
    });

    return this.findOne(page.id);
  }

  async findAll(query: PageQueryDto) {
    const where: any = {
      deletedAt: null,
    };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.language) {
      where.language = query.language;
    }

    if (query.template) {
      where.template = query.template;
    }

    if (query.isHomepage !== undefined) {
      where.isHomepage = query.isHomepage;
    }

    if (query.parentId) {
      where.parentId = query.parentId;
    }

    const orderBy: any = {};
    orderBy[query.sortBy || 'createdAt'] = query.sortOrder || 'desc';

    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,
        include: {
          parent: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          children: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          translations: {
            select: {
              id: true,
              language: true,
              title: true,
              isReviewed: true,
            },
          },
        },
      }),
      this.prisma.page.count({ where }),
    ]);

    return {
      data: pages.map((page) => this.formatPage(page)),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / (query.limit || 20)),
      },
    };
  }

  async findOne(id: string) {
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        children: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            sortOrder: true,
          },
        },
        translations: true,
        versions: {
          orderBy: { version: 'desc' },
          take: 10,
        },
      },
    });

    if (!page || page.deletedAt) {
      throw new NotFoundException('الصفحة غير موجودة');
    }

    return this.formatPageDetails(page);
  }

  async findBySlug(slug: string, language?: string) {
    const page = await this.prisma.page.findUnique({
      where: { slug },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        children: {
          where: { status: 'PUBLISHED', deletedAt: null },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        translations: true,
      },
    });

    if (!page || page.deletedAt || page.status !== 'PUBLISHED') {
      throw new NotFoundException('الصفحة غير موجودة');
    }

    // If a specific language is requested and translation exists
    if (language && language !== page.language) {
      const translation = page.translations.find((t) => t.language === language);
      if (translation) {
        return {
          ...this.formatPageDetails(page),
          title: translation.title,
          content: translation.content,
          excerpt: translation.excerpt,
          seo: {
            title: translation.seoTitle || page.seoTitle,
            description: translation.seoDescription || page.seoDescription,
            keywords: page.seoKeywords,
            canonicalUrl: page.canonicalUrl,
          },
          currentLanguage: language,
        };
      }
    }

    return this.formatPageDetails(page);
  }

  async findHomepage(language?: string) {
    const page = await this.prisma.page.findFirst({
      where: {
        isHomepage: true,
        status: 'PUBLISHED',
        deletedAt: null,
        language: language || 'ar',
      },
      include: {
        translations: true,
      },
    });

    if (!page) {
      throw new NotFoundException('الصفحة الرئيسية غير موجودة');
    }

    return this.formatPageDetails(page);
  }

  async getTree(language?: string) {
    const pages = await this.prisma.page.findMany({
      where: {
        deletedAt: null,
        parentId: null,
        language: language || 'ar',
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              where: { deletedAt: null },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    return pages.map((page) => this.formatPageTree(page));
  }

  async update(id: string, dto: UpdatePageDto, userId: string, userRoles: string[]) {
    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    if (!page || page.deletedAt) {
      throw new NotFoundException('الصفحة غير موجودة');
    }

    // Check if trying to set as homepage
    if (dto.isHomepage && !page.isHomepage) {
      await this.prisma.page.updateMany({
        where: { isHomepage: true, language: page.language },
        data: { isHomepage: false },
      });
    }

    // Create version before update
    await this.prisma.pageVersion.create({
      data: {
        pageId: page.id,
        version: await this.getNextVersion(page.id),
        title: page.title,
        content: page.content,
        createdById: userId,
        reason: 'تحديث الصفحة',
      },
    });

    const updateData: any = {};

    if (dto.title !== undefined) {
      updateData.title = dto.title;
      // Generate new slug if title changed
      if (dto.title !== page.title) {
        updateData.slug = SlugUtil.generateUnique(dto.title);
      }
    }

    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.contentHtml !== undefined) updateData.contentHtml = dto.contentHtml;
    if (dto.excerpt !== undefined) updateData.excerpt = dto.excerpt;
    if (dto.status !== undefined) {
      updateData.status = dto.status;
      if (dto.status === 'PUBLISHED' && !page.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (dto.language !== undefined) updateData.language = dto.language;
    if (dto.featuredImageUrl !== undefined) updateData.featuredImageUrl = dto.featuredImageUrl;
    if (dto.featuredImageAlt !== undefined) updateData.featuredImageAlt = dto.featuredImageAlt;
    if (dto.parentId !== undefined) updateData.parentId = dto.parentId;
    if (dto.template !== undefined) updateData.template = dto.template;
    if (dto.isHomepage !== undefined) updateData.isHomepage = dto.isHomepage;
    if (dto.seoTitle !== undefined) updateData.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined) updateData.seoDescription = dto.seoDescription;
    if (dto.seoKeywords !== undefined) updateData.seoKeywords = dto.seoKeywords;
    if (dto.allowComments !== undefined) updateData.allowComments = dto.allowComments;
    if (dto.showInMenu !== undefined) updateData.showInMenu = dto.showInMenu;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

    updateData.editorId = userId;

    await this.prisma.page.update({
      where: { id },
      data: updateData,
    });

    return this.findOne(id);
  }

  async publish(id: string, userId: string) {
    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    if (!page || page.deletedAt) {
      throw new NotFoundException('الصفحة غير موجودة');
    }

    await this.prisma.page.update({
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
    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    if (!page || page.deletedAt) {
      throw new NotFoundException('الصفحة غير موجودة');
    }

    if (page.isSystem) {
      throw new BadRequestException('لا يمكن أرشفة صفحة نظام');
    }

    await this.prisma.page.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
        editorId: userId,
      },
    });

    return this.findOne(id);
  }

  async remove(id: string, userId: string, userRoles: string[]) {
    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    if (!page || page.deletedAt) {
      throw new NotFoundException('الصفحة غير موجودة');
    }

    if (page.isSystem) {
      throw new BadRequestException('لا يمكن حذف صفحة نظام');
    }

    const isAdmin = userRoles.includes('admin') || userRoles.includes('super_admin');
    if (!isAdmin && page.authorId !== userId) {
      throw new ForbiddenException('ليس لديك صلاحية حذف هذه الصفحة');
    }

    // Soft delete
    await this.prisma.page.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'تم حذف الصفحة بنجاح' };
  }

  async setAsHomepage(id: string, userId: string) {
    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    if (!page || page.deletedAt) {
      throw new NotFoundException('الصفحة غير موجودة');
    }

    // Unset current homepage for this language
    await this.prisma.page.updateMany({
      where: { isHomepage: true, language: page.language },
      data: { isHomepage: false },
    });

    // Set new homepage
    await this.prisma.page.update({
      where: { id },
      data: {
        isHomepage: true,
        editorId: userId,
      },
    });

    return this.findOne(id);
  }

  async reorder(items: { id: string; sortOrder: number; parentId?: string | null }[]) {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.page.update({
          where: { id: item.id },
          data: {
            sortOrder: item.sortOrder,
            parentId: item.parentId,
          },
        }),
      ),
    );

    return { message: 'تم إعادة ترتيب الصفحات بنجاح' };
  }

  // Translation methods
  async createTranslation(pageId: string, dto: CreatePageTranslationDto) {
    const page = await this.prisma.page.findUnique({
      where: { id: pageId },
    });

    if (!page || page.deletedAt) {
      throw new NotFoundException('الصفحة غير موجودة');
    }

    // Check if translation already exists
    const existingTranslation = await this.prisma.pageTranslation.findUnique({
      where: {
        pageId_language: {
          pageId,
          language: dto.language,
        },
      },
    });

    if (existingTranslation) {
      throw new BadRequestException('الترجمة موجودة بالفعل لهذه اللغة');
    }

    const translation = await this.prisma.pageTranslation.create({
      data: {
        pageId,
        language: dto.language,
        title: dto.title,
        content: dto.content,
        excerpt: dto.excerpt,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        translationType: dto.translationType || 'MANUAL',
      },
    });

    return translation;
  }

  async updateTranslation(translationId: string, dto: UpdatePageTranslationDto) {
    const translation = await this.prisma.pageTranslation.findUnique({
      where: { id: translationId },
    });

    if (!translation) {
      throw new NotFoundException('الترجمة غير موجودة');
    }

    return this.prisma.pageTranslation.update({
      where: { id: translationId },
      data: dto,
    });
  }

  async deleteTranslation(translationId: string) {
    const translation = await this.prisma.pageTranslation.findUnique({
      where: { id: translationId },
    });

    if (!translation) {
      throw new NotFoundException('الترجمة غير موجودة');
    }

    await this.prisma.pageTranslation.delete({
      where: { id: translationId },
    });

    return { message: 'تم حذف الترجمة بنجاح' };
  }

  async getTranslations(pageId: string) {
    const page = await this.prisma.page.findUnique({
      where: { id: pageId },
      include: { translations: true },
    });

    if (!page || page.deletedAt) {
      throw new NotFoundException('الصفحة غير موجودة');
    }

    return page.translations;
  }

  // Helper methods
  private async getNextVersion(pageId: string): Promise<number> {
    const lastVersion = await this.prisma.pageVersion.findFirst({
      where: { pageId },
      orderBy: { version: 'desc' },
    });
    return (lastVersion?.version || 0) + 1;
  }

  private generateExcerpt(content: string, maxLength: number = 200): string {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  }

  private formatPage(page: any) {
    return {
      id: page.id,
      slug: page.slug,
      title: page.title,
      excerpt: page.excerpt,
      status: page.status,
      language: page.language,
      template: page.template,
      isHomepage: page.isHomepage,
      isSystem: page.isSystem,
      featuredImageUrl: page.featuredImageUrl,
      parent: page.parent,
      childrenCount: page.children?.length || 0,
      translations: page.translations?.map((t: any) => ({
        id: t.id,
        language: t.language,
        title: t.title,
        isReviewed: t.isReviewed,
      })),
      sortOrder: page.sortOrder,
      publishedAt: page.publishedAt,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
  }

  private formatPageDetails(page: any) {
    return {
      id: page.id,
      slug: page.slug,
      title: page.title,
      content: page.content,
      contentHtml: page.contentHtml,
      excerpt: page.excerpt,
      status: page.status,
      language: page.language,
      template: page.template,
      isHomepage: page.isHomepage,
      isSystem: page.isSystem,
      featuredImageUrl: page.featuredImageUrl,
      featuredImageAlt: page.featuredImageAlt,
      allowComments: page.allowComments,
      showInMenu: page.showInMenu,
      seo: {
        title: page.seoTitle,
        description: page.seoDescription,
        keywords: page.seoKeywords,
        canonicalUrl: page.canonicalUrl,
      },
      parent: page.parent,
      children: page.children,
      translations: page.translations,
      versions: page.versions,
      sortOrder: page.sortOrder,
      publishedAt: page.publishedAt,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
  }

  private formatPageTree(page: any): any {
    return {
      id: page.id,
      slug: page.slug,
      title: page.title,
      status: page.status,
      isHomepage: page.isHomepage,
      sortOrder: page.sortOrder,
      children: page.children?.map((child: any) => this.formatPageTree(child)) || [],
    };
  }
}

