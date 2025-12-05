# 🚀 نظام NewsCore المتقدم

## 📋 نظرة عامة

تم تحويل NewsCore من نظام CMS ثابت إلى **منصة قابلة للتوسعة** مثل WordPress ولكن بتقنيات حديثة (NestJS, Next.js, TypeScript).

---

## 🏗️ البنية الجديدة

```
NewsCore/
├── src/
│   ├── core/                      # النظام الأساسي
│   │   ├── themes/                # نظام القوالب
│   │   ├── modules/               # نظام الوحدات
│   │   ├── i18n/                  # نظام الترجمة
│   │   ├── hooks/                 # نظام الأحداث
│   │   └── widgets/               # نظام الودجات
│   │
│   └── modules/                   # وحدات الميزات
│
├── NewsCore-admin/
│   └── src/pages/
│       ├── ThemeManager.tsx       # إدارة القوالب
│       ├── ModuleManager.tsx      # إدارة الوحدات
│       └── TranslationManager.tsx # إدارة الترجمات
│
└── NewsCore-frontend/
    ├── core/                      # محرك القوالب
    └── themes/                    # القوالب المثبتة
```

---

## 1️⃣ نظام القوالب (Themes System)

### الميزات
- ✅ تثبيت وحذف القوالب
- ✅ تفعيل قالب واحد فقط
- ✅ تخصيص إعدادات القالب (Customizer)
- ✅ معاينة التغييرات
- ✅ استيراد/تصدير الإعدادات
- ✅ دعم القوالب المتعددة

### API Endpoints

```typescript
GET    /api/v1/themes              // قائمة القوالب
GET    /api/v1/themes/active       // القالب النشط
GET    /api/v1/themes/:slug        // تفاصيل قالب
GET    /api/v1/themes/:slug/settings  // إعدادات القالب
POST   /api/v1/themes              // تثبيت قالب
POST   /api/v1/themes/:slug/activate  // تفعيل قالب
PUT    /api/v1/themes/:slug/settings  // تحديث الإعدادات
DELETE /api/v1/themes/:slug        // حذف قالب
```

### بنية القالب

```
themes/my-theme/
├── theme.json                     # ملف التعريف
├── preview.png                    # صورة المعاينة
├── templates/
│   ├── home.tsx
│   ├── article.tsx
│   └── category.tsx
├── components/
│   ├── Header.tsx
│   └── Footer.tsx
└── styles/
    └── main.css
```

### theme.json

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "version": "1.0.0",
  "author": "Your Name",
  "features": ["articles", "dark-mode", "rtl"],
  "templates": [
    {
      "id": "home",
      "name": "Home Page",
      "type": "home",
      "isDefault": true
    }
  ],
  "customizer": {
    "sections": [
      {
        "id": "colors",
        "title": "الألوان",
        "fields": [
          {
            "id": "primaryColor",
            "type": "color",
            "label": "اللون الأساسي",
            "default": "#3b82f6"
          }
        ]
      }
    ]
  }
}
```

---

## 2️⃣ نظام الوحدات (Modules System)

### الميزات
- ✅ تثبيت/حذف الوحدات
- ✅ تفعيل/تعطيل الوحدات
- ✅ إدارة التبعيات
- ✅ نظام الصلاحيات
- ✅ إعدادات لكل وحدة
- ✅ نظام الـ Hooks

### أنواع الوحدات

| النوع | الوصف |
|-------|-------|
| `CORE` | وحدات أساسية لا يمكن حذفها |
| `EXTENSION` | إضافات للميزات |
| `WIDGET` | ودجات للواجهة |
| `INTEGRATION` | تكامل مع خدمات خارجية |

### API Endpoints

```typescript
GET    /api/v1/modules             // قائمة الوحدات
GET    /api/v1/modules/loaded      // الوحدات المحملة
GET    /api/v1/modules/:slug       // تفاصيل وحدة
POST   /api/v1/modules             // تثبيت وحدة
POST   /api/v1/modules/:slug/enable   // تفعيل
POST   /api/v1/modules/:slug/disable  // تعطيل
PUT    /api/v1/modules/:slug/settings // تحديث الإعدادات
DELETE /api/v1/modules/:slug       // حذف وحدة
```

### بنية الوحدة

```
modules/my-module/
├── module.json                    # ملف التعريف
├── backend/
│   ├── my-module.module.ts
│   ├── my-module.service.ts
│   └── my-module.controller.ts
├── admin/
│   └── MyModulePage.tsx
└── frontend/
    └── MyModuleComponent.tsx
