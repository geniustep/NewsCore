import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Permissions
  const permissions = [
    // Articles
    { name: 'articles.create', displayName: 'إنشاء مقال', module: 'articles', action: 'create' },
    { name: 'articles.read', displayName: 'قراءة المقالات', module: 'articles', action: 'read' },
    { name: 'articles.update', displayName: 'تحديث مقال', module: 'articles', action: 'update' },
    { name: 'articles.delete', displayName: 'حذف مقال', module: 'articles', action: 'delete' },
    { name: 'articles.publish', displayName: 'نشر مقال', module: 'articles', action: 'publish' },
    // Users
    { name: 'users.create', displayName: 'إنشاء مستخدم', module: 'users', action: 'create' },
    { name: 'users.read', displayName: 'قراءة المستخدمين', module: 'users', action: 'read' },
    { name: 'users.update', displayName: 'تحديث مستخدم', module: 'users', action: 'update' },
    { name: 'users.delete', displayName: 'حذف مستخدم', module: 'users', action: 'delete' },
    // Categories
    { name: 'categories.create', displayName: 'إنشاء تصنيف', module: 'categories', action: 'create' },
    { name: 'categories.update', displayName: 'تحديث تصنيف', module: 'categories', action: 'update' },
    { name: 'categories.delete', displayName: 'حذف تصنيف', module: 'categories', action: 'delete' },
    // Tags
    { name: 'tags.create', displayName: 'إنشاء وسم', module: 'tags', action: 'create' },
    { name: 'tags.update', displayName: 'تحديث وسم', module: 'tags', action: 'update' },
    { name: 'tags.delete', displayName: 'حذف وسم', module: 'tags', action: 'delete' },
    // Media
    { name: 'media.upload', displayName: 'رفع ملفات', module: 'media', action: 'upload' },
    { name: 'media.delete', displayName: 'حذف ملفات', module: 'media', action: 'delete' },
    // Settings
    { name: 'settings.read', displayName: 'قراءة الإعدادات', module: 'settings', action: 'read' },
    { name: 'settings.update', displayName: 'تحديث الإعدادات', module: 'settings', action: 'update' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  console.log('✅ Permissions created');

  // Create Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'super_admin' },
    update: {},
    create: {
      name: 'super_admin',
      displayName: 'مدير النظام',
      description: 'صلاحيات كاملة على النظام',
      isSystem: true,
      priority: 100,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      displayName: 'مدير',
      description: 'إدارة المحتوى والمستخدمين',
      isSystem: true,
      priority: 90,
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: 'editor' },
    update: {},
    create: {
      name: 'editor',
      displayName: 'محرر',
      description: 'تحرير ونشر المقالات',
      isSystem: true,
      priority: 50,
    },
  });

  const authorRole = await prisma.role.upsert({
    where: { name: 'author' },
    update: {},
    create: {
      name: 'author',
      displayName: 'كاتب',
      description: 'كتابة المقالات',
      isSystem: true,
      priority: 30,
    },
  });

  console.log('✅ Roles created');

  // Assign all permissions to super_admin
  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // Assign permissions to admin (all except settings)
  const adminPermissions = allPermissions.filter(
    (p) => p.module !== 'settings' || p.action === 'read',
  );
  for (const perm of adminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // Assign permissions to editor
  const editorPermissions = allPermissions.filter(
    (p) =>
      ['articles', 'categories', 'tags', 'media'].includes(p.module) &&
      p.action !== 'delete',
  );
  for (const perm of editorPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: editorRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: editorRole.id,
        permissionId: perm.id,
      },
    });
  }

  // Assign permissions to author
  const authorPermissions = allPermissions.filter(
    (p) =>
      (p.module === 'articles' && ['create', 'read', 'update'].includes(p.action)) ||
      (p.module === 'media' && p.action === 'upload'),
  );
  for (const perm of authorPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: authorRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: authorRole.id,
        permissionId: perm.id,
      },
    });
  }

  console.log('✅ Role permissions assigned');

  // Create Super Admin User
  const passwordHash = await bcrypt.hash('Admin@123456', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sahara2797.com' },
    update: {},
    create: {
      email: 'admin@sahara2797.com',
      passwordHash,
      firstName: 'مدير',
      lastName: 'النظام',
      displayName: 'مدير النظام',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: superAdminRole.id,
    },
  });

  console.log('✅ Admin user created');
  console.log('   Email: admin@sahara2797.com');
  console.log('   Password: Admin@123456');

  // Create Default Categories
  const categories = [
    { slug: 'politics', name: 'سياسة', nameAr: 'سياسة', nameEn: 'Politics', color: '#DC2626', icon: 'landmark' },
    { slug: 'economy', name: 'اقتصاد', nameAr: 'اقتصاد', nameEn: 'Economy', color: '#059669', icon: 'chart-line' },
    { slug: 'sports', name: 'رياضة', nameAr: 'رياضة', nameEn: 'Sports', color: '#2563EB', icon: 'futbol' },
    { slug: 'technology', name: 'تكنولوجيا', nameAr: 'تكنولوجيا', nameEn: 'Technology', color: '#7C3AED', icon: 'microchip' },
    { slug: 'culture', name: 'ثقافة', nameAr: 'ثقافة', nameEn: 'Culture', color: '#DB2777', icon: 'masks-theater' },
    { slug: 'health', name: 'صحة', nameAr: 'صحة', nameEn: 'Health', color: '#10B981', icon: 'heart-pulse' },
    { slug: 'world', name: 'دولي', nameAr: 'دولي', nameEn: 'World', color: '#6366F1', icon: 'globe' },
    { slug: 'local', name: 'محلي', nameAr: 'محلي', nameEn: 'Local', color: '#F59E0B', icon: 'map-marker' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        ...cat,
        isActive: true,
        sortOrder: categories.indexOf(cat),
      },
    });
  }

  console.log('✅ Default categories created');

  // Create Default Tags
  const tags = [
    { slug: 'breaking', name: 'عاجل', nameAr: 'عاجل', nameEn: 'Breaking', type: 'TOPIC' },
    { slug: 'exclusive', name: 'حصري', nameAr: 'حصري', nameEn: 'Exclusive', type: 'TOPIC' },
    { slug: 'analysis', name: 'تحليل', nameAr: 'تحليل', nameEn: 'Analysis', type: 'TOPIC' },
    { slug: 'interview', name: 'مقابلة', nameAr: 'مقابلة', nameEn: 'Interview', type: 'TOPIC' },
    { slug: 'opinion', name: 'رأي', nameAr: 'رأي', nameEn: 'Opinion', type: 'TOPIC' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag as any,
    });
  }

  console.log('✅ Default tags created');

  // Create Default Pages
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'الصفحة الرئيسية',
      content: '<h1>مرحباً بكم في موقعنا الإخباري</h1><p>أهلاً بكم في منصتنا الإخبارية المتميزة.</p>',
      status: 'PUBLISHED',
      language: 'ar',
      template: 'default',
      isHomepage: true,
      isSystem: true,
      authorId: adminUser.id,
      publishedAt: new Date(),
    },
  });

  await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      slug: 'about',
      title: 'من نحن',
      content: '<h1>من نحن</h1><p>نحن منصة إخبارية موثوقة تقدم أحدث الأخبار والتقارير.</p>',
      status: 'PUBLISHED',
      language: 'ar',
      template: 'default',
      isHomepage: false,
      isSystem: false,
      showInMenu: true,
      authorId: adminUser.id,
      publishedAt: new Date(),
    },
  });

  await prisma.page.upsert({
    where: { slug: 'contact' },
    update: {},
    create: {
      slug: 'contact',
      title: 'اتصل بنا',
      content: '<h1>اتصل بنا</h1><p>يمكنكم التواصل معنا عبر البريد الإلكتروني أو وسائل التواصل الاجتماعي.</p>',
      status: 'PUBLISHED',
      language: 'ar',
      template: 'contact',
      isHomepage: false,
      isSystem: false,
      showInMenu: true,
      authorId: adminUser.id,
      publishedAt: new Date(),
    },
  });

  await prisma.page.upsert({
    where: { slug: 'privacy-policy' },
    update: {},
    create: {
      slug: 'privacy-policy',
      title: 'سياسة الخصوصية',
      content: '<h1>سياسة الخصوصية</h1><p>نحن نحترم خصوصيتكم ونلتزم بحماية بياناتكم الشخصية.</p>',
      status: 'PUBLISHED',
      language: 'ar',
      template: 'default',
      isHomepage: false,
      isSystem: true,
      showInMenu: false,
      authorId: adminUser.id,
      publishedAt: new Date(),
    },
  });

  await prisma.page.upsert({
    where: { slug: 'terms-of-service' },
    update: {},
    create: {
      slug: 'terms-of-service',
      title: 'شروط الاستخدام',
      content: '<h1>شروط الاستخدام</h1><p>باستخدام هذا الموقع، فإنك توافق على الشروط والأحكام التالية.</p>',
      status: 'PUBLISHED',
      language: 'ar',
      template: 'default',
      isHomepage: false,
      isSystem: true,
      showInMenu: false,
      authorId: adminUser.id,
      publishedAt: new Date(),
    },
  });

  console.log('✅ Default pages created');

  // Create Default Menu
  const mainMenu = await prisma.menu.upsert({
    where: { slug: 'main-menu' },
    update: {},
    create: {
      slug: 'main-menu',
      name: 'القائمة الرئيسية',
      description: 'القائمة الرئيسية للموقع',
      isActive: true,
      isSystem: true,
      createdById: adminUser.id,
    },
  });

  // Fetch categories for menu items
  const allCategories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  // Create menu items for categories
  let sortOrder = 0;
  for (const category of allCategories) {
    // Check if menu item for this category already exists
    const existingItem = await prisma.menuItem.findFirst({
      where: {
        menuId: mainMenu.id,
        categoryId: category.id,
      },
    });
    
    if (!existingItem) {
      await prisma.menuItem.create({
        data: {
          menuId: mainMenu.id,
          label: category.nameAr || category.name,
          labelAr: category.nameAr,
          labelEn: category.nameEn,
          type: 'CATEGORY',
          categoryId: category.id,
          sortOrder: sortOrder,
          isActive: true,
          isVisible: true,
        },
      });
    }
    sortOrder++;
  }

  console.log('✅ Default menu created');

  // Create Footer Menu
  const footerMenu = await prisma.menu.upsert({
    where: { slug: 'footer-menu' },
    update: {},
    create: {
      slug: 'footer-menu',
      name: 'قائمة التذييل',
      description: 'قائمة روابط التذييل',
      isActive: true,
      isSystem: true,
      createdById: adminUser.id,
    },
  });

  // Add footer menu items
  const footerPages = await prisma.page.findMany({
    where: { showInMenu: true },
  });

  let footerSortOrder = 0;
  for (const page of footerPages) {
    await prisma.menuItem.create({
      data: {
        menuId: footerMenu.id,
        label: page.title,
        labelAr: page.title,
        type: 'PAGE',
        pageId: page.id,
        sortOrder: footerSortOrder++,
        isActive: true,
        isVisible: true,
      },
    });
  }

  console.log('✅ Footer menu created');

  console.log('\n🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

