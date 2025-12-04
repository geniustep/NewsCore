# إصلاح مشكلة CORS - خطوات النشر

## المشكلة
Backend لا يسمح لـ Vercel deployments بالوصول بسبب CORS.

## الحل المطبق

تم تحديث `src/main.ts` لدعم:
- ✅ جميع Vercel deployments (`.vercel.app`)
- ✅ Pattern matching محسّن
- ✅ Fallback شامل لجميع Vercel subdomains

## خطوات النشر المطلوبة

### 1. إعادة بناء Backend

```bash
cd NewsCore
npm run build
```

### 2. إعادة تشغيل Docker Container

```bash
# إذا كنت تستخدم Docker
docker-compose restart newscore-api

# أو إعادة بناء الصورة
docker-compose up -d --build newscore-api
```

### 3. التحقق من التغييرات

بعد إعادة التشغيل، تحقق من:
1. أن Backend يعمل: `curl https://admin.sahara2797.com/api/v1/health`
2. أن CORS headers موجودة في response

### 4. اختبار CORS

يمكنك اختبار CORS باستخدام curl:

```bash
curl -H "Origin: https://news-core-admin-g43jexpva-geniusteps-projects.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type,Authorization" \
     -X OPTIONS \
     https://admin.sahara2797.com/api/v1/auth/login \
     -v
```

يجب أن ترى headers:
- `Access-Control-Allow-Origin: https://news-core-admin-g43jexpva-geniusteps-projects.vercel.app`
- `Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type,Authorization,Accept,X-Requested-With`

## ملاحظات مهمة

1. **يجب إعادة بناء Backend** بعد أي تغييرات في `main.ts`
2. **يجب إعادة تشغيل Container** لتطبيق التغييرات
3. CORS configuration الآن يدعم جميع Vercel deployments تلقائياً
4. في development mode، سيتم logging الـ origins المرفوضة للمساعدة في debugging

## إذا استمرت المشكلة

1. تحقق من أن Backend تم إعادة بنائه وتشغيله
2. تحقق من logs: `docker logs newscore-api`
3. تأكد من أن `CORS_ORIGINS` في `.env` لا يمنع Vercel origins
4. جرب تعيين `CORS_ORIGINS=*` مؤقتاً للاختبار

