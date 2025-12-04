# 📰 NewsCore - نظام إدارة المحتوى الإخباري

<div align="center">

![NewsCore Logo](https://img.shields.io/badge/NewsCore-CMS-blue?style=for-the-badge&logo=newspaper&logoColor=white)

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)

**نظام متكامل لإدارة المحتوى الإخباري مع لوحة تحكم حديثة ودعم كامل للغة العربية**

[العرض التجريبي](https://admin.sahara2797.com) • [التوثيق](https://admin.sahara2797.com/api/docs) • [الإبلاغ عن مشكلة](../../issues)

</div>

---

## 📋 المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المميزات](#-المميزات)
- [المتطلبات](#-المتطلبات)
- [التثبيت](#-التثبيت)
- [الإعداد](#-الإعداد)
- [التشغيل](#-التشغيل)
- [بنية المشروع](#-بنية-المشروع)
- [API Documentation](#-api-documentation)
- [قاعدة البيانات](#-قاعدة-البيانات)
- [النشر](#-النشر)
- [المساهمة](#-المساهمة)

---

## 🌟 نظرة عامة

**NewsCore** هو نظام إدارة محتوى إخباري متكامل مبني بأحدث التقنيات. يوفر:

- 🖥️ **Backend API** مبني بـ NestJS مع TypeScript
- 🎨 **لوحة تحكم** حديثة مبنية بـ React + Vite + TailwindCSS
- 🗄️ **قاعدة بيانات** PostgreSQL مع Prisma ORM
- 🔐 **نظام مصادقة** متكامل مع JWT
- 🌐 **دعم كامل للغة العربية** مع واجهة RTL

---

## ✨ المميزات

### 🔐 المصادقة والأمان
- تسجيل دخول آمن مع JWT (Access + Refresh Tokens)
- نظام صلاحيات متقدم (RBAC)
- تشفير كلمات المرور بـ bcrypt
- حماية من هجمات CSRF و XSS
- Rate Limiting للحماية من هجمات DDoS

### 📝 إدارة المقالات
- إنشاء وتحرير المقالات مع محرر WYSIWYG
- دعم الحالات المتعددة (مسودة، منشور، مؤرشف)
- جدولة النشر
- تصنيفات ووسوم متعددة
- SEO محسّن (عنوان، وصف، صورة مميزة)
- توليد تلقائي للـ Slug

### 📁 إدارة الوسائط
- رفع الصور والملفات
- تنظيم الملفات في مجلدات
- معاينة الصور
- دعم أنواع متعددة من الملفات

### 👥 إدارة المستخدمين
- إنشاء وإدارة المستخدمين
- أدوار متعددة (مدير، محرر، كاتب)
- ملفات شخصية للمستخدمين

### 🏷️ التصنيفات والوسوم
- تصنيفات هرمية
- وسوم مرنة
- ربط المقالات بتصنيفات ووسوم متعددة

### 🎯 نظام إدارة القوائم الاحترافي
- **قوائم متعددة مستقلة**: إنشاء عدد غير محدود من القوائم (Header, Footer, Sidebar, Mobile, Mega Menu)
- **Menu Locations**: التحكم في أماكن ظهور القوائم (Header, Footer-1/2/3/4, Sidebar, Mobile)
- **أنواع عناصر متعددة**: Link, Category, Tag, Article, Page, Custom URL, Divider, Heading
- **Mega Menu Builder**: نظام احترافي لبناء قوائم ميجا مع Grid Layout (2/3/4 columns)
- **قوائم متداخلة**: دعم قوائم منسدلة متعددة المستويات
- **إضافة أيقونات وصور**: لكل عنصر في القائمة
- **إدارة مرئية**: تفعيل/تعطيل عناصر بدون حذفها
- **سحب وإفلات**: إعادة ترتيب العناصر (قريباً)
- **دعم متعدد اللغات**: ترجمة تلقائية لكل عنصر (ar, en, fr)
- **Conditional Display**: عرض مشروط حسب الجهاز، اللغة، أو حالة المستخدم
- **Dynamic Menus**: قوائم ديناميكية (أحدث الأقسام، وسوم نشطة)
- **SEO Friendly**: HTML5 nav، روابط نظيفة، Schema.org
- **Import/Export**: استيراد وتصدير القوائم بصيغة JSON

### 📊 لوحة التحكم
- إحصائيات شاملة
- واجهة حديثة وسهلة الاستخدام
- دعم كامل للغة العربية (RTL)
- تصميم متجاوب لجميع الأجهزة

### 🌐 الواجهة الأمامية (Frontend)
- **Next.js 14** مع App Router
- **دعم متعدد اللغات**: next-intl (ar, en, fr)
- **تصميم متجاوب**: TailwindCSS مع RTL support
- **قوائم ديناميكية**: تكامل كامل مع نظام إدارة القوائم
- **SSR/SSG**: Server-Side Rendering و Static Site Generation

---

## 📦 المتطلبات

### للتطوير المحلي
- **Node.js** >= 20.x
- **npm** >= 10.x
- **PostgreSQL** >= 16
- **Redis** >= 7 (اختياري للـ caching)

### للنشر بـ Docker
- **Docker** >= 24.x
- **Docker Compose** >= 2.x

---

## 🚀 التثبيت

### 1. استنساخ المشروع

```bash
git clone https://github.com/your-org/NewsCore.git
cd NewsCore
```

### 2. تثبيت التبعيات

```bash
# Backend
npm install

# Admin Dashboard
cd NewsCore-admin && npm install && cd ..

# Frontend
cd NewsCore-frontend && npm install && cd ..
```

### 3. إعداد متغيرات البيئة

```bash
cp .env.example .env
```

قم بتعديل `.env` حسب إعداداتك:

```env
# Database
DATABASE_URL=postgresql://newscore:newscore123@localhost:5432/newscoredb?schema=public

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Redis (اختياري)
REDIS_HOST=localhost
REDIS_PORT=6379

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. إعداد قاعدة البيانات

```bash
# إنشاء الترحيلات
npx prisma migrate dev --name init

# تشغيل البيانات الأولية
npx ts-node prisma/seed.ts
```

---

## ⚙️ الإعداد

### متغيرات البيئة

| المتغير | الوصف | القيمة الافتراضية |
|---------|-------|-------------------|
| `NODE_ENV` | بيئة التشغيل | `development` |
| `PORT` | منفذ الخادم | `3000` |
| `DATABASE_URL` | رابط اتصال PostgreSQL | - |
| `JWT_SECRET` | مفتاح تشفير JWT | - |
| `JWT_ACCESS_EXPIRATION` | مدة صلاحية Access Token | `15m` |
| `JWT_REFRESH_EXPIRATION` | مدة صلاحية Refresh Token | `7d` |
| `REDIS_HOST` | خادم Redis | `localhost` |
| `REDIS_PORT` | منفذ Redis | `6379` |
| `CORS_ORIGINS` | النطاقات المسموحة | `*` |

---

## 🏃 التشغيل

### التطوير المحلي

```bash
# تشغيل Backend
npm run start:dev

# تشغيل Admin Dashboard (في terminal آخر)
cd NewsCore-admin && npm run dev

# تشغيل Frontend (في terminal آخر)
cd NewsCore-frontend && npm run dev
```

### الوصول للتطبيق

| الخدمة | الرابط |
|--------|--------|
| لوحة التحكم (Admin) | http://localhost:5173 |
| الواجهة الأمامية (Frontend) | http://localhost:3000 |
| API | http://localhost:3000/api/v1 |
| توثيق API | http://localhost:3000/api/docs |
| Health Check | http://localhost:3000/health |

### باستخدام Docker Compose

```bash
# بناء وتشغيل جميع الخدمات
docker-compose up -d --build

# عرض السجلات
docker-compose logs -f

# إيقاف الخدمات
docker-compose down
```


### بيانات الدخول الافتراضية

```
البريد الإلكتروني: admin@sahara2797.com
كلمة المرور: Admin@123456
```

---

## 📁 بنية المشروع

```
NewsCore/
├── 📂 NewsCore-admin/            # لوحة التحكم (React + Vite)
│   ├── 📂 src/
│   │   ├── 📂 components/       # المكونات المشتركة
│   │   ├── 📂 pages/            # صفحات التطبيق (Articles, Categories, Menus, etc.)
│   │   ├── 📂 lib/              # المكتبات والأدوات (API client)
│   │   ├── 📂 store/            # إدارة الحالة (Zustand)
│   │   ├── 📄 App.tsx           # المكون الرئيسي
│   │   └── 📄 main.tsx          # نقطة الدخول
│   ├── 📄 package.json
│   ├── 📄 vite.config.ts
│   └── 📄 tailwind.config.js
│
├── 📂 NewsCore-frontend/        # الواجهة الأمامية (Next.js 14)
│   ├── 📂 app/                   # App Router
│   │   ├── 📂 [locale]/         # صفحات متعددة اللغات
│   │   │   ├── 📂 article/      # صفحات المقالات
│   │   │   ├── 📂 category/     # صفحات التصنيفات
│   │   │   └── 📄 page.tsx      # الصفحة الرئيسية
│   │   └── 📄 layout.tsx         # Root Layout
│   ├── 📂 components/           # المكونات
│   │   ├── 📂 layout/           # Header, Footer
│   │   └── 📂 menus/            # MenuRenderer, MegaMenu
│   ├── 📂 lib/                  # المكتبات
│   │   └── 📂 api/              # API clients
│   ├── 📂 public/               # الملفات الثابتة
│   ├── 📄 package.json
│   └── 📄 next.config.mjs
│
├── 📂 src/                      # Backend API (NestJS)
│   ├── 📂 common/               # الأدوات المشتركة
│   │   ├── 📂 decorators/       # الديكوراتورز المخصصة
│   │   ├── 📂 dto/              # DTOs المشتركة
│   │   ├── 📂 filters/          # Exception Filters
│   │   ├── 📂 guards/           # Guards
│   │   └── 📂 interceptors/     # Interceptors
│   │
│   ├── 📂 config/               # إعدادات التطبيق
│   │   ├── 📄 configuration.ts
│   │   └── 📄 validation.schema.ts
│   │
│   ├── 📂 database/             # طبقة قاعدة البيانات
│   │   ├── 📄 database.module.ts
│   │   └── 📄 prisma.service.ts
│   │
│   ├── 📂 health/               # Health Check
│   │   ├── 📄 health.module.ts
│   │   └── 📄 health.controller.ts
│   │
│   ├── 📂 modules/              # الوحدات الرئيسية
│   │   ├── 📂 auth/             # المصادقة
│   │   │   ├── 📂 dto/
│   │   │   ├── 📂 guards/
│   │   │   ├── 📂 strategies/
│   │   │   ├── 📄 auth.module.ts
│   │   │   ├── 📄 auth.controller.ts
│   │   │   └── 📄 auth.service.ts
│   │   │
│   │   ├── 📂 users/            # المستخدمين
│   │   ├── 📂 articles/         # المقالات
│   │   ├── 📂 categories/       # التصنيفات
│   │   ├── 📂 tags/             # الوسوم
│   │   ├── 📂 media/            # الوسائط
│   │   └── 📂 menus/            # إدارة القوائم
│   │       ├── 📂 dto/          # Data Transfer Objects
│   │       ├── 📄 menus.module.ts
│   │       ├── 📄 menus.controller.ts
│   │       └── 📄 menus.service.ts
│   │
│   ├── 📄 app.module.ts         # الوحدة الرئيسية
│   ├── 📄 app.controller.ts
│   └── 📄 main.ts               # نقطة الدخول
│
├── 📂 prisma/                   # Prisma ORM
│   ├── 📄 schema.prisma         # مخطط قاعدة البيانات
│   ├── 📄 seed.ts               # البيانات الأولية
│   └── 📂 migrations/           # ترحيلات قاعدة البيانات
│
├── 📄 docker-compose.yml        # Docker Compose
├── 📄 Dockerfile                # Backend Dockerfile
├── 📄 package.json
├── 📄 tsconfig.json
└── 📄 README.md
```

---

## 📚 API Documentation

### نقاط النهاية الرئيسية

#### 🔐 المصادقة (`/api/v1/auth`)

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `POST` | `/login` | تسجيل الدخول |
| `POST` | `/register` | إنشاء حساب جديد |
| `POST` | `/refresh` | تجديد الـ Token |
| `POST` | `/logout` | تسجيل الخروج |
| `GET` | `/profile` | الملف الشخصي |

#### 📝 المقالات (`/api/v1/articles`)

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/` | قائمة المقالات |
| `GET` | `/public` | المقالات المنشورة (عام) |
| `GET` | `/:id` | مقال محدد |
| `GET` | `/slug/:slug` | مقال بالـ Slug |
| `POST` | `/` | إنشاء مقال |
| `PATCH` | `/:id` | تحديث مقال |
| `POST` | `/:id/publish` | نشر مقال |
| `POST` | `/:id/archive` | أرشفة مقال |
| `DELETE` | `/:id` | حذف مقال |

#### 📁 التصنيفات (`/api/v1/categories`)

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/` | قائمة التصنيفات |
| `GET` | `/:id` | تصنيف محدد |
| `POST` | `/` | إنشاء تصنيف |
| `PATCH` | `/:id` | تحديث تصنيف |
| `DELETE` | `/:id` | حذف تصنيف |

#### 🏷️ الوسوم (`/api/v1/tags`)

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/` | قائمة الوسوم |
| `GET` | `/:id` | وسم محدد |
| `POST` | `/` | إنشاء وسم |
| `PATCH` | `/:id` | تحديث وسم |
| `DELETE` | `/:id` | حذف وسم |

#### 🖼️ الوسائط (`/api/v1/media`)

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/` | قائمة الملفات |
| `GET` | `/:id` | ملف محدد |
| `POST` | `/upload` | رفع ملف |
| `POST` | `/folders` | إنشاء مجلد |
| `DELETE` | `/:id` | حذف ملف |

#### 👥 المستخدمين (`/api/v1/users`)

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/` | قائمة المستخدمين |
| `GET` | `/:id` | مستخدم محدد |
| `POST` | `/` | إنشاء مستخدم |
| `PATCH` | `/:id` | تحديث مستخدم |
| `DELETE` | `/:id` | حذف مستخدم |

#### 🎯 القوائم (`/api/v1/menus`)

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/` | قائمة جميع القوائم |
| `GET` | `/public` | القوائم العامة (بدون مصادقة) |
| `GET` | `/location/:location` | قائمة حسب الموقع (header, footer-1, etc.) |
| `GET` | `/slug/:slug` | قائمة حسب الـ slug |
| `GET` | `/:id` | قائمة محددة |
| `POST` | `/` | إنشاء قائمة جديدة |
| `PATCH` | `/:id` | تحديث قائمة |
| `DELETE` | `/:id` | حذف قائمة |
| `POST` | `/:menuId/items` | إضافة عنصر للقائمة |
| `PATCH` | `/items/:id` | تحديث عنصر |
| `DELETE` | `/items/:id` | حذف عنصر |
| `POST` | `/:menuId/items/reorder` | إعادة ترتيب العناصر |
| `POST` | `/:menuId/locations` | تعيين موقع للقائمة |
| `DELETE` | `/:menuId/locations/:location` | إزالة موقع من القائمة |
| `GET` | `/dynamic/:type` | قوائم ديناميكية (categories, tags, etc.) |

### مثال على الاستخدام

```bash
# تسجيل الدخول
curl -X POST https://admin.sahara2797.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sahara2797.com","password":"Admin@123456"}'

# جلب المقالات (مع التوثيق)
curl https://admin.sahara2797.com/api/v1/articles \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# إنشاء مقال جديد
curl -X POST https://admin.sahara2797.com/api/v1/articles \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "عنوان المقال",
    "content": "محتوى المقال...",
    "status": "DRAFT",
    "categoryIds": ["category-uuid"],
    "tagIds": ["tag-uuid"]
  }'

# جلب قائمة حسب الموقع (عام - بدون مصادقة)
curl https://admin.sahara2797.com/api/v1/menus/location/header?language=ar

# إنشاء قائمة جديدة
curl -X POST https://admin.sahara2797.com/api/v1/menus \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "القائمة الرئيسية",
    "slug": "main-menu",
    "description": "قائمة التنقل الرئيسية"
  }'

# إضافة عنصر للقائمة
curl -X POST https://admin.sahara2797.com/api/v1/menus/{menuId}/items \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "الرئيسية",
    "labelAr": "الرئيسية",
    "labelEn": "Home",
    "type": "CUSTOM",
    "url": "/",
    "icon": "🏠",
    "sortOrder": 0
  }'

# تعيين موقع للقائمة
curl -X POST https://admin.sahara2797.com/api/v1/menus/{menuId}/locations \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "header",
    "priority": 0
  }'
```

---

## 🗄️ قاعدة البيانات

### المخطط الرئيسي

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────<│   Article   │>────│  Category   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Role     │     │    Tag      │     │   Media     │
└─────────────┘     └─────────────┘     └─────────────┘
```

### الجداول الرئيسية

| الجدول | الوصف |
|--------|-------|
| `users` | المستخدمين |
| `roles` | الأدوار |
| `permissions` | الصلاحيات |
| `articles` | المقالات |
| `categories` | التصنيفات |
| `tags` | الوسوم |
| `media` | الوسائط |
| `media_folders` | مجلدات الوسائط |
| `menus` | القوائم |
| `menu_items` | عناصر القوائم |
| `menu_locations` | مواقع القوائم |
| `menu_revisions` | نسخ القوائم (History) |

### أوامر Prisma المفيدة

```bash
# عرض قاعدة البيانات في المتصفح
npx prisma studio

# إنشاء ترحيل جديد
npx prisma migrate dev --name migration_name

# تطبيق الترحيلات
npx prisma migrate deploy

# إعادة توليد Prisma Client
npx prisma generate

# إعادة تعيين قاعدة البيانات
npx prisma migrate reset
```

---

## 🚢 النشر

### النشر بـ Docker Compose

```bash
# بناء الصور
docker-compose build

# تشغيل في الخلفية
docker-compose up -d

# تطبيق ترحيلات قاعدة البيانات
docker exec newscore-api npx prisma migrate deploy

# تشغيل البيانات الأولية
docker exec newscore-api npx ts-node prisma/seed.ts
```

### النشر على Vercel (Frontend & Admin)

#### Frontend (Next.js)
1. اربط المستودع مع Vercel
2. اضبط Environment Variables:
   - `NEXT_PUBLIC_API_URL`: رابط API (مثال: `https://admin.sahara2797.com/api/v1`)
3. Vercel سيقوم بالبناء والنشر تلقائياً

#### Admin Panel (Vite)
1. اربط المستودع مع Vercel
2. اضبط Environment Variables:
   - `VITE_API_URL`: رابط API (مثال: `https://admin.sahara2797.com/api/v1`)
3. اضبط Build Command: `npm run build`
4. اضبط Output Directory: `dist`

### النشر مع Traefik

المشروع مُعد للعمل مع Traefik كـ reverse proxy. تأكد من:

1. وجود شبكة `routy-traefik_web` خارجية
2. إعداد DNS للنطاق المطلوب
3. تفعيل SSL عبر Let's Encrypt

```yaml
# Labels في docker-compose.yml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.newscore-admin.rule=Host(`admin.example.com`)"
  - "traefik.http.routers.newscore-admin.tls.certresolver=lehttp"
```

---

## 🧪 الاختبارات

```bash
# تشغيل الاختبارات
npm run test

# تشغيل الاختبارات مع التغطية
npm run test:cov

# اختبارات E2E
npm run test:e2e
```

---

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

---

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

## 📖 دليل استخدام نظام القوائم

### إنشاء قائمة جديدة

1. انتقل إلى **القوائم** في لوحة التحكم
2. اضغط على **إضافة قائمة جديدة**
3. املأ البيانات:
   - **الاسم**: اسم القائمة (مثال: "القائمة الرئيسية")
   - **Slug**: معرف فريد (مثال: "main-menu")
   - **الوصف**: وصف اختياري
4. احفظ القائمة

### إضافة عناصر للقائمة

1. اختر القائمة من القائمة
2. اضغط على **إضافة عنصر**
3. اختر نوع العنصر:
   - **CUSTOM**: رابط مخصص
   - **CATEGORY**: رابط لتصنيف
   - **TAG**: رابط لوسم
   - **ARTICLE**: رابط لمقال
   - **DIVIDER**: فاصل
   - **HEADING**: عنوان
4. املأ البيانات (Label, URL, Icon, etc.)
5. احفظ العنصر

### تعيين موقع للقائمة

1. اختر القائمة
2. في قسم **Menu Locations**، اضغط **إضافة موقع**
3. اختر الموقع:
   - `header`: القائمة الرئيسية في الهيدر
   - `footer-1`, `footer-2`, `footer-3`, `footer-4`: قوائم الفوتر
   - `sidebar`: القائمة الجانبية
   - `mobile`: قائمة الموبايل
4. اضبط الأولوية (Priority)
5. احفظ

### إنشاء Mega Menu

1. أنشئ عنصر قائمة عادي
2. فعّل **Mega Menu**
3. اختر Layout (Grid 2/3/4 columns)
4. أضف عناصر فرعية للعنصر
5. كل عنصر فرعي سيظهر في عمود من الميجا مينيو

### استخدام القوائم في Frontend

القوائم تُجلب تلقائياً في `Header` و `Footer` حسب الموقع:

```typescript
// في Header.tsx
const headerMenu = await menusApi.getByLocation('header', locale);

// في Footer.tsx
const footerMenu = await menusApi.getByLocation('footer-1', locale);
```

---

## 📞 الدعم

- 📧 البريد الإلكتروني: support@sahara2797.com
- 🐛 الإبلاغ عن مشاكل: [GitHub Issues](../../issues)
- 📖 التوثيق: [API Docs](https://admin.sahara2797.com/api/docs)

---

<div align="center">

**صُنع بـ ❤️ للمجتمع العربي**

</div>