```

### module.json

```json
{
  "id": "my-module",
  "name": "My Module",
  "version": "1.0.0",
  "type": "EXTENSION",
  "dependencies": ["articles"],
  "provides": {
    "routes": ["/api/v1/my-module"],
    "adminPages": [
      {
        "path": "/my-module",
        "title": "وحدتي",
        "icon": "📦"
      }
    ],
    "permissions": [
      {
        "name": "my-module.manage",
        "displayName": "إدارة وحدتي"
      }
    ]
  },
  "settings": [
    {
      "key": "apiKey",
      "type": "password",
      "label": "مفتاح API",
      "isSecret": true
    }
  ],
  "hooks": [
    {
      "name": "article.afterPublish",
      "handler": "onArticlePublished",
      "priority": 10
    }
  ]
}
```

---

## 3️⃣ نظام الترجمة (i18n System)

### الميزات
- ✅ إدارة اللغات (إضافة/حذف/تعديل)
- ✅ نظام النطاقات (Namespaces)
- ✅ إدارة مفاتيح الترجمة
- ✅ استيراد/تصدير (JSON, CSV, PO)
- ✅ ترجمة تلقائية بـ AI
- ✅ إحصائيات الاكتمال
- ✅ مراجعة الترجمات

### API Endpoints

```typescript
// Languages
GET    /api/v1/i18n/languages
POST   /api/v1/i18n/languages
PUT    /api/v1/i18n/languages/:code
DELETE /api/v1/i18n/languages/:code

// Namespaces
GET    /api/v1/i18n/namespaces
POST   /api/v1/i18n/namespaces
GET    /api/v1/i18n/namespaces/:name/stats

// Translations
GET    /api/v1/i18n/translations
POST   /api/v1/i18n/translations
POST   /api/v1/i18n/translations/bulk
PUT    /api/v1/i18n/translations/:namespace/:key/:language
DELETE /api/v1/i18n/translations/:namespace/:key/:language

// Bundles
GET    /api/v1/i18n/translations/:namespace/:language
GET    /api/v1/i18n/translations/all/:language

// Import/Export
POST   /api/v1/i18n/import
POST   /api/v1/i18n/export
```

### النطاقات الافتراضية

| النطاق | الوصف |
|--------|-------|
| `common` | ترجمات عامة مشتركة |
| `admin` | لوحة التحكم |
| `frontend` | الواجهة الأمامية |
| `articles` | المقالات |
| `errors` | رسائل الأخطاء |
| `validations` | رسائل التحقق |

---

## 4️⃣ نظام الـ Hooks (Events)

### الميزات
- ✅ تسجيل الأحداث
- ✅ الاستماع للأحداث من الوحدات
- ✅ نظام الأولويات
- ✅ Filters (تعديل البيانات)
- ✅ Actions (تنفيذ إجراءات)

### الأحداث المتاحة

```typescript
// Article Hooks
'article.beforeCreate'
'article.afterCreate'
'article.beforeUpdate'
'article.afterUpdate'
'article.beforeDelete'
'article.afterDelete'
'article.beforePublish'
'article.afterPublish'

// User Hooks
'user.beforeLogin'
'user.afterLogin'
'user.afterRegister'

// Media Hooks
'media.beforeUpload'
'media.afterUpload'

// System Hooks
'system.init'
'cron.daily'
'cron.hourly'
```

### استخدام الـ Hooks

```typescript
// في الـ Service
import { HooksService } from '@/core/hooks/hooks.service';

@Injectable()
export class ArticlesService {
  constructor(private hooks: HooksService) {}

