import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedLanguages() {
  console.log('Seeding languages...');
  
  const languages = [
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      direction: 'rtl',
      flag: '🇸🇦',
      isActive: true,
      isDefault: true,
      isFallback: false,
      dateFormat: 'DD/MM/YYYY',
      timeFormat: 'HH:mm',
      timezone: 'Asia/Riyadh',
      numberFormat: { decimal: '.', thousand: ',' },
      currency: 'SAR',
      locale: 'ar_SA',
      hreflang: 'ar',
      sortOrder: 1,
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      direction: 'ltr',
      flag: '🇬🇧',
      isActive: true,
      isDefault: false,
      isFallback: true,
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm A',
      timezone: 'UTC',
      numberFormat: { decimal: '.', thousand: ',' },
      currency: 'USD',
      locale: 'en_US',
      hreflang: 'en',
      sortOrder: 2,
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      direction: 'ltr',
      flag: '🇫🇷',
      isActive: true,
      isDefault: false,
      isFallback: false,
      dateFormat: 'DD/MM/YYYY',
      timeFormat: 'HH:mm',
      timezone: 'Europe/Paris',
      numberFormat: { decimal: ',', thousand: ' ' },
      currency: 'EUR',
      locale: 'fr_FR',
      hreflang: 'fr',
      sortOrder: 3,
    },
  ];

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: lang,
      create: lang,
    });
  }

  console.log('Languages seeded successfully');
}

async function seedTranslationNamespaces() {
  console.log('Seeding translation namespaces...');
  
  const namespaces = [
    { name: 'common', description: 'ترجمات عامة مشتركة', isSystem: true },
    { name: 'admin', description: 'ترجمات لوحة التحكم', isSystem: true },
    { name: 'frontend', description: 'ترجمات الواجهة الأمامية', isSystem: true },
    { name: 'articles', description: 'ترجمات المقالات', isSystem: true },
    { name: 'categories', description: 'ترجمات التصنيفات', isSystem: true },
    { name: 'errors', description: 'رسائل الأخطاء', isSystem: true },
    { name: 'validations', description: 'رسائل التحقق', isSystem: true },
    { name: 'emails', description: 'قوالب البريد الإلكتروني', isSystem: true },
  ];

  for (const ns of namespaces) {
    await prisma.translationNamespace.upsert({
      where: { name: ns.name },
      update: ns,
      create: ns,
    });
  }

  console.log('Translation namespaces seeded successfully');
}

async function seedDefaultTheme() {
  console.log('Seeding default theme...');
  
  const defaultTheme = {
    slug: 'default',
    name: 'NewsCore Default Theme',
    version: '1.0.0',
    author: 'NewsCore Team',
    description: 'القالب الافتراضي لنظام NewsCore - تصميم عصري وسريع الاستجابة مع دعم كامل للغة العربية',
    previewImage: '/themes/default/preview.png',
    manifest: {
      id: 'default',
      name: 'NewsCore Default Theme',
      version: '1.0.0',
      features: ['articles', 'pages', 'categories', 'tags', 'menus', 'widgets', 'breaking-news', 'search', 'dark-mode', 'rtl'],
      templates: [
        { id: 'home', name: 'Home Page', type: 'home', isDefault: true },
        { id: 'article', name: 'Article Page', type: 'article', isDefault: true },
        { id: 'category', name: 'Category Page', type: 'category', isDefault: true },
        { id: 'page-default', name: 'Default Page', type: 'page', isDefault: true },
      ],
      regions: [
        { id: 'header', name: 'Header', type: 'header' },
        { id: 'sidebar-right', name: 'Right Sidebar', type: 'sidebar' },
        { id: 'footer', name: 'Footer', type: 'footer' },
      ],
    },
    features: ['articles', 'pages', 'categories', 'tags', 'menus', 'widgets', 'breaking-news', 'search', 'dark-mode', 'rtl'],
    isActive: true,
    isDefault: true,
    isSystem: true,
    path: '/themes/default',
    defaultSettings: {
      primaryColor: '#ed7520',
      secondaryColor: '#0ea5e9',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'Cairo',
      fontSize: '16px',
      stickyHeader: true,
      showBreakingNews: true,
      darkModeEnabled: true,
    },
  };

  await prisma.theme.upsert({
    where: { slug: 'default' },
    update: defaultTheme,
    create: defaultTheme,
  });

  console.log('Default theme seeded successfully');
}

