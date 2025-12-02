# 🏗️ Professional News Backend - Implementation Prompt

## 📋 مقدمة للمطور

أنت مطور Backend محترف، مهمتك بناء نظام إدارة محتوى صحفي (News CMS) على مستوى المواقع الإخبارية الكبرى مثل NYT أو Al Jazeera. هذا الـ Prompt يحتوي على التصميم الكامل والتحسينات المطلوبة.

---

## 🎯 الهدف النهائي

بناء Backend قابل للتوسع يدعم:
- إدارة محتوى صحفي متعدد اللغات
- نظام صلاحيات متقدم (RBAC)
- استيراد أخبار من مصادر متعددة (RSS, APIs, Crawlers)
- تكامل مع AI للتلخيص والترجمة والتصنيف
- تحليلات متقدمة للمحتوى والقراء
- أداء عالي وقابلية للتوسع

---

## 🔧 Tech Stack المعتمد

```yaml
Runtime: Node.js 20+ LTS
Language: TypeScript 5.x (strict mode)
Framework: NestJS 10.x
Database: PostgreSQL 16
ORM: Prisma 5.x
Cache: Redis 7.x (ioredis)
Queue: BullMQ
Search: Meilisearch (later OpenSearch)
Storage: S3-compatible (MinIO/DO Spaces)
Auth: JWT + Refresh Tokens + Passport.js
API: REST + GraphQL (optional)
Docs: Swagger/OpenAPI 3.0
Testing: Jest + Supertest
Containerization: Docker + Docker Compose
```

---

## 📁 هيكل المشروع (Monorepo Structure)

```
news-backend/
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── .env
├── package.json
├── tsconfig.json
├── nest-cli.json
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── configuration.ts
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── jwt.config.ts
│   │   ├── storage.config.ts
│   │   └── validation.schema.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   ├── permissions.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── api-paginated.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   ├── permissions.guard.ts
│   │   │   └── throttle.guard.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── cache.interceptor.ts
│   │   │   └── timeout.interceptor.ts
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   ├── prisma-exception.filter.ts
│   │   │   └── validation-exception.filter.ts
│   │   ├── pipes/
│   │   │   ├── parse-uuid.pipe.ts
│   │   │   └── validation.pipe.ts
│   │   ├── dto/
│   │   │   ├── pagination.dto.ts
│   │   │   ├── sort.dto.ts
│   │   │   └── api-response.dto.ts
│   │   ├── interfaces/
│   │   │   ├── paginated-result.interface.ts
│   │   │   └── request-with-user.interface.ts
│   │   └── utils/
│   │       ├── slug.util.ts
│   │       ├── crypto.util.ts
│   │       └── date.util.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── jwt-refresh.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── refresh-token.dto.ts
│   │   │   │   └── auth-response.dto.ts
│   │   │   └── guards/
│   │   │       └── local-auth.guard.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       ├── update-user.dto.ts
│   │   │       └── user-response.dto.ts
│   │   ├── roles/
│   │   │   ├── roles.module.ts
│   │   │   ├── roles.controller.ts
│   │   │   ├── roles.service.ts
│   │   │   ├── permissions.service.ts
│   │   │   └── dto/
│   │   │       ├── create-role.dto.ts
│   │   │       ├── assign-role.dto.ts
│   │   │       └── permission.dto.ts
│   │   ├── content/
│   │   │   ├── content.module.ts
│   │   │   ├── articles/
│   │   │   │   ├── articles.controller.ts
│   │   │   │   ├── articles.service.ts
│   │   │   │   ├── articles.repository.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-article.dto.ts
│   │   │   │       ├── update-article.dto.ts
│   │   │   │       ├── publish-article.dto.ts
│   │   │   │       ├── article-filter.dto.ts
│   │   │   │       └── article-response.dto.ts
│   │   │   ├── categories/
│   │   │   │   ├── categories.controller.ts
│   │   │   │   ├── categories.service.ts
│   │   │   │   └── dto/
│   │   │   ├── tags/
│   │   │   │   ├── tags.controller.ts
│   │   │   │   ├── tags.service.ts
│   │   │   │   └── dto/
│   │   │   ├── authors/
│   │   │   │   ├── authors.controller.ts
│   │   │   │   ├── authors.service.ts
│   │   │   │   └── dto/
│   │   │   └── media/
│   │   │       ├── media.controller.ts
│   │   │       ├── media.service.ts
│   │   │       ├── storage.service.ts
│   │   │       └── dto/
│   │   ├── ingestion/
│   │   │   ├── ingestion.module.ts
│   │   │   ├── sources/
│   │   │   │   ├── sources.controller.ts
│   │   │   │   ├── sources.service.ts
│   │   │   │   └── dto/
│   │   │   ├── fetchers/
│   │   │   │   ├── rss.fetcher.ts
│   │   │   │   ├── api.fetcher.ts
│   │   │   │   └── crawler.fetcher.ts
│   │   │   ├── processors/
│   │   │   │   ├── ingestion.processor.ts
│   │   │   │   ├── deduplication.service.ts
│   │   │   │   └── content-extractor.service.ts
│   │   │   └── jobs/
│   │   │       ├── fetch-sources.job.ts
│   │   │       └── process-items.job.ts
│   │   ├── ai/
│   │   │   ├── ai.module.ts
│   │   │   ├── ai.controller.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── providers/
│   │   │   │   ├── openai.provider.ts
│   │   │   │   ├── anthropic.provider.ts
│   │   │   │   ├── deepseek.provider.ts
│   │   │   │   └── provider.interface.ts
│   │   │   ├── processors/
│   │   │   │   ├── summarizer.processor.ts
│   │   │   │   ├── translator.processor.ts
│   │   │   │   ├── classifier.processor.ts
│   │   │   │   └── headline-generator.processor.ts
│   │   │   └── dto/
│   │   │       ├── ai-job.dto.ts
│   │   │       └── ai-result.dto.ts
│   │   ├── analytics/
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── events/
│   │   │   │   ├── events.service.ts
│   │   │   │   └── events.processor.ts
│   │   │   ├── reports/
│   │   │   │   ├── reports.service.ts
│   │   │   │   └── report-generators/
│   │   │   └── dto/
│   │   │       ├── track-event.dto.ts
│   │   │       └── analytics-query.dto.ts
│   │   ├── scheduler/
│   │   │   ├── scheduler.module.ts
│   │   │   ├── scheduler.service.ts
│   │   │   └── tasks/
│   │   │       ├── ingestion.task.ts
│   │   │       ├── publish-scheduled.task.ts
│   │   │       ├── cleanup.task.ts
│   │   │       └── analytics-aggregation.task.ts
│   │   ├── notifications/
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── channels/
│   │   │   │   ├── email.channel.ts
│   │   │   │   ├── push.channel.ts
│   │   │   │   └── websocket.channel.ts
│   │   │   └── templates/
│   │   ├── audit/
│   │   │   ├── audit.module.ts
│   │   │   ├── audit.service.ts
│   │   │   ├── audit.interceptor.ts
│   │   │   └── dto/
│   │   └── health/
│   │       ├── health.module.ts
│   │       └── health.controller.ts
│   └── database/
│       └── prisma.service.ts
├── test/
│   ├── app.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   └── articles.e2e-spec.ts
└── scripts/
    ├── seed-permissions.ts
    └── migrate-data.ts
```