  async create(data: CreateArticleDto) {
    // Execute filter hook (can modify data)
    data = await this.hooks.executeFilter('article.beforeCreate', data);

    const article = await this.prisma.article.create({ data });

    // Execute action hook (no return)
    await this.hooks.executeAction('article.afterCreate', article);

    return article;
  }
}
```

---

## 5️⃣ نظام الودجات (Widgets)

### الميزات
- ✅ إنشاء/تعديل/حذف الودجات
- ✅ ترتيب بالسحب والإفلات
- ✅ مناطق متعددة (Regions)
- ✅ شروط العرض
- ✅ التخزين المؤقت

### API Endpoints

```typescript
GET    /api/v1/widgets
GET    /api/v1/widgets/types
GET    /api/v1/widgets/regions
GET    /api/v1/widgets/region/:region
POST   /api/v1/widgets
PUT    /api/v1/widgets/:slug
POST   /api/v1/widgets/:slug/toggle
POST   /api/v1/widgets/reorder
DELETE /api/v1/widgets/:slug
```

### أنواع الودجات

- `html` - محتوى HTML مخصص
- `articles` - قائمة مقالات
- `categories` - قائمة التصنيفات
- `tags` - سحابة الوسوم
- `newsletter` - نموذج الاشتراك
- `social` - روابط التواصل
- `search` - مربع البحث
- `weather` - حالة الطقس
- `banner` - إعلانات

### المناطق الافتراضية

- `header` - الترويسة
- `sidebar-right` - الشريط الجانبي الأيمن
- `sidebar-left` - الشريط الجانبي الأيسر
- `content-top` - فوق المحتوى
- `content-bottom` - تحت المحتوى
- `footer` - التذييل
- `footer-widgets` - ودجات التذييل

---

## 📊 جدول قاعدة البيانات الجديد

### الجداول المضافة

| الجدول | الوصف |
|--------|-------|
| `themes` | القوالب المثبتة |
| `theme_settings` | إعدادات القوالب |
| `modules` | الوحدات المثبتة |
| `module_settings` | إعدادات الوحدات |
| `languages` | اللغات |
| `translation_namespaces` | نطاقات الترجمة |
| `translation_keys` | مفاتيح الترجمة |
| `widgets` | الودجات |
| `hooks` | الأحداث |
| `hook_listeners` | مستمعي الأحداث |
| `breaking_news` | الأخبار العاجلة (محسّن) |

---

## 🚀 البدء السريع

### 1. تحديث قاعدة البيانات

```bash
# إنشاء migration جديد
npm run prisma:migrate

# تشغيل seed للنظام الأساسي
npm run prisma:seed:core
```

### 2. تشغيل التطبيق

```bash
# Backend
npm run start:dev

# Admin Panel
cd NewsCore-admin && npm run dev

# Frontend
cd NewsCore-frontend && npm run dev
```

### 3. الوصول للإدارة

- القوالب: `/themes`
- الوحدات: `/modules`
- الترجمات: `/translations`

---

## 📁 الملفات المضافة

### Backend (`/src/core/`)

```
core/
├── themes/
│   ├── themes.module.ts
│   ├── themes.controller.ts
│   ├── themes.service.ts
│   ├── dto/index.ts
│   └── interfaces/theme.interface.ts
├── modules/
│   ├── modules.module.ts
│   ├── modules.controller.ts
│   ├── modules.service.ts
│   ├── dto/index.ts
│   └── interfaces/module.interface.ts
├── i18n/
│   ├── i18n.module.ts
│   ├── i18n.controller.ts
│   ├── i18n.service.ts
│   ├── dto/index.ts
│   └── interfaces/i18n.interface.ts
├── hooks/
│   ├── hooks.module.ts
│   ├── hooks.controller.ts
│   ├── hooks.service.ts
│   └── dto/index.ts
└── widgets/
    ├── widgets.module.ts
    ├── widgets.controller.ts
    ├── widgets.service.ts
    └── dto/index.ts
```

### Admin (`/src/pages/`)

```
pages/
├── ThemeManager.tsx
├── ModuleManager.tsx
└── TranslationManager.tsx
```

### Frontend (`/core/`)

```
core/
├── ThemeProvider.tsx
└── ThemeLoader.ts
```

---

## 🔄 مقارنة مع WordPress

| الميزة | WordPress | NewsCore |
|--------|-----------|----------|
| القوالب | ✅ | ✅ |
| الإضافات | ✅ | ✅ (Modules) |
| الترجمة | WPML/Polylang | ✅ Built-in |
| Hooks | Actions/Filters | ✅ |
| API | REST Plugin | ✅ Native |
| Type Safety | ❌ | ✅ TypeScript |
| الأداء | PHP | ✅ Node.js + SSR |
| Real-time | ❌ | ✅ WebSocket |

---

## 📝 ملاحظات

1. **الأمان**: جميع الإعدادات الحساسة (API keys) تُخزن مشفرة
2. **التخزين المؤقت**: نظام cache متقدم للترجمات والإعدادات
3. **التوسعة**: يمكن إضافة وحدات جديدة دون تعديل الكود الأساسي
4. **الترجمة**: دعم كامل لـ RTL و pluralization
5. **الأداء**: lazy loading للوحدات والقوالب

---

**تاريخ الإنشاء**: 2025-12-05  
**الإصدار**: 2.0  
**المطور**: NewsCore Team
