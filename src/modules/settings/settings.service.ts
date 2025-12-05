import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateSettingDto, CreateSettingDto, ThemeSettingsDto } from './dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(isPublic?: boolean) {
    const where = isPublic !== undefined ? { isPublic } : {};
    return this.prisma.setting.findMany({
      where,
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });
  }

  async findByGroup(group: string, isPublic?: boolean) {
    const where: any = { group };
    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }
    return this.prisma.setting.findMany({
      where,
      orderBy: { key: 'asc' },
    });
  }

  async findByKey(key: string) {
    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    return setting;
  }

  async findPublicByKey(key: string) {
    const setting = await this.prisma.setting.findFirst({
      where: { key, isPublic: true },
    });
    if (!setting) {
      throw new NotFoundException(`Public setting with key "${key}" not found`);
    }
    return setting;
  }

  async create(dto: CreateSettingDto) {
    return this.prisma.setting.create({
      data: dto,
    });
  }

  async update(key: string, dto: UpdateSettingDto) {
    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    return this.prisma.setting.update({
      where: { key },
      data: dto,
    });
  }

  async upsert(key: string, dto: CreateSettingDto) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value: dto.value },
      create: dto,
    });
  }

  async delete(key: string) {
    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    return this.prisma.setting.delete({
      where: { key },
    });
  }

  // Theme Settings - Special methods
  async getThemeSettings(): Promise<ThemeSettingsDto> {
    const settings = await this.prisma.setting.findMany({
      where: { group: 'theme' },
    });

    const themeSettings: ThemeSettingsDto = {
      logoAr: '',
      logoEn: '',
      logoFr: '',
      favicon: '',
      primaryColor: '#ed7520',
      secondaryColor: '#0ea5e9',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'IBM Plex Sans Arabic',
      fontSize: '16px',
      headingFont: 'IBM Plex Sans Arabic',
      borderRadius: '0.5rem',
      spacing: 'normal',
      darkModeEnabled: false,
      darkPrimaryColor: '#f59e0b',
      darkBackgroundColor: '#111827',
      darkTextColor: '#f9fafb',
    };

    for (const setting of settings) {
      const key = setting.key.replace('theme.', '') as keyof ThemeSettingsDto;
      if (key in themeSettings) {
        (themeSettings as any)[key] = setting.value;
      }
    }

    return themeSettings;
  }

  async updateThemeSettings(dto: ThemeSettingsDto) {
    const operations = Object.entries(dto).map(([key, value]) => {
      const settingKey = `theme.${key}`;
      return this.prisma.setting.upsert({
        where: { key: settingKey },
        update: { value: value as any },
        create: {
          key: settingKey,
          value: value as any,
          type: typeof value === 'boolean' ? 'boolean' : 'string',
          group: 'theme',
          label: key,
          isPublic: true,
        },
      });
    });

    await this.prisma.$transaction(operations);
    return this.getThemeSettings();
  }

  // Site Settings
  async getSiteSettings() {
    const settings = await this.prisma.setting.findMany({
      where: { group: 'site', isPublic: true },
    });

    const result: Record<string, any> = {};
    for (const setting of settings) {
      const key = setting.key.replace('site.', '');
      result[key] = setting.value;
    }
    return result;
  }
}