---

## 📊 Prisma Schema الكامل

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "fullTextIndex"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// AUTH & USERS
// ============================================

model User {
  id            String    @id @default(uuid()) @db.Uuid
  email         String    @unique @db.VarChar(255)
  passwordHash  String?   @map("password_hash") @db.VarChar(255)
  firstName     String    @map("first_name") @db.VarChar(100)
  lastName      String    @map("last_name") @db.VarChar(100)
  displayName   String?   @map("display_name") @db.VarChar(200)
  avatarUrl     String?   @map("avatar_url") @db.VarChar(500)
  bio           String?   @db.Text
  phone         String?   @db.VarChar(20)
  locale        String    @default("ar") @db.VarChar(10)
  timezone      String    @default("UTC") @db.VarChar(50)
  status        UserStatus @default(PENDING)
  emailVerifiedAt DateTime? @map("email_verified_at")
  lastLoginAt   DateTime? @map("last_login_at")
  lastLoginIp   String?   @map("last_login_ip") @db.VarChar(45)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")

  // Relations
  roles           UserRole[]
  sessions        Session[]
  articles        Article[]       @relation("ArticleAuthor")
  editedArticles  Article[]       @relation("ArticleEditor")
  articleVersions ArticleVersion[]
  auditLogs       AuditLog[]
  notifications   Notification[]
  preferences     UserPreference?

  @@index([email])
  @@index([status])
  @@index([createdAt])
  @@map("users")
}

enum UserStatus {
  ACTIVE
  PENDING
  SUSPENDED
  BANNED
  DELETED
}

model UserPreference {
  id                String   @id @default(uuid()) @db.Uuid
  userId            String   @unique @map("user_id") @db.Uuid
  emailNotifications Boolean @default(true) @map("email_notifications")
  pushNotifications  Boolean @default(true) @map("push_notifications")
  newsletterSubscribed Boolean @default(false) @map("newsletter_subscribed")
  darkMode          Boolean  @default(false) @map("dark_mode")
  preferredCategories String[] @map("preferred_categories")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_preferences")
}

