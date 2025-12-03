import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SlugUtil } from '../../common/utils/slug.util';
import {
  CreateMenuDto,
  UpdateMenuDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  MenuQueryDto,
} from './dto';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // MENU CRUD
  // ============================================

  async create(dto: CreateMenuDto, userId: string) {
    const slug = dto.slug || SlugUtil.generateUnique(dto.name);

    return this.prisma.menu.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        isActive: dto.isActive ?? true,
        cssClass: dto.cssClass,
        theme: dto.theme,
        createdById: userId,
        updatedById: userId,
      },
      include: {
        items: {
          where: { parentId: null },
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        locations: true,
      },
    });
  }

  async findAll(query: MenuQueryDto) {
    const where: any = {};

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.location) {
      where.locations = {
        some: {
          location: query.location,
          isActive: true,
        },
      };
    }

    return this.prisma.menu.findMany({
      where,
      include: {
        items: {
          where: { parentId: null, isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
            },
            category: true,
            tag: true,
            article: {
              select: {
                id: true,
                slug: true,
                title: true,
                coverImageUrl: true,
              },
            },
          },
        },
        locations: true,
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, includeItems = true) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: includeItems
        ? {
            items: {
              orderBy: { sortOrder: 'asc' },
              include: {
                children: {
                  orderBy: { sortOrder: 'asc' },
                },
                category: true,
                tag: true,
                article: {
                  select: {
                    id: true,
                    slug: true,
                    title: true,
                    coverImageUrl: true,
                  },
                },
              },
            },
            locations: true,
          }
        : undefined,
    });

    if (!menu) {
      throw new NotFoundException('القائمة غير موجودة');
    }

    return menu;
  }

  async findBySlug(slug: string, query: MenuQueryDto) {
    const menu = await this.prisma.menu.findUnique({
      where: { slug, isActive: true },
      include: {
        items: {
          where: {
            parentId: null,
            isActive: true,
            ...(query.language && {
              OR: [
                { labelAr: { not: null } },
                { labelEn: { not: null } },
                { labelFr: { not: null } },
              ],
            }),
          },
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
              include: {
                category: true,
                tag: true,
                article: {
                  select: {
                    id: true,
                    slug: true,
                    title: true,
                    coverImageUrl: true,
                  },
                },
              },
            },
            category: {
              select: {
                id: true,
                slug: true,
                name: true,
                nameAr: true,
                nameEn: true,
                nameFr: true,
                coverImage: true,
                icon: true,
              },
            },
            tag: {
              select: {
                id: true,
                slug: true,
                name: true,
                nameAr: true,
                nameEn: true,
                nameFr: true,
              },
            },
            article: {
              select: {
                id: true,
                slug: true,
                title: true,
                coverImageUrl: true,
              },
            },
          },
        },
        locations: {
          where: { isActive: true },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException('القائمة غير موجودة');
    }

    return menu;
  }

  async findByLocation(location: string, query: MenuQueryDto) {
    const menuLocation = await this.prisma.menuLocation.findFirst({
      where: {
        location,
        isActive: true,
        menu: {
          isActive: true,
        },
      },
      include: {
        menu: {
          include: {
            items: {
              where: {
                parentId: null,
                isActive: true,
              },
              orderBy: { sortOrder: 'asc' },
              include: {
                children: {
                  where: { isActive: true },
                  orderBy: { sortOrder: 'asc' },
                  include: {
                    category: true,
                    tag: true,
                    article: {
                      select: {
                        id: true,
                        slug: true,
                        title: true,
                        coverImageUrl: true,
                      },
                    },
                  },
                },
                category: {
                  select: {
                    id: true,
                    slug: true,
                    name: true,
                    nameAr: true,
                    nameEn: true,
                    nameFr: true,
                    coverImage: true,
                    icon: true,
                  },
                },
                tag: {
                  select: {
                    id: true,
                    slug: true,
                    name: true,
                    nameAr: true,
                    nameEn: true,
                    nameFr: true,
                  },
                },
                article: {
                  select: {
                    id: true,
                    slug: true,
                    title: true,
                    coverImageUrl: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        priority: 'desc',
      },
    });

    if (!menuLocation) {
      return null;
    }

    return menuLocation.menu;
  }

  async update(id: string, dto: UpdateMenuDto, userId: string) {
    const menu = await this.findOne(id, false);

    if (menu.isSystem) {
      throw new ForbiddenException('لا يمكن تعديل القائمة النظامية');
    }

    const updateData: any = {
      ...dto,
      updatedById: userId,
    };

    if (dto.name && !dto.slug) {
      updateData.slug = SlugUtil.generateUnique(dto.name, id);
    }

    return this.prisma.menu.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          where: { parentId: null },
          orderBy: { sortOrder: 'asc' },
        },
        locations: true,
      },
    });
  }

  async remove(id: string) {
    const menu = await this.findOne(id, false);

    if (menu.isSystem) {
      throw new ForbiddenException('لا يمكن حذف القائمة النظامية');
    }

    return this.prisma.menu.delete({
      where: { id },
    });
  }

  // ============================================
  // MENU ITEMS
  // ============================================

  async createItem(menuId: string, dto: CreateMenuItemDto) {
    await this.findOne(menuId, false);

    // Validate based on type
    this.validateMenuItem(dto);

    return this.prisma.menuItem.create({
      data: {
        menuId,
        parentId: dto.parentId,
        label: dto.label,
        labelAr: dto.labelAr || dto.label,
        labelEn: dto.labelEn,
        labelFr: dto.labelFr,
        type: dto.type,
        url: dto.url,
        categoryId: dto.categoryId,
        tagId: dto.tagId,
        articleId: dto.articleId,
        pageId: dto.pageId,
        target: dto.target || '_self',
        icon: dto.icon,
        imageUrl: dto.imageUrl,
        description: dto.description,
        cssClass: dto.cssClass,
        isMegaMenu: dto.isMegaMenu || false,
        megaMenuLayout: dto.megaMenuLayout,
        megaMenuContent: dto.megaMenuContent,
        isActive: dto.isActive ?? true,
        isVisible: dto.isVisible ?? true,
        showOnMobile: dto.showOnMobile ?? true,
        showOnDesktop: dto.showOnDesktop ?? true,
        displayConditions: dto.displayConditions,
        sortOrder: dto.sortOrder || 0,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
      },
      include: {
        category: true,
        tag: true,
        article: true,
        children: true,
      },
    });
  }

  async updateItem(id: string, dto: UpdateMenuItemDto) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('عنصر القائمة غير موجود');
    }

    // Validate based on type
    if (dto.type) {
      this.validateMenuItem({ ...item, ...dto } as CreateMenuItemDto);
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: {
        ...dto,
        parentId: dto.parentId === null ? null : dto.parentId,
      },
      include: {
        category: true,
        tag: true,
        article: true,
        children: true,
        parent: true,
      },
    });
  }

  async removeItem(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!item) {
      throw new NotFoundException('عنصر القائمة غير موجود');
    }

    if (item.children.length > 0) {
      throw new BadRequestException(
        'لا يمكن حذف العنصر لأنه يحتوي على عناصر فرعية',
      );
    }

    return this.prisma.menuItem.delete({
      where: { id },
    });
  }

  async reorderItems(menuId: string, itemOrders: { id: string; sortOrder: number; parentId?: string | null }[]) {
    await this.findOne(menuId, false);

    const updates = itemOrders.map(({ id, sortOrder, parentId }) =>
      this.prisma.menuItem.update({
        where: { id },
        data: { sortOrder, parentId: parentId === null ? null : parentId },
      }),
    );

    await Promise.all(updates);

    return this.findOne(menuId);
  }

  // ============================================
  // MENU LOCATIONS
  // ============================================

  async assignLocation(menuId: string, location: string, priority = 0, conditions?: any) {
    await this.findOne(menuId, false);

    return this.prisma.menuLocation.upsert({
      where: {
        menuId_location: {
          menuId,
          location,
        },
      },
      create: {
        menuId,
        location,
        priority,
        conditions,
        isActive: true,
      },
      update: {
        priority,
        conditions,
        isActive: true,
      },
    });
  }

  async removeLocation(menuId: string, location: string) {
    return this.prisma.menuLocation.delete({
      where: {
        menuId_location: {
          menuId,
          location,
        },
      },
    });
  }

  // ============================================
  // HELPERS
  // ============================================

  private validateMenuItem(dto: CreateMenuItemDto | UpdateMenuItemDto) {
    const type = dto.type;

    if (type === 'CUSTOM' && !dto.url) {
      throw new BadRequestException('الرابط مطلوب للعناصر المخصصة');
    }

    if (type === 'CATEGORY' && !dto.categoryId) {
      throw new BadRequestException('القسم مطلوب لعناصر القسم');
    }

    if (type === 'TAG' && !dto.tagId) {
      throw new BadRequestException('الوسم مطلوب لعناصر الوسم');
    }

    if (type === 'ARTICLE' && !dto.articleId) {
      throw new BadRequestException('المقال مطلوب لعناصر المقال');
    }

    if (type === 'PAGE' && !dto.pageId) {
      throw new BadRequestException('الصفحة مطلوبة لعناصر الصفحة');
    }
  }

  // ============================================
  // DYNAMIC MENU ITEMS
  // ============================================

  async getDynamicItems(type: string, limit = 5) {
    switch (type) {
      case 'latest-categories':
        return this.prisma.category.findMany({
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: limit,
          select: {
            id: true,
            slug: true,
            name: true,
            nameAr: true,
            nameEn: true,
            nameFr: true,
            coverImage: true,
            icon: true,
          },
        });

      case 'trending-categories':
        return this.prisma.category.findMany({
          where: { isActive: true, isFeatured: true },
          orderBy: { createdAt: 'desc' },
          take: limit,
          select: {
            id: true,
            slug: true,
            name: true,
            nameAr: true,
            nameEn: true,
            nameFr: true,
            coverImage: true,
            icon: true,
          },
        });

      case 'popular-tags':
        return this.prisma.tag.findMany({
          orderBy: { usageCount: 'desc' },
          take: limit,
          select: {
            id: true,
            slug: true,
            name: true,
            nameAr: true,
            nameEn: true,
            nameFr: true,
          },
        });

      default:
        return [];
    }
  }
}

