import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateWidgetDto, UpdateWidgetDto, WidgetQueryDto, ReorderWidgetsDto } from './dto';

@Injectable()
export class WidgetsService {
  private readonly logger = new Logger(WidgetsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get all widgets
   */
  async findAll(query?: WidgetQueryDto) {
    const where: any = {};
    
    if (query?.region) {
      where.region = query.region;
    }
    if (query?.type) {
      where.type = query.type;
    }
    if (query?.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return this.prisma.widget.findMany({
      where,
      orderBy: [
        { region: 'asc' },
        { position: 'asc' },
      ],
    });
  }

  /**
   * Get widgets by region
   */
  async findByRegion(region: string, options?: { isActive?: boolean }) {
    const where: any = { region };
    
    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    return this.prisma.widget.findMany({
      where,
      orderBy: { position: 'asc' },
    });
  }

  /**
   * Get widget by slug
   */
  async findBySlug(slug: string) {
    const widget = await this.prisma.widget.findUnique({
      where: { slug },
    });

    if (!widget) {
      throw new NotFoundException(`Widget with slug "${slug}" not found`);
    }

    return widget;
  }

  /**
   * Get widget by ID
   */
  async findById(id: string) {
    const widget = await this.prisma.widget.findUnique({
      where: { id },
    });

    if (!widget) {
      throw new NotFoundException(`Widget with ID "${id}" not found`);
    }

    return widget;
  }

  /**
   * Create a new widget
   */
  async create(dto: CreateWidgetDto) {
    // Check if slug already exists
    const existing = await this.prisma.widget.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new BadRequestException(`Widget with slug "${dto.slug}" already exists`);
    }

    // Get max position in region
    if (dto.region && dto.position === undefined) {
      const maxPosition = await this.prisma.widget.aggregate({
        where: { region: dto.region },
        _max: { position: true },
      });
      dto.position = (maxPosition._max.position || 0) + 1;
    }

    return this.prisma.widget.create({
      data: dto,
    });
  }

  /**
   * Update a widget
   */
  async update(slug: string, dto: UpdateWidgetDto) {
    await this.findBySlug(slug);

    return this.prisma.widget.update({
      where: { slug },
      data: dto,
    });
  }

  /**
   * Delete a widget
   */
  async delete(slug: string) {
    await this.findBySlug(slug);

    await this.prisma.widget.delete({
      where: { slug },
    });

    return { success: true };
  }

  /**
   * Reorder widgets in a region
   */
  async reorder(dto: ReorderWidgetsDto) {
    const operations = dto.widgetIds.map((id, index) => {
      return this.prisma.widget.update({
        where: { id },
        data: { 
          position: index,
          region: dto.region,
        },
      });
    });

    await this.prisma.$transaction(operations);
    return this.findByRegion(dto.region);
  }

  /**
   * Toggle widget active status
   */
  async toggle(slug: string) {
    const widget = await this.findBySlug(slug);

    return this.prisma.widget.update({
      where: { slug },
      data: { isActive: !widget.isActive },
    });
  }

  /**
   * Duplicate a widget
   */
  async duplicate(slug: string, newSlug: string) {
    const widget = await this.findBySlug(slug);

    // Check if new slug exists
    const existing = await this.prisma.widget.findUnique({
      where: { slug: newSlug },
    });

    if (existing) {
      throw new BadRequestException(`Widget with slug "${newSlug}" already exists`);
    }

    return this.prisma.widget.create({
      data: {
        slug: newSlug,
        name: `${widget.name} (Copy)`,
        description: widget.description,
        type: widget.type,
        content: widget.content as any,
        region: widget.region,
        position: widget.position + 1,
        isActive: false,
        showOnMobile: widget.showOnMobile,
        showOnDesktop: widget.showOnDesktop,
        displayConditions: widget.displayConditions as any,
        cssClass: widget.cssClass,
        customCss: widget.customCss,
        cacheEnabled: widget.cacheEnabled,
        cacheTtl: widget.cacheTtl,
      },
    });
  }

  /**
   * Get available widget types
   */
  getWidgetTypes() {
    return [
      { id: 'html', name: 'HTML', description: 'Custom HTML content' },
      { id: 'articles', name: 'Articles', description: 'Display articles list' },
      { id: 'categories', name: 'Categories', description: 'Display categories' },
      { id: 'tags', name: 'Tags', description: 'Display tag cloud' },
      { id: 'newsletter', name: 'Newsletter', description: 'Newsletter signup form' },
      { id: 'social', name: 'Social Links', description: 'Social media links' },
      { id: 'search', name: 'Search', description: 'Search box' },
      { id: 'weather', name: 'Weather', description: 'Weather widget' },
      { id: 'currency', name: 'Currency', description: 'Currency rates' },
      { id: 'trending', name: 'Trending', description: 'Trending articles' },
      { id: 'banner', name: 'Banner', description: 'Banner/Ad space' },
      { id: 'menu', name: 'Menu', description: 'Navigation menu' },
    ];
  }

  /**
   * Get available regions
   */
  getRegions() {
    return [
      { id: 'header', name: 'Header', description: 'Top of the page' },
      { id: 'sidebar-left', name: 'Left Sidebar', description: 'Left sidebar area' },
      { id: 'sidebar-right', name: 'Right Sidebar', description: 'Right sidebar area' },
      { id: 'content-top', name: 'Content Top', description: 'Above main content' },
      { id: 'content-bottom', name: 'Content Bottom', description: 'Below main content' },
      { id: 'footer', name: 'Footer', description: 'Footer area' },
      { id: 'footer-widgets', name: 'Footer Widgets', description: 'Footer widget area' },
    ];
  }
}