model Session {
  id           String   @id @default(uuid()) @db.Uuid
  userId       String   @map("user_id") @db.Uuid
  refreshToken String   @unique @map("refresh_token") @db.VarChar(500)
  userAgent    String?  @map("user_agent") @db.VarChar(500)
  ipAddress    String?  @map("ip_address") @db.VarChar(45)
  deviceType   String?  @map("device_type") @db.VarChar(50)
  expiresAt    DateTime @map("expires_at")
  createdAt    DateTime @default(now()) @map("created_at")
  lastUsedAt   DateTime @default(now()) @map("last_used_at")
  revokedAt    DateTime? @map("revoked_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([refreshToken])
  @@index([expiresAt])
  @@map("sessions")
}

// ============================================
// RBAC - ROLES & PERMISSIONS
// ============================================

model Role {
  id          String   @id @default(uuid()) @db.Uuid
  name        String   @unique @db.VarChar(50)
  displayName String   @map("display_name") @db.VarChar(100)
  description String?  @db.Text
  isSystem    Boolean  @default(false) @map("is_system")
  priority    Int      @default(0)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  permissions RolePermission[]
  users       UserRole[]

  @@index([name])
  @@map("roles")
}

model Permission {
  id          String   @id @default(uuid()) @db.Uuid
  name        String   @unique @db.VarChar(100)
  displayName String   @map("display_name") @db.VarChar(150)
  description String?  @db.Text
  module      String   @db.VarChar(50)
  action      String   @db.VarChar(50)
  createdAt   DateTime @default(now()) @map("created_at")

  roles RolePermission[]

  @@unique([module, action])
  @@index([module])
  @@map("permissions")
}

model RolePermission {
  roleId       String   @map("role_id") @db.Uuid
  permissionId String   @map("permission_id") @db.Uuid
  createdAt    DateTime @default(now()) @map("created_at")

  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
  @@map("role_permissions")
}

model UserRole {
  userId    String   @map("user_id") @db.Uuid
  roleId    String   @map("role_id") @db.Uuid
  assignedAt DateTime @default(now()) @map("assigned_at")
  assignedBy String?  @map("assigned_by") @db.Uuid

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@id([userId, roleId])
  @@map("user_roles")
}

// ============================================
// CONTENT - ARTICLES
// ============================================

model Article {
  id              String        @id @default(uuid()) @db.Uuid
  slug            String        @unique @db.VarChar(300)
  status          ArticleStatus @default(DRAFT)
  type            ArticleType   @default(STANDARD)
  language        String        @default("ar") @db.VarChar(10)
  
  // Content
  title           String        @db.VarChar(500)
  subtitle        String?       @db.VarChar(500)
  excerpt         String?       @db.Text
  content         String        @db.Text
  contentHtml     String?       @map("content_html") @db.Text
  contentJson     Json?         @map("content_json")
  
  // Media
  coverImageUrl   String?       @map("cover_image_url") @db.VarChar(500)
  coverImageAlt   String?       @map("cover_image_alt") @db.VarChar(300)
  videoUrl        String?       @map("video_url") @db.VarChar(500)
  galleryImages   Json?         @map("gallery_images")
  
  // Metadata
  readingTime     Int?          @map("reading_time")
  wordCount       Int?          @map("word_count")
  priority        Int           @default(0)
  isPinned        Boolean       @default(false) @map("is_pinned")
  isFeatured      Boolean       @default(false) @map("is_featured")
  isBreaking      Boolean       @default(false) @map("is_breaking")
  allowComments   Boolean       @default(true) @map("allow_comments")
  
  // Source tracking
  sourceType      SourceType    @default(ORIGINAL) @map("source_type")
  sourceUrl       String?       @map("source_url") @db.VarChar(1000)
  sourceName      String?       @map("source_name") @db.VarChar(200)
  sourceRef       String?       @map("source_ref") @db.VarChar(200)
  
  // SEO
  seoTitle        String?       @map("seo_title") @db.VarChar(70)
  seoDescription  String?       @map("seo_description") @db.VarChar(160)
  seoKeywords     String[]      @map("seo_keywords")
  canonicalUrl    String?       @map("canonical_url") @db.VarChar(500)
  
  // Dates
  publishedAt     DateTime?     @map("published_at")
  scheduledAt     DateTime?     @map("scheduled_at")
  expiresAt       DateTime?     @map("expires_at")
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")
  deletedAt       DateTime?     @map("deleted_at")
  
  // Relations
  authorId        String        @map("author_id") @db.Uuid
  editorId        String?       @map("editor_id") @db.Uuid
  
  author          User          @relation("ArticleAuthor", fields: [authorId], references: [id])
  editor          User?         @relation("ArticleEditor", fields: [editorId], references: [id])
  categories      ArticleCategory[]
  tags            ArticleTag[]
  translations    ArticleTranslation[]
  versions        ArticleVersion[]
  relatedFrom     RelatedArticle[] @relation("RelatedFrom")
  relatedTo       RelatedArticle[] @relation("RelatedTo")
  ingestedItem    IngestedItem? @relation(fields: [ingestedItemId], references: [id])
  ingestedItemId  String?       @unique @map("ingested_item_id") @db.Uuid
  analytics       ArticleAnalytics?
  events          AnalyticsEvent[]

  @@index([slug])
  @@index([status])
  @@index([language])
  @@index([authorId])
  @@index([publishedAt])
  @@index([createdAt])
  @@index([type])
  @@index([isPinned, isFeatured])
  @@map("articles")
}

enum ArticleStatus {
  DRAFT
  PENDING_REVIEW
  APPROVED
  SCHEDULED
  PUBLISHED
  ARCHIVED
  REJECTED
}

enum ArticleType {
  STANDARD
  BREAKING
  ANALYSIS
  OPINION
  INVESTIGATION
  INTERVIEW
  LIVEBLOG
  VIDEO
  PODCAST
  PHOTO_STORY
}

enum SourceType {
  ORIGINAL
  AGGREGATED
  SYNDICATED
  AI_ASSISTED
  TRANSLATED
  USER_GENERATED
}

model ArticleVersion {
  id         String   @id @default(uuid()) @db.Uuid
  articleId  String   @map("article_id") @db.Uuid
  version    Int
  title      String   @db.VarChar(500)
  content    String   @db.Text
  changes    Json?
  reason     String?  @db.VarChar(500)
  createdAt  DateTime @default(now()) @map("created_at")
  createdById String  @map("created_by_id") @db.Uuid

  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  createdBy User    @relation(fields: [createdById], references: [id])

  @@unique([articleId, version])
  @@index([articleId])
  @@map("article_versions")
}

model ArticleTranslation {
  id           String   @id @default(uuid()) @db.Uuid
  articleId    String   @map("article_id") @db.Uuid
  language     String   @db.VarChar(10)
  title        String   @db.VarChar(500)
  subtitle     String?  @db.VarChar(500)
  excerpt      String?  @db.Text
  content      String   @db.Text
  seoTitle     String?  @map("seo_title") @db.VarChar(70)
  seoDescription String? @map("seo_description") @db.VarChar(160)
  translationType TranslationType @default(MANUAL) @map("translation_type")
  isReviewed   Boolean  @default(false) @map("is_reviewed")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)

  @@unique([articleId, language])
  @@index([articleId])
  @@map("article_translations")
}

enum TranslationType {
  MANUAL
  AI_GENERATED
  AI_ASSISTED
}

model RelatedArticle {
  fromArticleId String   @map("from_article_id") @db.Uuid
  toArticleId   String   @map("to_article_id") @db.Uuid
  relevanceScore Float   @default(0) @map("relevance_score")
  isManual      Boolean  @default(false) @map("is_manual")
  createdAt     DateTime @default(now()) @map("created_at")

  fromArticle Article @relation("RelatedFrom", fields: [fromArticleId], references: [id], onDelete: Cascade)
  toArticle   Article @relation("RelatedTo", fields: [toArticleId], references: [id], onDelete: Cascade)

  @@id([fromArticleId, toArticleId])
  @@map("related_articles")
}

