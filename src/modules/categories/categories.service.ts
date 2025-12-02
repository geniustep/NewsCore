import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SlugUtil } from '../../common/utils/slug.util';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const slug = SlugUtil.generate(dto.name);

    // Check if slug exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new ConflictException('تصنيف بهذا الاسم موجود بالفعل');
    }

    const category = await this.prisma.category.create({
      data: {
        slug,
        name: dto.name,
        nameAr: dto.nameAr || dto.name,
        nameEn: dto.nameEn,
        nameFr: dto.nameFr,
        description: dto.description,
        color: dto.color,
        icon: dto.icon,
        coverImage: dto.coverImage,
        parentId: dto.parentId,
        sortOrder: dto.sortOrder || 0,
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { articles: true },
        },
      },
    });

    return this.formatCategory(category);
  }

  async findAll(includeInactive: boolean = false) {
    const where: any = {};
    if (!includeInactive) {
      where.isActive = true;
    }

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        parent: true,
        children: {
          where: includeInactive ? {} : { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { articles: true },
        },
      },
    });

    return categories.map((cat) => this.formatCategory(cat));
  }

  async findTree() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
            },
            _count: {
              select: { articles: true },
            },
          },
        },
        _count: {
          select: { articles: true },
        },
      },
    });

    return categories.map((cat) => this.formatCategoryTree(cat));
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('التصنيف غير موجود');
    }

    return this.formatCategory(category);
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category || !category.isActive) {
      throw new NotFoundException('التصنيف غير موجود');
    }

    return this.formatCategory(category);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('التصنيف غير موجود');
    }

    const updateData: any = { ...dto };

    // Update slug if name changed
    if (dto.name && dto.name !== category.name) {
      const newSlug = SlugUtil.generate(dto.name);
      const existingCategory = await this.prisma.category.findUnique({
        where: { slug: newSlug },
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('تصنيف بهذا الاسم موجود بالفعل');
      }
      updateData.slug = newSlug;
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        parent: true,
        children: true,
        _count: {
          select: { articles: true },
        },
      },
    });

    return this.formatCategory(updated);
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('التصنيف غير موجود');
    }

    if (category.children.length > 0) {
      throw new ConflictException('لا يمكن حذف تصنيف يحتوي على تصنيفات فرعية');
    }

    if (category._count.articles > 0) {
      throw new ConflictException('لا يمكن حذف تصنيف يحتوي على مقالات');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'تم حذف التصنيف بنجاح' };
  }

  private formatCategory(category: any) {
    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      nameFr: category.nameFr,
      description: category.description,
      color: category.color,
      icon: category.icon,
      coverImage: category.coverImage,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      isFeatured: category.isFeatured,
      seo: {
        title: category.seoTitle,
        description: category.seoDescription,
      },
      parent: category.parent
        ? {
            id: category.parent.id,
            slug: category.parent.slug,
            name: category.parent.name,
          }
        : null,
      children: category.children?.map((child: any) => ({
        id: child.id,
        slug: child.slug,
        name: child.name,
        color: child.color,
        icon: child.icon,
      })),
      articlesCount: category._count?.articles || 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  private formatCategoryTree(category: any): any {
    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      nameAr: category.nameAr,
      color: category.color,
      icon: category.icon,
      articlesCount: category._count?.articles || 0,
      children: category.children?.map((child: any) =>
        this.formatCategoryTree(child),
      ),
    };
  }
}

