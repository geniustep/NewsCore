#!/bin/bash
# سكريبت تحديث النظام المتقدم لـ NewsCore

set -e

echo "========================================"
echo "🚀 بدء تحديث نظام NewsCore المتقدم"
echo "========================================"

cd /opt/NewsCore

# 1. إيقاف الحاويات
echo ""
echo "📦 إيقاف الحاويات الحالية..."
docker compose down || true

# 2. إعادة بناء الصورة
echo ""
echo "🔨 إعادة بناء صورة Docker..."
docker compose build --no-cache newscore-api

# 3. تشغيل الحاويات
echo ""
echo "🚀 تشغيل الحاويات..."
docker compose up -d

# 4. انتظار قاعدة البيانات
echo ""
echo "⏳ انتظار قاعدة البيانات (15 ثانية)..."
sleep 15

# 5. توليد Prisma Client
echo ""
echo "🔧 توليد Prisma Client..."
docker compose exec -T newscore-api npx prisma generate

# 6. تطبيق التغييرات على قاعدة البيانات
echo ""
echo "📊 تطبيق التغييرات على قاعدة البيانات..."
docker compose exec -T newscore-api npx prisma db push --accept-data-loss

# 7. تشغيل seed النظام الأساسي
echo ""
echo "🌱 تشغيل seed النظام الأساسي..."
docker compose exec -T newscore-api npx ts-node prisma/seed-core.ts || echo "⚠️ Seed قد يكون موجود بالفعل"

# 8. إعادة تشغيل الخادم
echo ""
echo "🔄 إعادة تشغيل الخادم..."
docker compose restart newscore-api

# 9. عرض الحالة
echo ""
echo "📋 حالة الحاويات:"
docker compose ps

echo ""
echo "========================================"
echo "✅ تم التحديث بنجاح!"
echo "========================================"
echo ""
echo "🔗 الروابط:"
echo "   - API: http://localhost:3000/api/v1"
echo "   - Docs: http://localhost:3000/api/docs"
echo ""
echo "📝 الـ APIs الجديدة:"
echo "   - /api/v1/themes    - إدارة القوالب"
echo "   - /api/v1/modules   - إدارة الوحدات"
echo "   - /api/v1/i18n      - إدارة الترجمات"
echo "   - /api/v1/widgets   - إدارة الودجات"
echo "   - /api/v1/hooks     - إدارة الأحداث"
echo ""
echo "📊 لعرض السجلات:"
echo "   docker compose logs -f newscore-api"