// ============================================
// CONTENT - CATEGORIES & TAGS
// ============================================

model Category {
  id          String   @id @default(uuid()) @db.Uuid
  slug        String   @unique @db.VarChar(100)
  name        String   @db.VarChar(100)
  nameAr      String?  @map("name_ar") @db.VarChar(100)
  nameFr      String?  @map("name_fr") @db.VarChar(100)
  nameEn      String?  @map("name_en") @db.VarChar(100)
  description String?  @db.Text
  color       String?  @db.VarChar(20)
  icon        String?  @db.VarChar(50)
  coverImage  String?  @map("cover_image") @db.VarChar(500)
  parentId    String?  @map("parent_id") @db.Uuid
  sortOrder   Int      @default(0) @map("sort_order")
  isActive    Boolean  @default(true) @map("is_active")
  isFeatured  Boolean  @default(false) @map("is_featured")
  seoTitle    String?  @map("seo_title") @db.VarChar(70)
  seoDescription String? @map("seo_description") @db.VarChar(160)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")
  articles ArticleCategory[]

  @@index([slug])
  @@index([parentId])
  @@index([isActive])
  @@map("categories")
}

model Tag {
  id        String   @id @default(uuid()) @db.Uuid
  slug      String   @unique @db.VarChar(100)
  name      String   @db.VarChar(100)
  nameAr    String?  @map("name_ar") @db.VarChar(100)
  nameFr    String?  @map("name_fr") @db.VarChar(100)
  nameEn    String?  @map("name_en") @db.VarChar(100)
  type      TagType  @default(GENERAL)
  usageCount Int     @default(0) @map("usage_count")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  articles ArticleTag[]

  @@index([slug])
  @@index([type])
  @@index([usageCount])
  @@map("tags")
}

enum TagType {
  GENERAL
  PERSON
  ORGANIZATION
  LOCATION
  EVENT
  TOPIC
}

model ArticleCategory {
  articleId  String   @map("article_id") @db.Uuid
  categoryId String   @map("category_id") @db.Uuid
  isPrimary  Boolean  @default(false) @map("is_primary")
  createdAt  DateTime @default(now()) @map("created_at")

  article  Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([articleId, categoryId])
  @@map("article_categories")
}

model ArticleTag {
  articleId String   @map("article_id") @db.Uuid
  tagId     String   @map("tag_id") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")

  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  tag     Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([articleId, tagId])
  @@map("article_tags")
}

// ============================================
// MEDIA ASSETS
// ============================================

model MediaAsset {
  id           String      @id @default(uuid()) @db.Uuid
  type         MediaType
  filename     String      @db.VarChar(255)
  originalName String      @map("original_name") @db.VarChar(255)
  mimeType     String      @map("mime_type") @db.VarChar(100)
  size         Int
  url          String      @db.VarChar(1000)
  thumbnailUrl String?     @map("thumbnail_url") @db.VarChar(1000)
  alt          String?     @db.VarChar(300)
  caption      String?     @db.Text
  credit       String?     @db.VarChar(200)
  width        Int?
  height       Int?
  duration     Int?
  metadata     Json?
  folderId     String?     @map("folder_id") @db.Uuid
  uploadedById String      @map("uploaded_by_id") @db.Uuid
  createdAt    DateTime    @default(now()) @map("created_at")
  updatedAt    DateTime    @updatedAt @map("updated_at")

  folder MediaFolder? @relation(fields: [folderId], references: [id])

  @@index([type])
  @@index([folderId])
  @@index([createdAt])
  @@map("media_assets")
}

enum MediaType {
  IMAGE
  VIDEO
  AUDIO
  DOCUMENT
  OTHER
}

model MediaFolder {
  id        String   @id @default(uuid()) @db.Uuid
  name      String   @db.VarChar(100)
  parentId  String?  @map("parent_id") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")

  parent   MediaFolder?  @relation("FolderHierarchy", fields: [parentId], references: [id])
  children MediaFolder[] @relation("FolderHierarchy")
  assets   MediaAsset[]

  @@index([parentId])
  @@map("media_folders")
}

// ============================================
// INGESTION - RSS & SOURCES
// ============================================

model Source {
  id              String       @id @default(uuid()) @db.Uuid
  name            String       @db.VarChar(200)
  slug            String       @unique @db.VarChar(100)
  type            SourceTypeEnum
  baseUrl         String       @map("base_url") @db.VarChar(500)
  feedUrl         String?      @map("feed_url") @db.VarChar(500)
  apiEndpoint     String?      @map("api_endpoint") @db.VarChar(500)
  apiKey          String?      @map("api_key") @db.VarChar(500)
  language        String       @default("ar") @db.VarChar(10)
  country         String?      @db.VarChar(5)
  logoUrl         String?      @map("logo_url") @db.VarChar(500)
  description     String?      @db.Text
  trustScore      Float        @default(0.5) @map("trust_score")
  isActive        Boolean      @default(true) @map("is_active")
  fetchInterval   Int          @default(300) @map("fetch_interval")
  lastFetchedAt   DateTime?    @map("last_fetched_at")
  lastSuccessAt   DateTime?    @map("last_success_at")
  consecutiveErrors Int        @default(0) @map("consecutive_errors")
  config          Json?
  createdAt       DateTime     @default(now()) @map("created_at")
  updatedAt       DateTime     @updatedAt @map("updated_at")

  items IngestedItem[]
  logs  IngestionLog[]

  @@index([type])
  @@index([isActive])
  @@index([language])
  @@map("sources")
}

enum SourceTypeEnum {
  RSS
  API
  CRAWLER
  SOCIAL
  MANUAL
}

