# نظام إدارة القوائم (Navigation Menus System)

## نظرة عامة

نظام إدارة قوائم احترافي وكامل يدعم جميع الميزات المطلوبة لإدارة قوائم التنقل في الموقع.

## الميزات الرئيسية

### ✅ 1. إنشاء عدة قوائم مستقلة
- يمكن إنشاء عدد غير محدود من القوائم
- كل قائمة مستقلة تماماً
- دعم القوائم النظامية والمخصصة

### ✅ 2. التحكم في أماكن الظهور
- **Header**: القائمة الرئيسية في الهيدر
- **Header Secondary**: قائمة ثانوية في الهيدر
- **Footer**: قائمة الفوتر الرئيسية
- **Footer-1, Footer-2, Footer-3, Footer-4**: أعمدة الفوتر
- **Sidebar Left/Right**: القوائم الجانبية
- **Mobile**: قائمة الموبايل
- **Topbar**: الشريط العلوي

### ✅ 3. أنواع عناصر القائمة
- **CUSTOM**: رابط مخصص
- **CATEGORY**: رابط إلى قسم
- **TAG**: رابط إلى وسم
- **ARTICLE**: رابط إلى مقال محدد
- **PAGE**: رابط إلى صفحة ثابتة
- **DIVIDER**: فاصل بصري
- **HEADING**: عنوان داخل الميجا مينيو
- **DYNAMIC**: محتوى ديناميكي (أحدث الأقسام، الوسوم الشائعة)

### ✅ 4. Mega Menu
- دعم كامل لـ Mega Menu
- تخطيطات متعددة: 2، 3، 4 أعمدة
- محتوى مخصص داخل الميجا
- عرض مقالات وأقسام داخل الميجا

### ✅ 5. القوائم متعددة المستويات
- دعم غير محدود للمستويات
- سحب وإفلات لإعادة الترتيب
- عرض هرمي واضح

### ✅ 6. دعم متعدد اللغات
- تسميات منفصلة لكل لغة (عربي، إنجليزي، فرنسي)
- توليد تلقائي حسب اللغة

### ✅ 7. خيارات العرض
- إظهار/إخفاء حسب نوع الجهاز (Mobile/Desktop)
- شروط عرض مخصصة
- تفعيل/تعطيل عناصر

### ✅ 8. الصلاحيات
- حماية القوائم النظامية
- صلاحيات مختلفة للمحررين والمديرين

## التثبيت والإعداد

### 1. إنشاء Migration

```bash
cd NewsCore
npx prisma migrate dev --name add_menus_system
npx prisma generate
```

### 2. تشغيل Backend

```bash
npm run start:dev
```

### 3. تشغيل Admin Panel

```bash
cd NewsCore-admin
npm install
npm run dev
```

### 4. تشغيل Frontend

```bash
cd NewsCore-frontend
npm install
npm run dev
```

## استخدام API

### الحصول على قائمة حسب الموقع

```typescript
import { menusApi } from '@/lib/api/menus';

// الحصول على قائمة الهيدر
const headerMenu = await menusApi.getByLocation('header', 'ar');

// الحصول على قائمة الفوتر
const footerMenu = await menusApi.getByLocation('footer', 'ar');
```

### الحصول على قائمة حسب Slug

```typescript
const menu = await menusApi.getBySlug('main-menu', 'ar');
```

### الحصول على عناصر ديناميكية

```typescript
// أحدث الأقسام
const latestCategories = await menusApi.getDynamicItems('latest-categories', 5);

// الأقسام المميزة
const trendingCategories = await menusApi.getDynamicItems('trending-categories', 5);

// الوسوم الشائعة
const popularTags = await menusApi.getDynamicItems('popular-tags', 10);
```

## استخدام في Admin Panel

### 1. إنشاء قائمة جديدة

1. اذهب إلى **القوائم** في لوحة الإدارة
2. انقر على **قائمة جديدة**
3. أدخل اسم القائمة والوصف
4. احفظ القائمة

### 2. إضافة عناصر للقائمة

1. اختر القائمة من القائمة الجانبية
2. انقر على **إضافة عنصر**
3. اختر نوع العنصر:
   - **رابط مخصص**: أدخل الرابط مباشرة
   - **قسم**: اختر من الأقسام الموجودة
   - **وسم**: اختر من الوسوم
   - **مقال**: اختر مقال محدد
4. أدخل التسميات للغات المختلفة
5. اضبط خيارات العرض (Mobile/Desktop)
6. احفظ العنصر

### 3. إنشاء Mega Menu