async function seedCoreModules() {
  console.log('Seeding core modules...');
  
  const coreModules = [
    {
      slug: 'articles',
      name: 'المقالات',
      version: '1.0.0',
      description: 'وحدة إدارة المقالات والأخبار',
      icon: '📰',
      type: 'CORE' as const,
      manifest: {
        id: 'articles',
        name: 'Articles',
        type: 'CORE',
        provides: {
          routes: ['/api/v1/articles'],
          adminPages: [{ path: '/articles', title: 'المقالات' }],
        },
      },
      isEnabled: true,
      isInstalled: true,
      isCore: true,
      isSystem: true,
      path: '/modules/articles',
    },
    {
      slug: 'categories',
      name: 'التصنيفات',
      version: '1.0.0',
      description: 'وحدة إدارة التصنيفات',
      icon: '📁',
      type: 'CORE' as const,
      manifest: {
        id: 'categories',
        name: 'Categories',
        type: 'CORE',
        provides: {
          routes: ['/api/v1/categories'],
          adminPages: [{ path: '/categories', title: 'التصنيفات' }],
        },
      },
      isEnabled: true,
      isInstalled: true,
      isCore: true,
      isSystem: true,
      path: '/modules/categories',
    },
    {
      slug: 'media',
      name: 'الوسائط',
      version: '1.0.0',
      description: 'وحدة إدارة الصور والملفات',
      icon: '🖼️',
      type: 'CORE' as const,
      manifest: {
        id: 'media',
        name: 'Media',
        type: 'CORE',
        provides: {
          routes: ['/api/v1/media'],
          adminPages: [{ path: '/media', title: 'الوسائط' }],
        },
      },
      isEnabled: true,
      isInstalled: true,
      isCore: true,
      isSystem: true,
      path: '/modules/media',
    },
    {
      slug: 'users',
      name: 'المستخدمين',
      version: '1.0.0',
      description: 'وحدة إدارة المستخدمين والصلاحيات',
      icon: '👥',
      type: 'CORE' as const,
      manifest: {
        id: 'users',
        name: 'Users',
        type: 'CORE',
        provides: {
          routes: ['/api/v1/users'],
          adminPages: [{ path: '/users', title: 'المستخدمين' }],
        },
      },
      isEnabled: true,
      isInstalled: true,
      isCore: true,
      isSystem: true,
      path: '/modules/users',
    },
    {
      slug: 'pages',
      name: 'الصفحات',
      version: '1.0.0',
      description: 'وحدة إدارة الصفحات الثابتة',
      icon: '📄',
      type: 'CORE' as const,
      manifest: {
        id: 'pages',
        name: 'Pages',
        type: 'CORE',
        provides: {
          routes: ['/api/v1/pages'],
          adminPages: [{ path: '/pages', title: 'الصفحات' }],
        },
      },
      isEnabled: true,
      isInstalled: true,
      isCore: true,
      isSystem: true,
      path: '/modules/pages',
    },
    {
      slug: 'menus',
      name: 'القوائم',
      version: '1.0.0',
      description: 'وحدة إدارة قوائم التنقل',
      icon: '📋',
      type: 'CORE' as const,
      manifest: {
        id: 'menus',
        name: 'Menus',
        type: 'CORE',
        provides: {
          routes: ['/api/v1/menus'],
          adminPages: [{ path: '/menus', title: 'القوائم' }],
        },
      },
      isEnabled: true,
      isInstalled: true,
      isCore: true,
      isSystem: true,
      path: '/modules/menus',
    },
    {
      slug: 'breaking-news',
      name: 'الأخبار العاجلة',
      version: '1.0.0',
      description: 'وحدة إدارة الأخبار العاجلة',
      icon: '🚨',
      type: 'EXTENSION' as const,
      manifest: {
        id: 'breaking-news',
        name: 'Breaking News',
        type: 'EXTENSION',
        provides: {
          routes: ['/api/v1/breaking-news'],
          adminPages: [{ path: '/breaking-news', title: 'الأخبار العاجلة' }],
          frontendComponents: [{ id: 'BreakingNewsBanner', region: 'top-bar' }],
        },
      },
      isEnabled: true,
      isInstalled: true,
      isCore: false,
      isSystem: false,
      path: '/modules/breaking-news',
    },
    {
      slug: 'analytics',
      name: 'التحليلات',
      version: '1.0.0',
      description: 'وحدة تحليلات وإحصائيات الموقع',
      icon: '📊',
      type: 'EXTENSION' as const,
      manifest: {
        id: 'analytics',
        name: 'Analytics',
        type: 'EXTENSION',
        provides: {
          routes: ['/api/v1/analytics'],
          adminPages: [{ path: '/analytics', title: 'التحليلات' }],
        },
      },
      isEnabled: true,
      isInstalled: true,
      isCore: false,
      isSystem: false,
      path: '/modules/analytics',
    },
  ];

  for (const module of coreModules) {
    await prisma.module.upsert({
      where: { slug: module.slug },
      update: module,
      create: {
        ...module,
        installedAt: new Date(),
        enabledAt: new Date(),
      },
    });
  }

  console.log('Core modules seeded successfully');
}