model IngestedItem {
  id              String         @id @default(uuid()) @db.Uuid
  sourceId        String         @map("source_id") @db.Uuid
  externalId      String         @map("external_id") @db.VarChar(500)
  externalUrl     String         @map("external_url") @db.VarChar(1000)
  status          IngestionStatus @default(NEW)
  
  // Raw content
  rawTitle        String         @map("raw_title") @db.Text
  rawContent      String?        @map("raw_content") @db.Text
  rawHtml         String?        @map("raw_html") @db.Text
  rawExcerpt      String?        @map("raw_excerpt") @db.Text
  rawAuthor       String?        @map("raw_author") @db.VarChar(200)
  rawImageUrl     String?        @map("raw_image_url") @db.VarChar(1000)
  rawPublishedAt  DateTime?      @map("raw_published_at")
  rawCategories   String[]       @map("raw_categories")
  rawTags         String[]       @map("raw_tags")
  rawMetadata     Json?          @map("raw_metadata")
  
  // Processing
  contentHash     String?        @map("content_hash") @db.VarChar(64)
  isDuplicate     Boolean        @default(false) @map("is_duplicate")
  duplicateOfId   String?        @map("duplicate_of_id") @db.Uuid
  qualityScore    Float?         @map("quality_score")
  relevanceScore  Float?         @map("relevance_score")
  
  // AI Processing
  aiSummary       String?        @map("ai_summary") @db.Text
  aiHeadline      String?        @map("ai_headline") @db.VarChar(500)
  aiCategories    String[]       @map("ai_categories")
  aiTags          String[]       @map("ai_tags")
  aiSentiment     String?        @map("ai_sentiment") @db.VarChar(20)
  
  // Timestamps
  fetchedAt       DateTime       @default(now()) @map("fetched_at")
  processedAt     DateTime?      @map("processed_at")
  publishedAt     DateTime?      @map("published_at")
  createdAt       DateTime       @default(now()) @map("created_at")
  updatedAt       DateTime       @updatedAt @map("updated_at")

  source  Source   @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  article Article?
  aiJobs  AIJob[]

  @@unique([sourceId, externalId])
  @@index([status])
  @@index([contentHash])
  @@index([fetchedAt])
  @@map("ingested_items")
}

enum IngestionStatus {
  NEW
  PROCESSING
  PROCESSED
  PUBLISHED
  DISCARDED
  FAILED
  DUPLICATE
}

model IngestionLog {
  id           String   @id @default(uuid()) @db.Uuid
  sourceId     String   @map("source_id") @db.Uuid
  status       String   @db.VarChar(20)
  startedAt    DateTime @map("started_at")
  finishedAt   DateTime? @map("finished_at")
  fetchedCount Int      @default(0) @map("fetched_count")
  newCount     Int      @default(0) @map("new_count")
  duplicateCount Int    @default(0) @map("duplicate_count")
  errorCount   Int      @default(0) @map("error_count")
  errors       Json?
  metadata     Json?
  createdAt    DateTime @default(now()) @map("created_at")

  source Source @relation(fields: [sourceId], references: [id], onDelete: Cascade)

  @@index([sourceId])
  @@index([startedAt])
  @@map("ingestion_logs")
}

// ============================================
// AI JOBS
// ============================================

model AIJob {
  id           String      @id @default(uuid()) @db.Uuid
  type         AIJobType
  status       AIJobStatus @default(PENDING)
  priority     Int         @default(0)
  
  // Target
  targetType   String      @map("target_type") @db.VarChar(50)
  targetId     String      @map("target_id") @db.Uuid
  
  // Provider
  provider     String      @db.VarChar(50)
  model        String?     @db.VarChar(100)
  
  // Input/Output
  inputPayload  Json?      @map("input_payload")
  outputResult  Json?      @map("output_result")
  
  // Metrics
  tokensUsed    Int?       @map("tokens_used")
  costCents     Int?       @map("cost_cents")
  processingMs  Int?       @map("processing_ms")
  
  // Error handling
  errorMessage  String?    @map("error_message") @db.Text
  retryCount    Int        @default(0) @map("retry_count")
  maxRetries    Int        @default(3) @map("max_retries")
  
  // Timestamps
  scheduledAt   DateTime?  @map("scheduled_at")
  startedAt     DateTime?  @map("started_at")
  completedAt   DateTime?  @map("completed_at")
  createdAt     DateTime   @default(now()) @map("created_at")
  updatedAt     DateTime   @updatedAt @map("updated_at")

  ingestedItem IngestedItem? @relation(fields: [targetId], references: [id])

  @@index([type])
  @@index([status])
  @@index([targetType, targetId])
  @@index([scheduledAt])
  @@map("ai_jobs")
}

enum AIJobType {
  SUMMARIZE
  GENERATE_HEADLINE
  TRANSLATE
  CLASSIFY
  EXTRACT_ENTITIES
  SENTIMENT_ANALYSIS
  SEO_OPTIMIZE
  FACT_CHECK
}

enum AIJobStatus {
  PENDING
  SCHEDULED
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}

model AIProvider {
  id          String   @id @default(uuid()) @db.Uuid
  name        String   @unique @db.VarChar(50)
  displayName String   @map("display_name") @db.VarChar(100)
  apiKeyEnc   String?  @map("api_key_enc") @db.VarChar(500)
  baseUrl     String?  @map("base_url") @db.VarChar(500)
  models      Json
  isActive    Boolean  @default(true) @map("is_active")
  rateLimitRpm Int?    @map("rate_limit_rpm")
  rateLimitTpd Int?    @map("rate_limit_tpd")
  config      Json?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("ai_providers")
}

// ============================================
// ANALYTICS
// ============================================