1. عند إضافة عنصر جديد، فعّل خيار **Mega Menu**
2. اختر التخطيط (2، 3، أو 4 أعمدة)
3. أضف عناصر فرعية للعنصر
4. كل عنصر فرعي سيظهر كعمود في الميجا مينيو

### 4. تعيين موقع للقائمة

1. اختر القائمة
2. انقر على **تعيين موقع**
3. اختر الموقع المطلوب (Header, Footer, etc.)
4. حدد الأولوية إذا كان هناك عدة قوائم في نفس الموقع

## استخدام في Frontend

### استخدام MenuRenderer

```tsx
import MenuRenderer from '@/components/menus/MenuRenderer';
import { menusApi } from '@/lib/api/menus';

export default async function Header() {
  const menu = await menusApi.getByLocation('header', 'ar');
  
  return (
    <header>
      {menu && (
        <MenuRenderer 
          menu={menu} 
          showMobile={false} 
          showDesktop={true} 
        />
      )}
    </header>
  );
}
```

### استخدام MegaMenu

```tsx
import MegaMenu from '@/components/menus/MegaMenu';

export default function Navigation() {
  const menuItem = {
    id: '1',
    label: 'الأقسام',
    isMegaMenu: true,
    megaMenuLayout: 'grid-3',
    children: [
      // عناصر الميجا مينيو
    ]
  };
  
  return <MegaMenu item={menuItem} />;
}
```

## أمثلة الاستخدام

### مثال 1: قائمة هيدر بسيطة

```typescript
// في Admin Panel
1. أنشئ قائمة باسم "القائمة الرئيسية"
2. أضف عناصر:
   - الرئيسية (CUSTOM: /)
   - الأخبار (CATEGORY: news)
   - الرياضة (CATEGORY: sports)
   - الاقتصاد (CATEGORY: economy)
3. عيّن الموقع: Header
```

### مثال 2: Mega Menu للأقسام

```typescript
// في Admin Panel
1. أنشئ عنصر "الأقسام" (CUSTOM)
2. فعّل Mega Menu
3. اختر التخطيط: grid-3
4. أضف عناصر فرعية:
   - الأخبار (مع عناصر فرعية: محلية، دولية، سياسة)
   - الرياضة (مع عناصر فرعية: كرة قدم، كرة سلة، أولمبياد)
   - الاقتصاد (مع عناصر فرعية: أسواق، أعمال، تقنية)
```

### مثال 3: قائمة فوتر متعددة الأعمدة

```typescript
// في Admin Panel
1. أنشئ 4 قوائم منفصلة:
   - "روابط سريعة" → Footer-1
   - "الأقسام" → Footer-2
   - "قانوني" → Footer-3
   - "تابعنا" → Footer-4
2. أضف العناصر لكل قائمة
3. عيّن المواقع المناسبة
```

## API Endpoints

### Backend Endpoints

```
GET    /api/v1/menus                    # الحصول على جميع القوائم
GET    /api/v1/menus/:id               # الحصول على قائمة محددة
GET    /api/v1/menus/slug/:slug        # الحصول على قائمة بالرابط
GET    /api/v1/menus/location/:location # الحصول على قائمة حسب الموقع
POST   /api/v1/menus                   # إنشاء قائمة جديدة
PATCH  /api/v1/menus/:id               # تحديث قائمة
DELETE /api/v1/menus/:id               # حذف قائمة

POST   /api/v1/menus/:menuId/items     # إضافة عنصر
PATCH  /api/v1/menus/items/:id         # تحديث عنصر
DELETE /api/v1/menus/items/:id        # حذف عنصر
POST   /api/v1/menus/:menuId/items/reorder # إعادة ترتيب العناصر

POST   /api/v1/menus/:menuId/locations # تعيين موقع
DELETE /api/v1/menus/:menuId/locations/:location # إزالة موقع

GET    /api/v1/menus/dynamic/:type     # الحصول على عناصر ديناميكية
```

## أفضل الممارسات

1. **استخدم أسماء واضحة**: استخدم أسماء وصفية للقوائم والعناصر
2. **نظم العناصر**: استخدم العناصر الفرعية لتنظيم القوائم الكبيرة
3. **اختبر على الأجهزة**: تأكد من أن القوائم تعمل جيداً على Mobile و Desktop
4. **استخدم Mega Menu بحكمة**: فقط للقوائم الكبيرة التي تحتاج عرضاً خاصاً
5. **احفظ نسخ احتياطية**: استخدم Menu Revisions للرجوع لنسخ سابقة

## الدعم والمساعدة

للمزيد من المعلومات أو المساعدة، راجع:
- [Flowbite Mega Menu Documentation](https://flowbite.com/docs/components/mega-menu/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)