async function seedSystemHooks() {
  console.log('Seeding system hooks...');
  
  const hooks = [
    { name: 'article.beforeCreate', description: 'Before article creation', isSystem: true },
    { name: 'article.afterCreate', description: 'After article creation', isSystem: true },
    { name: 'article.beforeUpdate', description: 'Before article update', isSystem: true },
    { name: 'article.afterUpdate', description: 'After article update', isSystem: true },
    { name: 'article.beforeDelete', description: 'Before article deletion', isSystem: true },
    { name: 'article.afterDelete', description: 'After article deletion', isSystem: true },
    { name: 'article.beforePublish', description: 'Before article publish', isSystem: true },
    { name: 'article.afterPublish', description: 'After article publish', isSystem: true },
    { name: 'user.beforeLogin', description: 'Before user login', isSystem: true },
    { name: 'user.afterLogin', description: 'After user login', isSystem: true },
    { name: 'user.afterRegister', description: 'After user registration', isSystem: true },
    { name: 'media.beforeUpload', description: 'Before media upload', isSystem: true },
    { name: 'media.afterUpload', description: 'After media upload', isSystem: true },
    { name: 'page.beforeCreate', description: 'Before page creation', isSystem: true },
    { name: 'page.afterCreate', description: 'After page creation', isSystem: true },
    { name: 'system.init', description: 'System initialization', isSystem: true },
  ];

  for (const hook of hooks) {
    await prisma.hook.upsert({
      where: { name: hook.name },
      update: hook,
      create: hook,
    });
  }

  console.log('System hooks seeded successfully');
}

async function seedDefaultWidgets() {
  console.log('Seeding default widgets...');
  
  const widgets = [
    {
      slug: 'recent-articles',
      name: 'أحدث المقالات',
      description: 'يعرض قائمة بأحدث المقالات',
      type: 'articles',
      content: { count: 5, showImage: true, showDate: true },
      region: 'sidebar-right',
      position: 1,
      isActive: true,
    },
    {
      slug: 'popular-articles',
      name: 'الأكثر قراءة',
      description: 'يعرض المقالات الأكثر قراءة',
      type: 'articles',
      content: { count: 5, sortBy: 'views', showImage: true },
      region: 'sidebar-right',
      position: 2,
      isActive: true,
    },
    {
      slug: 'categories-widget',
      name: 'التصنيفات',
      description: 'يعرض قائمة التصنيفات',
      type: 'categories',
      content: { showCount: true, layout: 'list' },
      region: 'sidebar-right',
      position: 3,
      isActive: true,
    },
    {
      slug: 'tags-cloud',
      name: 'سحابة الوسوم',
      description: 'يعرض الوسوم الأكثر استخداماً',
      type: 'tags',
      content: { count: 20, layout: 'cloud' },
      region: 'sidebar-right',
      position: 4,
      isActive: true,
    },
    {
      slug: 'newsletter-widget',
      name: 'اشترك في النشرة',
      description: 'نموذج الاشتراك في النشرة البريدية',
      type: 'newsletter',
      content: { title: 'اشترك في نشرتنا الإخبارية', description: 'احصل على أحدث الأخبار في بريدك' },
      region: 'footer-widgets',
      position: 1,
      isActive: true,
    },
    {
      slug: 'social-links',
      name: 'روابط التواصل',
      description: 'روابط مواقع التواصل الاجتماعي',
      type: 'social',
      content: { platforms: ['facebook', 'twitter', 'instagram', 'youtube'] },
      region: 'footer-widgets',
      position: 2,
      isActive: true,
    },
  ];

  for (const widget of widgets) {
    await prisma.widget.upsert({
      where: { slug: widget.slug },
      update: widget,
      create: widget,
    });
  }

  console.log('Default widgets seeded successfully');
}

async function main() {
  console.log('🌱 Starting core system seed...\n');

  try {
    await seedLanguages();
    await seedTranslationNamespaces();
    await seedDefaultTheme();
    await seedCoreModules();
    await seedSystemHooks();
    await seedDefaultWidgets();

    console.log('\n✅ Core system seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