model AnalyticsEvent {
  id          String   @id @default(uuid()) @db.Uuid
  type        EventType
  sessionId   String?  @map("session_id") @db.Uuid
  userId      String?  @map("user_id") @db.Uuid
  articleId   String?  @map("article_id") @db.Uuid
  
  // Context
  ipAddress   String?  @map("ip_address") @db.VarChar(45)
  userAgent   String?  @map("user_agent") @db.VarChar(500)
  referer     String?  @db.VarChar(500)
  country     String?  @db.VarChar(5)
  city        String?  @db.VarChar(100)
  deviceType  String?  @map("device_type") @db.VarChar(20)
  browser     String?  @db.VarChar(50)
  os          String?  @db.VarChar(50)
  
  // Event data
  metadata    Json?
  duration    Int?
  scrollDepth Float?   @map("scroll_depth")
  
  createdAt   DateTime @default(now()) @map("created_at")

  article Article? @relation(fields: [articleId], references: [id], onDelete: SetNull)

  @@index([type])
  @@index([articleId])
  @@index([sessionId])
  @@index([createdAt])
  @@map("analytics_events")
}

enum EventType {
  PAGE_VIEW
  ARTICLE_VIEW
  ARTICLE_READ
  ARTICLE_SHARE
  ARTICLE_BOOKMARK
  SEARCH
  CLICK
  SCROLL
  VIDEO_PLAY
  VIDEO_COMPLETE
}

