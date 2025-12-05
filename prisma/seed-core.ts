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
    isActive: false,
    isDefault: false,
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

async function seedNewsCoreTheme() {
  console.log('Seeding NewsCore theme...');
  
  const newsCoreTheme = {
    slug: 'newscore',
    name: 'NewsCore Theme',
    version: '1.0.0',
    author: 'NewsCore Team',
    authorUrl: 'https://newscore.dev',
    description: 'قالب إخباري شامل وحديث مع دعم كامل للغة العربية والوضع الداكن وتخطيطات متعددة للصفحة الرئيسية. مبني بـ Next.js 14 و Tailwind CSS.',
    previewImage: '/themes/newscore/preview.png',
    screenshots: [
      '/themes/newscore/screenshots/home-classic.png',
      '/themes/newscore/screenshots/home-magazine.png',
      '/themes/newscore/screenshots/home-grid.png',
      '/themes/newscore/screenshots/article.png',
      '/themes/newscore/screenshots/category.png',
      '/themes/newscore/screenshots/dark-mode.png',
    ],
    manifest: {
      id: 'newscore',
      name: 'NewsCore Theme',
      nameAr: 'قالب نيوز كور',
      version: '1.0.0',
      author: 'NewsCore Team',
      description: 'A comprehensive, modern news theme with RTL support, dark mode, and multiple homepage layouts.',
      descriptionAr: 'قالب إخباري شامل وحديث مع دعم كامل للغة العربية والوضع الداكن وتخطيطات متعددة.',
      features: [
        'articles', 'pages', 'categories', 'tags', 'menus', 'mega-menu', 'widgets',
        'breaking-news', 'search', 'dark-mode', 'rtl', 'multi-language', 'seo-optimized',
        'responsive', 'video-section', 'podcast-section', 'live-streaming', 'photo-gallery',
        'opinion-section', 'newsletter', 'social-hub', 'weather-widget', 'currency-ticker',
        'mobile-app-promo', 'floating-elements', 'accessibility'
      ],
      templates: [
        { id: 'home-classic', name: 'Classic Home', nameAr: 'الرئيسية الكلاسيكية', type: 'home', isDefault: true, file: 'app/[locale]/page.tsx' },
        { id: 'home-magazine', name: 'Magazine Home', nameAr: 'الرئيسية المجلة', type: 'home', file: 'templates/home-magazine.tsx' },
        { id: 'home-grid', name: 'Grid Home', nameAr: 'الرئيسية الشبكية', type: 'home', file: 'templates/home-grid.tsx' },
        { id: 'article-default', name: 'Default Article', nameAr: 'المقال الافتراضي', type: 'article', isDefault: true, file: 'app/[locale]/article/[slug]/page.tsx' },
        { id: 'article-full-width', name: 'Full Width Article', nameAr: 'مقال بعرض كامل', type: 'article', file: 'templates/article-full.tsx' },
        { id: 'category-default', name: 'Default Category', nameAr: 'التصنيف الافتراضي', type: 'category', isDefault: true, file: 'app/[locale]/category/[slug]/page.tsx' },
        { id: 'page-default', name: 'Default Page', nameAr: 'الصفحة الافتراضية', type: 'page', isDefault: true, file: 'app/[locale]/page/[slug]/page.tsx' },
        { id: 'page-full-width', name: 'Full Width Page', nameAr: 'صفحة بعرض كامل', type: 'page', file: 'templates/page-full.tsx' },
        { id: 'page-landing', name: 'Landing Page', nameAr: 'صفحة هبوط', type: 'page', file: 'templates/page-landing.tsx' },
        { id: 'page-contact', name: 'Contact Page', nameAr: 'صفحة اتصل بنا', type: 'page', file: 'templates/page-contact.tsx' },
        { id: 'search-results', name: 'Search Results', nameAr: 'نتائج البحث', type: 'search', isDefault: true, file: 'templates/search.tsx' },
        { id: 'error-404', name: '404 Error Page', nameAr: 'صفحة خطأ 404', type: 'error', isDefault: true, file: 'templates/error-404.tsx' },
      ],
      regions: [
        { id: 'header', name: 'Header', nameAr: 'الترويسة', type: 'header' },
        { id: 'top-bar', name: 'Top Bar', nameAr: 'الشريط العلوي', type: 'widget-area' },
        { id: 'breaking-news', name: 'Breaking News', nameAr: 'الأخبار العاجلة', type: 'widget-area' },
        { id: 'hero', name: 'Hero Section', nameAr: 'القسم الرئيسي', type: 'widget-area' },
        { id: 'sidebar-right', name: 'Right Sidebar', nameAr: 'الشريط الجانبي الأيمن', type: 'sidebar', maxWidgets: 10 },
        { id: 'sidebar-left', name: 'Left Sidebar', nameAr: 'الشريط الجانبي الأيسر', type: 'sidebar', maxWidgets: 10 },
        { id: 'content-before', name: 'Before Content', nameAr: 'قبل المحتوى', type: 'widget-area' },
        { id: 'content-after', name: 'After Content', nameAr: 'بعد المحتوى', type: 'widget-area' },
        { id: 'article-before', name: 'Before Article', nameAr: 'قبل المقال', type: 'widget-area' },
        { id: 'article-after', name: 'After Article', nameAr: 'بعد المقال', type: 'widget-area' },
        { id: 'footer-widgets', name: 'Footer Widgets', nameAr: 'ودجات التذييل', type: 'widget-area', maxWidgets: 4 },
        { id: 'footer', name: 'Footer', nameAr: 'التذييل', type: 'footer' },
        { id: 'floating', name: 'Floating Elements', nameAr: 'العناصر العائمة', type: 'widget-area' },
      ],
      components: [
        { id: 'top-bar', name: 'Top Bar', nameAr: 'الشريط العلوي', file: 'components/homepage/TopBar.tsx', category: 'header' },
        { id: 'search-bar', name: 'Search Bar', nameAr: 'شريط البحث', file: 'components/homepage/SearchBar.tsx', category: 'header' },
        { id: 'breaking-news', name: 'Breaking News', nameAr: 'الأخبار العاجلة', file: 'components/articles/BreakingNews.tsx', category: 'news' },
        { id: 'hero-section', name: 'Hero Section', nameAr: 'القسم الرئيسي', file: 'components/homepage/HeroSection.tsx', category: 'homepage' },
        { id: 'video-section', name: 'Video Section', nameAr: 'قسم الفيديو', file: 'components/homepage/VideoSection.tsx', category: 'media' },
        { id: 'category-section', name: 'Category Section', nameAr: 'قسم التصنيف', file: 'components/homepage/CategorySection.tsx', category: 'homepage' },
        { id: 'sidebar-widgets', name: 'Sidebar Widgets', nameAr: 'ودجات الشريط الجانبي', file: 'components/homepage/SidebarWidgets.tsx', category: 'widgets' },
        { id: 'opinion-section', name: 'Opinion Section', nameAr: 'قسم الرأي', file: 'components/homepage/OpinionSection.tsx', category: 'homepage' },
        { id: 'features-section', name: 'Features Section', nameAr: 'قسم التقارير', file: 'components/homepage/FeaturesSection.tsx', category: 'homepage' },
        { id: 'photo-gallery', name: 'Photo Gallery', nameAr: 'معرض الصور', file: 'components/homepage/PhotoGallery.tsx', category: 'media' },
        { id: 'podcast-section', name: 'Podcast Section', nameAr: 'قسم البودكاست', file: 'components/homepage/PodcastSection.tsx', category: 'media' },
        { id: 'live-section', name: 'Live Section', nameAr: 'قسم البث المباشر', file: 'components/homepage/LiveSection.tsx', category: 'media' },
        { id: 'newsletter-section', name: 'Newsletter Section', nameAr: 'قسم النشرة الإخبارية', file: 'components/homepage/NewsletterSection.tsx', category: 'engagement' },
        { id: 'apps-section', name: 'Apps Section', nameAr: 'قسم التطبيقات', file: 'components/homepage/AppsSection.tsx', category: 'engagement' },
        { id: 'mega-menu', name: 'Mega Menu', nameAr: 'القائمة الكبيرة', file: 'components/menus/MegaMenu.tsx', category: 'navigation' },
        { id: 'article-card', name: 'Article Card', nameAr: 'بطاقة المقال', file: 'components/articles/ArticleCard.tsx', category: 'articles' },
        { id: 'article-grid', name: 'Article Grid', nameAr: 'شبكة المقالات', file: 'components/articles/ArticleGrid.tsx', category: 'articles' },
      ],
      customizer: {
        sections: [
          {
            id: 'identity',
            title: 'Site Identity',
            titleAr: 'هوية الموقع',
            icon: 'Building2',
            fields: [
              { id: 'siteName', type: 'text', label: 'Site Name', labelAr: 'اسم الموقع', default: 'NewsCore' },
              { id: 'siteTagline', type: 'text', label: 'Tagline', labelAr: 'الشعار', default: 'أخبار موثوقة على مدار الساعة' },
              { id: 'logo', type: 'image', label: 'Logo', labelAr: 'الشعار', default: '/logo.svg' },
            ],
          },
          {
            id: 'colors',
            title: 'Colors',
            titleAr: 'الألوان',
            icon: 'Palette',
            fields: [
              { id: 'primaryColor', type: 'color', label: 'Primary Color', labelAr: 'اللون الأساسي', default: '#ed7520' },
              { id: 'secondaryColor', type: 'color', label: 'Secondary Color', labelAr: 'اللون الثانوي', default: '#0ea5e9' },
              { id: 'accentColor', type: 'color', label: 'Accent Color', labelAr: 'لون التمييز', default: '#f59e0b' },
              { id: 'backgroundColor', type: 'color', label: 'Background Color', labelAr: 'لون الخلفية', default: '#ffffff' },
              { id: 'textColor', type: 'color', label: 'Text Color', labelAr: 'لون النص', default: '#1f2937' },
            ],
          },
          {
            id: 'typography',
            title: 'Typography',
            titleAr: 'الخطوط',
            icon: 'Type',
            fields: [
              { id: 'fontFamily', type: 'select', label: 'Body Font', labelAr: 'خط النص', default: 'Cairo', options: [{ value: 'Cairo', label: 'Cairo' }, { value: 'Tajawal', label: 'Tajawal' }, { value: 'Almarai', label: 'Almarai' }] },
              { id: 'fontSize', type: 'select', label: 'Base Font Size', labelAr: 'حجم الخط الأساسي', default: '16px', options: [{ value: '14px', label: 'Small' }, { value: '16px', label: 'Medium' }, { value: '18px', label: 'Large' }] },
            ],
          },
          {
            id: 'layout',
            title: 'Layout',
            titleAr: 'التخطيط',
            icon: 'Layout',
            fields: [
              { id: 'containerWidth', type: 'select', label: 'Container Width', labelAr: 'عرض المحتوى', default: '1280px', options: [{ value: '1024px', label: 'Narrow' }, { value: '1280px', label: 'Standard' }, { value: '1536px', label: 'Wide' }] },
              { id: 'sidebarPosition', type: 'select', label: 'Sidebar Position', labelAr: 'موقع الشريط الجانبي', default: 'right', options: [{ value: 'right', label: 'Right' }, { value: 'left', label: 'Left' }, { value: 'none', label: 'No Sidebar' }] },
            ],
          },
          {
            id: 'header',
            title: 'Header',
            titleAr: 'الترويسة',
            icon: 'PanelTop',
            fields: [
              { id: 'stickyHeader', type: 'toggle', label: 'Sticky Header', labelAr: 'ترويسة ثابتة', default: true },
              { id: 'showTopBar', type: 'toggle', label: 'Show Top Bar', labelAr: 'إظهار الشريط العلوي', default: true },
              { id: 'showSearch', type: 'toggle', label: 'Show Search', labelAr: 'إظهار البحث', default: true },
              { id: 'showWeather', type: 'toggle', label: 'Show Weather', labelAr: 'إظهار الطقس', default: true },
              { id: 'showCurrency', type: 'toggle', label: 'Show Currency Ticker', labelAr: 'إظهار شريط العملات', default: true },
            ],
          },
          {
            id: 'homepage',
            title: 'Homepage',
            titleAr: 'الصفحة الرئيسية',
            icon: 'Home',
            fields: [
              { id: 'heroLayout', type: 'select', label: 'Hero Layout', labelAr: 'تخطيط البانر الرئيسي', default: 'classic', options: [{ value: 'classic', label: 'Classic' }, { value: 'grid', label: 'Grid' }, { value: 'magazine', label: 'Magazine' }] },
              { id: 'showBreakingNews', type: 'toggle', label: 'Show Breaking News', labelAr: 'إظهار الأخبار العاجلة', default: true },
              { id: 'showVideoSection', type: 'toggle', label: 'Show Video Section', labelAr: 'إظهار قسم الفيديو', default: true },
              { id: 'showOpinionSection', type: 'toggle', label: 'Show Opinion Section', labelAr: 'إظهار قسم الرأي', default: true },
              { id: 'showPhotoGallery', type: 'toggle', label: 'Show Photo Gallery', labelAr: 'إظهار معرض الصور', default: true },
              { id: 'showPodcast', type: 'toggle', label: 'Show Podcast Section', labelAr: 'إظهار قسم البودكاست', default: true },
              { id: 'showNewsletter', type: 'toggle', label: 'Show Newsletter', labelAr: 'إظهار النشرة الإخبارية', default: true },
              { id: 'articlesPerSection', type: 'number', label: 'Articles per Section', labelAr: 'المقالات لكل قسم', default: 6, min: 3, max: 12 },
            ],
          },
          {
            id: 'article',
            title: 'Article Page',
            titleAr: 'صفحة المقال',
            icon: 'FileText',
            fields: [
              { id: 'showAuthor', type: 'toggle', label: 'Show Author', labelAr: 'إظهار الكاتب', default: true },
              { id: 'showDate', type: 'toggle', label: 'Show Date', labelAr: 'إظهار التاريخ', default: true },
              { id: 'showReadingTime', type: 'toggle', label: 'Show Reading Time', labelAr: 'إظهار وقت القراءة', default: true },
              { id: 'showShareButtons', type: 'toggle', label: 'Show Share Buttons', labelAr: 'إظهار أزرار المشاركة', default: true },
              { id: 'showRelatedArticles', type: 'toggle', label: 'Show Related Articles', labelAr: 'إظهار مقالات ذات صلة', default: true },
              { id: 'relatedArticlesCount', type: 'number', label: 'Related Articles Count', labelAr: 'عدد المقالات ذات الصلة', default: 4, min: 2, max: 8 },
            ],
          },
          {
            id: 'footer',
            title: 'Footer',
            titleAr: 'التذييل',
            icon: 'PanelBottom',
            fields: [
              { id: 'footerColumns', type: 'select', label: 'Footer Columns', labelAr: 'أعمدة التذييل', default: '4', options: [{ value: '2', label: '2 Columns' }, { value: '3', label: '3 Columns' }, { value: '4', label: '4 Columns' }] },
              { id: 'showSocialLinks', type: 'toggle', label: 'Show Social Links', labelAr: 'إظهار روابط التواصل', default: true },
              { id: 'showFooterNewsletter', type: 'toggle', label: 'Show Newsletter', labelAr: 'إظهار نموذج النشرة', default: true },
              { id: 'copyrightText', type: 'text', label: 'Copyright Text', labelAr: 'نص حقوق النشر', default: '© 2024 NewsCore. جميع الحقوق محفوظة.' },
            ],
          },
          {
            id: 'darkMode',
            title: 'Dark Mode',
            titleAr: 'الوضع الداكن',
            icon: 'Moon',
            fields: [
              { id: 'darkModeEnabled', type: 'toggle', label: 'Enable Dark Mode', labelAr: 'تفعيل الوضع الداكن', default: true },
              { id: 'darkPrimaryColor', type: 'color', label: 'Primary Color (Dark)', labelAr: 'اللون الأساسي (داكن)', default: '#f59e0b' },
              { id: 'darkBackgroundColor', type: 'color', label: 'Background Color (Dark)', labelAr: 'لون الخلفية (داكن)', default: '#111827' },
              { id: 'darkTextColor', type: 'color', label: 'Text Color (Dark)', labelAr: 'لون النص (داكن)', default: '#f9fafb' },
            ],
          },
          {
            id: 'floatingElements',
            title: 'Floating Elements',
            titleAr: 'العناصر العائمة',
            icon: 'Layers',
            fields: [
              { id: 'showBackToTop', type: 'toggle', label: 'Show Back to Top', labelAr: 'إظهار زر العودة للأعلى', default: true },
              { id: 'showChatWidget', type: 'toggle', label: 'Show Chat Widget', labelAr: 'إظهار نافذة الدردشة', default: false },
              { id: 'showCookieNotice', type: 'toggle', label: 'Show Cookie Notice', labelAr: 'إظهار إشعار الكوكيز', default: true },
            ],
          },
        ],
      },
      supportedLanguages: ['ar', 'en', 'fr'],
      defaultLanguage: 'ar',
      direction: 'rtl',
      minCoreVersion: '1.0.0',
    },
    features: [
      'articles', 'pages', 'categories', 'tags', 'menus', 'mega-menu', 'widgets',
      'breaking-news', 'search', 'dark-mode', 'rtl', 'multi-language', 'seo-optimized',
      'responsive', 'video-section', 'podcast-section', 'live-streaming', 'photo-gallery',
      'opinion-section', 'newsletter', 'social-hub', 'weather-widget', 'currency-ticker',
      'mobile-app-promo', 'floating-elements', 'accessibility'
    ],
    isActive: true,
    isDefault: true,
    isSystem: false,
    path: '/themes/newscore',
    minCoreVersion: '1.0.0',
    requiredModules: [],
    defaultSettings: {
      // Identity
      siteName: 'NewsCore',
      siteTagline: 'أخبار موثوقة على مدار الساعة',
      // Colors
      primaryColor: '#ed7520',
      secondaryColor: '#0ea5e9',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      headerBackground: '#ffffff',
      footerBackground: '#1f2937',
      breakingNewsColor: '#dc2626',
      // Typography
      fontFamily: 'Cairo',
      headingFont: 'Cairo',
      fontSize: '16px',
      lineHeight: '1.7',
      // Layout
      containerWidth: '1280px',
      sidebarPosition: 'right',
      sidebarWidth: '320px',
      borderRadius: '0.5rem',
      cardShadow: 'medium',
      // Header
      headerStyle: 'default',
      stickyHeader: true,
      showTopBar: true,
      showSearch: true,
      showWeather: true,
      showCurrency: true,
      showDate: true,
      // Homepage
      heroLayout: 'classic',
      showBreakingNews: true,
      showVideoSection: true,
      showOpinionSection: true,
      showFeaturesSection: true,
      showPhotoGallery: true,
      showPodcast: true,
      showLive: true,
      showPartners: true,
      showSocialHub: true,
      showNewsletter: true,
      showApps: true,
      articlesPerSection: 6,
      categorySectionsCount: 4,
      // Article
      showAuthor: true,
      showReadingTime: true,
      showShareButtons: true,
      showRelatedArticles: true,
      relatedArticlesCount: 4,
      showTags: true,
      showCategories: true,
      showComments: true,
      showNextPrev: true,
      // Footer
      footerStyle: 'default',
      footerColumns: '4',
      showFooterLogo: true,
      showSocialLinks: true,
      showFooterNewsletter: true,
      copyrightText: '© 2024 NewsCore. جميع الحقوق محفوظة.',
      // Dark Mode
      darkModeEnabled: true,
      darkModeDefault: false,
      darkPrimaryColor: '#f59e0b',
      darkBackgroundColor: '#111827',
      darkSurfaceColor: '#1f2937',
      darkTextColor: '#f9fafb',
      // Floating Elements
      showBackToTop: true,
      showChatWidget: false,
      showCookieNotice: true,
      // Performance
      lazyLoadImages: true,
      enableAnimations: true,
      prefetchLinks: true,
    },
  };

  await prisma.theme.upsert({
    where: { slug: 'newscore' },
    update: newsCoreTheme,
    create: {
      ...newsCoreTheme,
      activatedAt: new Date(),
    },
  });

  console.log('NewsCore theme seeded successfully');
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
    await seedNewsCoreTheme();
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
