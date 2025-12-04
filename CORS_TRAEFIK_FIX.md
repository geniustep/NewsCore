# إصلاح مشكلة CORS مع Traefik

## المشكلة
CORS headers لا تظهر في الـ response رغم أن الكود صحيح. المشكلة قد تكون في Traefik reverse proxy.

## الحلول الممكنة

### الحل 1: إضافة CORS headers في Traefik

أضف labels التالية في `docker-compose.yml`:

```yaml
labels:
  - "traefik.http.middlewares.cors-headers.headers.accessControlAllowMethods=GET,OPTIONS,PUT,POST,DELETE,PATCH,HEAD"
  - "traefik.http.middlewares.cors-headers.headers.accessControlAllowOriginList=https://news-core-admin-g43jexpva-geniusteps-projects.vercel.app,https://*.vercel.app"
  - "traefik.http.middlewares.cors-headers.headers.accessControlAllowCredentials=true"
  - "traefik.http.middlewares.cors-headers.headers.accessControlAllowHeaders=Content-Type,Authorization,Accept,X-Requested-With"
  - "traefik.http.middlewares.cors-headers.headers.accessControlMaxAge=100"
  - "traefik.http.middlewares.cors-headers.headers.addVaryHeader=true"
  - "traefik.http.routers.newscore-api.middlewares=cors-headers"
```

### الحل 2: استخدام Nginx كـ reverse proxy

إذا كان Traefik يسبب المشاكل، يمكن استخدام Nginx بدلاً منه.

### الحل 3: تعطيل CORS في Backend واستخدام Traefik فقط

يمكن تعطيل CORS في NestJS والاعتماد على Traefik لإضافة headers.

## الخطوات الموصى بها

1. **أضف CORS middleware في Traefik** (الحل الأسرع)
2. **أعد بناء وتشغيل Backend**
3. **اختبر CORS مرة أخرى**

## ملاحظة

إذا استمرت المشكلة، قد تحتاج إلى:
- التحقق من Traefik logs
- التحقق من أن Traefik لا يزيل headers
- استخدام طريقة أخرى للـ reverse proxy