model ArticleAnalytics {
  id              String   @id @default(uuid()) @db.Uuid
  articleId       String   @unique @map("article_id") @db.Uuid
  
  // Counts
  viewsTotal      Int      @default(0) @map("views_total")
  viewsToday      Int      @default(0) @map("views_today")
  viewsWeek       Int      @default(0) @map("views_week")
  viewsMonth      Int      @default(0) @map("views_month")
  uniqueVisitors  Int      @default(0) @map("unique_visitors")
  
  // Engagement
  sharesTotal     Int      @default(0) @map("shares_total")
  bookmarksTotal  Int      @default(0) @map("bookmarks_total")
  commentsTotal   Int      @default(0) @map("comments_total")
  
  // Time metrics
  avgReadTime     Float?   @map("avg_read_time")
  avgScrollDepth  Float?   @map("avg_scroll_depth")
  bounceRate      Float?   @map("bounce_rate")
  
  // Social
  sharesFacebook  Int      @default(0) @map("shares_facebook")
  sharesTwitter   Int      @default(0) @map("shares_twitter")
  sharesWhatsapp  Int      @default(0) @map("shares_whatsapp")
  sharesLinkedin  Int      @default(0) @map("shares_linkedin")
  
  // Trending
  trendingScore   Float    @default(0) @map("trending_score")
  peakHour        Int?     @map("peak_hour")
  
  lastCalculatedAt DateTime? @map("last_calculated_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)

  @@index([viewsTotal])
  @@index([trendingScore])
  @@map("article_analytics")
}

// ============================================
// AUDIT LOG
// ============================================

model AuditLog {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String?  @map("user_id") @db.Uuid
  action      String   @db.VarChar(100)
  entityType  String   @map("entity_type") @db.VarChar(50)
  entityId    String   @map("entity_id") @db.Uuid
  oldValues   Json?    @map("old_values")
  newValues   Json?    @map("new_values")
  ipAddress   String?  @map("ip_address") @db.VarChar(45)
  userAgent   String?  @map("user_agent") @db.VarChar(500)
  metadata    Json?
  createdAt   DateTime @default(now()) @map("created_at")

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([entityType, entityId])
  @@index([action])
  @@index([createdAt])
  @@map("audit_logs")
}

// ============================================
// NOTIFICATIONS
// ============================================

model Notification {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String   @map("user_id") @db.Uuid
  type        NotificationType
  title       String   @db.VarChar(200)
  body        String   @db.Text
  data        Json?
  channel     NotificationChannel @default(IN_APP)
  isRead      Boolean  @default(false) @map("is_read")
  readAt      DateTime? @map("read_at")
  sentAt      DateTime? @map("sent_at")
  createdAt   DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
  @@map("notifications")
}

enum NotificationType {
  SYSTEM
  ARTICLE_PUBLISHED
  ARTICLE_APPROVED
  ARTICLE_REJECTED
  COMMENT_REPLY
  MENTION
  BREAKING_NEWS
}

enum NotificationChannel {
  IN_APP
  EMAIL
  PUSH
  SMS
}

// ============================================
// SETTINGS
// ============================================

model Setting {
  id        String   @id @default(uuid()) @db.Uuid
  key       String   @unique @db.VarChar(100)
  value     Json
  type      String   @db.VarChar(20)
  group     String   @db.VarChar(50)
  label     String   @db.VarChar(200)
  description String? @db.Text
  isPublic  Boolean  @default(false) @map("is_public")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([group])
  @@index([isPublic])
  @@map("settings")
}
```

---

## 🔐 نظام الصلاحيات (RBAC)

### الأدوار الافتراضية:

```typescript
const DEFAULT_ROLES = [
  {
    name: 'super_admin',
    displayName: 'Super Administrator',
    priority: 100,
    isSystem: true,
  },
  {
    name: 'admin',
    displayName: 'Administrator',
    priority: 90,
  },
  {
    name: 'editor_in_chief',
    displayName: 'Editor in Chief',
    priority: 80,
  },
  {
    name: 'senior_editor',
    displayName: 'Senior Editor',
    priority: 70,
  },
  {
    name: 'editor',
    displayName: 'Editor',
    priority: 60,
  },
  {
    name: 'journalist',
    displayName: 'Journalist',
    priority: 50,
  },
  {
    name: 'contributor',
    displayName: 'Contributor',
    priority: 40,
  },
  {
    name: 'analyst',
    displayName: 'Analyst',
    priority: 30,
  },
  {
    name: 'bot',
    displayName: 'AI Bot',
    priority: 20,
  },
  {
    name: 'subscriber',
    displayName: 'Subscriber',
    priority: 10,
  },
];
```

### الصلاحيات:

```typescript
const PERMISSIONS = {
  // Articles
  'article.create': 'Create articles',
  'article.read': 'Read articles',
  'article.update': 'Update own articles',
  'article.update_any': 'Update any article',
  'article.delete': 'Delete own articles',
  'article.delete_any': 'Delete any article',
  'article.publish': 'Publish articles',
  'article.unpublish': 'Unpublish articles',
  'article.schedule': 'Schedule articles',
  'article.review': 'Review articles',
  'article.approve': 'Approve articles',
  'article.reject': 'Reject articles',
  'article.feature': 'Feature articles',
  'article.pin': 'Pin articles',
  
  // Categories
  'category.create': 'Create categories',
  'category.update': 'Update categories',
  'category.delete': 'Delete categories',
  
  // Tags
  'tag.create': 'Create tags',
  'tag.update': 'Update tags',
  'tag.delete': 'Delete tags',
  
  // Users
  'user.read': 'View users',
  'user.create': 'Create users',
  'user.update': 'Update users',
  'user.delete': 'Delete users',
  'user.ban': 'Ban users',
  'user.assign_role': 'Assign roles',
  
  // Roles
  'role.read': 'View roles',
  'role.create': 'Create roles',
  'role.update': 'Update roles',
  'role.delete': 'Delete roles',
  
  // Sources
  'source.read': 'View sources',
  'source.create': 'Create sources',
  'source.update': 'Update sources',
  'source.delete': 'Delete sources',
  'source.toggle': 'Enable/disable sources',
  
  // AI
  'ai.use': 'Use AI features',
  'ai.configure': 'Configure AI providers',
  
  // Analytics
  'analytics.view': 'View analytics',
  'analytics.export': 'Export analytics',
  
  // Settings
  'settings.view': 'View settings',
  'settings.update': 'Update settings',
  
  // Audit
  'audit.view': 'View audit logs',
};
```

---

## 🔌 API Endpoints

### Auth Module

```yaml
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login
POST   /api/v1/auth/logout            # Logout
POST   /api/v1/auth/refresh           # Refresh tokens
POST   /api/v1/auth/forgot-password   # Request password reset
POST   /api/v1/auth/reset-password    # Reset password
POST   /api/v1/auth/verify-email      # Verify email
GET    /api/v1/auth/me                # Get current user
```

### Users Module

```yaml
GET    /api/v1/users                  # List users (paginated)
GET    /api/v1/users/:id              # Get user by ID
POST   /api/v1/users                  # Create user
PUT    /api/v1/users/:id              # Update user
DELETE /api/v1/users/:id              # Delete user
POST   /api/v1/users/:id/roles        # Assign roles
DELETE /api/v1/users/:id/roles/:roleId # Remove role
```

### Articles Module

```yaml
GET    /api/v1/articles                     # List articles (paginated, filtered)
GET    /api/v1/articles/slug/:slug          # Get by slug
GET    /api/v1/articles/:id                 # Get by ID
POST   /api/v1/articles                     # Create draft
PUT    /api/v1/articles/:id                 # Update
DELETE /api/v1/articles/:id                 # Delete (soft)
POST   /api/v1/articles/:id/publish         # Publish
POST   /api/v1/articles/:id/unpublish       # Unpublish
POST   /api/v1/articles/:id/schedule        # Schedule
POST   /api/v1/articles/:id/submit-review   # Submit for review
POST   /api/v1/articles/:id/approve         # Approve
POST   /api/v1/articles/:id/reject          # Reject
GET    /api/v1/articles/:id/versions        # Get versions
POST   /api/v1/articles/:id/restore/:version # Restore version
POST   /api/v1/articles/:id/duplicate       # Duplicate
POST   /api/v1/articles/:id/translate       # Create translation
```

### Categories Module

```yaml
GET    /api/v1/categories             # List (tree structure)
GET    /api/v1/categories/:id         # Get by ID
POST   /api/v1/categories             # Create
PUT    /api/v1/categories/:id         # Update
DELETE /api/v1/categories/:id         # Delete
PUT    /api/v1/categories/reorder     # Reorder
```

### Tags Module

```yaml
GET    /api/v1/tags                   # List (paginated)
GET    /api/v1/tags/popular           # Popular tags
POST   /api/v1/tags                   # Create
PUT    /api/v1/tags/:id               # Update
DELETE /api/v1/tags/:id               # Delete
POST   /api/v1/tags/merge             # Merge tags
```

### Sources Module

```yaml
GET    /api/v1/sources                # List sources
GET    /api/v1/sources/:id            # Get source
POST   /api/v1/sources                # Create source
PUT    /api/v1/sources/:id            # Update source
DELETE /api/v1/sources/:id            # Delete source
POST   /api/v1/sources/:id/toggle     # Enable/disable
POST   /api/v1/sources/:id/fetch      # Manual fetch
GET    /api/v1/sources/:id/logs       # Fetch logs
GET    /api/v1/sources/:id/items      # Ingested items
```

### Ingestion Module

```yaml
GET    /api/v1/ingestion/items              # List ingested items
GET    /api/v1/ingestion/items/:id          # Get item
POST   /api/v1/ingestion/items/:id/publish  # Publish as article
POST   /api/v1/ingestion/items/:id/discard  # Discard
POST   /api/v1/ingestion/items/:id/reprocess # Reprocess with AI
GET    /api/v1/ingestion/stats              # Ingestion statistics
```

### AI Module

```yaml
POST   /api/v1/ai/summarize                 # Summarize text
POST   /api/v1/ai/generate-headline         # Generate headline
POST   /api/v1/ai/translate                 # Translate text
POST   /api/v1/ai/classify                  # Classify content
POST   /api/v1/ai/extract-entities          # Extract entities
POST   /api/v1/ai/preview-article           # Preview AI-enhanced article
GET    /api/v1/ai/jobs                      # List AI jobs
GET    /api/v1/ai/jobs/:id                  # Get job status
POST   /api/v1/ai/jobs/:id/cancel           # Cancel job
GET    /api/v1/ai/providers                 # List providers
PUT    /api/v1/ai/providers/:id             # Update provider config
```

### Analytics Module

```yaml
POST   /api/v1/analytics/track              # Track event
GET    /api/v1/analytics/overview           # Dashboard overview
GET    /api/v1/analytics/articles           # Article analytics
GET    /api/v1/analytics/articles/:id       # Single article analytics
GET    /api/v1/analytics/authors            # Author performance
GET    /api/v1/analytics/categories         # Category performance
GET    /api/v1/analytics/trending           # Trending articles
GET    /api/v1/analytics/realtime           # Real-time stats
POST   /api/v1/analytics/export             # Export report
```

### Media Module

```yaml
GET    /api/v1/media                        # List media
POST   /api/v1/media/upload                 # Upload file
POST   /api/v1/media/upload-url             # Upload from URL
GET    /api/v1/media/:id                    # Get media
PUT    /api/v1/media/:id                    # Update metadata
DELETE /api/v1/media/:id                    # Delete
GET    /api/v1/media/folders                # List folders
POST   /api/v1/media/folders                # Create folder
```

---

## 🚀 مراحل التنفيذ

### Phase 1: Foundation (أسبوع 1-2)

```
✅ إعداد المشروع:
   - NestJS scaffold
   - Prisma + PostgreSQL
   - Redis connection
   - Docker Compose
   - Environment configuration
   - Logging setup (Pino)

✅ Auth Module:
   - JWT + Refresh tokens
   - Register/Login/Logout
   - Password reset
   - Email verification (queue)

✅ Users Module:
   - CRUD operations
   - Profile management

✅ RBAC Module:
   - Roles & Permissions
   - Guards & Decorators
   - Seed default roles
```

### Phase 2: Content Core (أسبوع 3-4)

```
✅ Articles Module:
   - Full CRUD
   - Versioning
   - Publishing workflow
   - Scheduling
   - Translations

✅ Categories & Tags:
   - Hierarchical categories
   - Tag management
   - Auto-tagging preparation

✅ Media Module:
   - S3 upload
   - Image processing
   - Folder organization
```

### Phase 3: Ingestion & AI (أسبوع 5-6)

```
✅ Sources Module:
   - Source management
   - RSS fetcher
   - API fetcher
   - Basic crawler

✅ Ingestion Pipeline:
   - BullMQ queues
   - Deduplication
   - Content extraction
   - Scheduling

✅ AI Module:
   - Provider abstraction
   - Summarization
   - Headline generation
   - Translation
   - Classification
```

### Phase 4: Analytics & Polish (أسبوع 7-8)

```
✅ Analytics Module:
   - Event tracking
   - Aggregations
   - Dashboard APIs
   - Trending algorithm

✅ Audit & Notifications:
   - Audit logging
   - Email notifications
   - Push notifications setup

✅ Optimization:
   - Caching strategy
   - Query optimization
   - Rate limiting
   - API documentation
```

---

## ⚙️ Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/newsdb?schema=public

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Storage (S3)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=news-media
S3_REGION=us-east-1

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
DEEPSEEK_API_KEY=

# Email (SMTP)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=noreply@news.com

# Meilisearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Logging
LOG_LEVEL=debug
```

---

## 📝 ملاحظات مهمة للتنفيذ

### 1. الأمان:
- استخدم `bcrypt` للـ passwords
- شفّر الـ API keys في DB
- طبّق rate limiting
- استخدم CORS بشكل صحيح
- Validate كل الـ inputs
- استخدم Helmet

### 2. الأداء:
- استخدم indexes في DB
- طبّق caching ذكي
- استخدم pagination
- استخدم connection pooling
- طبّق lazy loading

### 3. القابلية للتوسع:
- صمم APIs stateless
- استخدم queues للعمليات الثقيلة
- جهّز للـ horizontal scaling
- فصل الـ concerns

### 4. الجودة:
- اكتب unit tests
- اكتب integration tests
- استخدم TypeScript strict
- طبّق ESLint + Prettier
- وثّق APIs بـ Swagger

---

## 🎯 أوامر البدء

```bash
# إنشاء المشروع
nest new news-backend
cd news-backend

# إضافة الـ dependencies الأساسية
npm install @nestjs/config @nestjs/passport @nestjs/jwt passport passport-jwt passport-local
npm install @prisma/client prisma
npm install ioredis @nestjs/bullmq bullmq
npm install class-validator class-transformer
npm install @nestjs/swagger swagger-ui-express
npm install bcrypt uuid slugify
npm install @nestjs/schedule
npm install pino pino-pretty nestjs-pino

# Dev dependencies
npm install -D @types/passport-jwt @types/passport-local @types/bcrypt

# إعداد Prisma
npx prisma init
# انسخ الـ schema أعلاه
npx prisma migrate dev --name init
npx prisma generate

# تشغيل
npm run start:dev
```

---

## ✅ Checklist للمراجعة

قبل اعتبار أي module مكتمل:

- [ ] Unit tests تغطي 80%+
- [ ] Integration tests للـ endpoints
- [ ] Swagger documentation
- [ ] Error handling
- [ ] Validation
- [ ] Logging
- [ ] Audit logging (للعمليات الحساسة)
- [ ] Rate limiting
- [ ] Caching (حيث يناسب)
- [ ] Permissions guards

---

هذا الـ Prompt جاهز للتنفيذ. ابدأ بـ Phase 1 وتقدم تدريجياً.