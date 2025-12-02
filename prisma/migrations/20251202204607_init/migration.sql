-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'BANNED', 'DELETED');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('STANDARD', 'BREAKING', 'ANALYSIS', 'OPINION', 'INVESTIGATION', 'INTERVIEW', 'LIVEBLOG', 'VIDEO', 'PODCAST', 'PHOTO_STORY');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('ORIGINAL', 'AGGREGATED', 'SYNDICATED', 'AI_ASSISTED', 'TRANSLATED', 'USER_GENERATED');

-- CreateEnum
CREATE TYPE "TranslationType" AS ENUM ('MANUAL', 'AI_GENERATED', 'AI_ASSISTED');

-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('GENERAL', 'PERSON', 'ORGANIZATION', 'LOCATION', 'EVENT', 'TOPIC');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "SourceTypeEnum" AS ENUM ('RSS', 'API', 'CRAWLER', 'SOCIAL', 'MANUAL');

-- CreateEnum
CREATE TYPE "IngestionStatus" AS ENUM ('NEW', 'PROCESSING', 'PROCESSED', 'PUBLISHED', 'DISCARDED', 'FAILED', 'DUPLICATE');

-- CreateEnum
CREATE TYPE "AIJobType" AS ENUM ('SUMMARIZE', 'GENERATE_HEADLINE', 'TRANSLATE', 'CLASSIFY', 'EXTRACT_ENTITIES', 'SENTIMENT_ANALYSIS', 'SEO_OPTIMIZE', 'FACT_CHECK');

-- CreateEnum
CREATE TYPE "AIJobStatus" AS ENUM ('PENDING', 'SCHEDULED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('PAGE_VIEW', 'ARTICLE_VIEW', 'ARTICLE_READ', 'ARTICLE_SHARE', 'ARTICLE_BOOKMARK', 'SEARCH', 'CLICK', 'SCROLL', 'VIDEO_PLAY', 'VIDEO_COMPLETE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'ARTICLE_PUBLISHED', 'ARTICLE_APPROVED', 'ARTICLE_REJECTED', 'COMMENT_REPLY', 'MENTION', 'BREAKING_NEWS');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'PUSH', 'SMS');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "display_name" VARCHAR(200),
    "avatar_url" VARCHAR(500),
    "bio" TEXT,
    "phone" VARCHAR(20),
    "locale" VARCHAR(10) NOT NULL DEFAULT 'ar',
    "timezone" VARCHAR(50) NOT NULL DEFAULT 'UTC',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "email_verified_at" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "last_login_ip" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "push_notifications" BOOLEAN NOT NULL DEFAULT true,
    "newsletter_subscribed" BOOLEAN NOT NULL DEFAULT false,
    "dark_mode" BOOLEAN NOT NULL DEFAULT false,
    "preferred_categories" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token" VARCHAR(500) NOT NULL,
    "user_agent" VARCHAR(500),
    "ip_address" VARCHAR(45),
    "device_type" VARCHAR(50),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "display_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "display_name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "module" VARCHAR(50) NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" UUID,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(300) NOT NULL,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "type" "ArticleType" NOT NULL DEFAULT 'STANDARD',
    "language" VARCHAR(10) NOT NULL DEFAULT 'ar',
    "title" VARCHAR(500) NOT NULL,
    "subtitle" VARCHAR(500),
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "content_html" TEXT,
    "content_json" JSONB,
    "cover_image_url" VARCHAR(500),
    "cover_image_alt" VARCHAR(300),
    "video_url" VARCHAR(500),
    "gallery_images" JSONB,
    "reading_time" INTEGER,
    "word_count" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_breaking" BOOLEAN NOT NULL DEFAULT false,
    "allow_comments" BOOLEAN NOT NULL DEFAULT true,
    "source_type" "SourceType" NOT NULL DEFAULT 'ORIGINAL',
    "source_url" VARCHAR(1000),
    "source_name" VARCHAR(200),
    "source_ref" VARCHAR(200),
    "seo_title" VARCHAR(70),
    "seo_description" VARCHAR(160),
    "seo_keywords" TEXT[],
    "canonical_url" VARCHAR(500),
    "published_at" TIMESTAMP(3),
    "scheduled_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "author_id" UUID NOT NULL,
    "editor_id" UUID,
    "ingested_item_id" UUID,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_versions" (
    "id" UUID NOT NULL,
    "article_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "content" TEXT NOT NULL,
    "changes" JSONB,
    "reason" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" UUID NOT NULL,

    CONSTRAINT "article_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_translations" (
    "id" UUID NOT NULL,
    "article_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "subtitle" VARCHAR(500),
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "seo_title" VARCHAR(70),
    "seo_description" VARCHAR(160),
    "translation_type" "TranslationType" NOT NULL DEFAULT 'MANUAL',
    "is_reviewed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "related_articles" (
    "from_article_id" UUID NOT NULL,
    "to_article_id" UUID NOT NULL,
    "relevance_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_manual" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "related_articles_pkey" PRIMARY KEY ("from_article_id","to_article_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "name_ar" VARCHAR(100),
    "name_fr" VARCHAR(100),
    "name_en" VARCHAR(100),
    "description" TEXT,
    "color" VARCHAR(20),
    "icon" VARCHAR(50),
    "cover_image" VARCHAR(500),
    "parent_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "seo_title" VARCHAR(70),
    "seo_description" VARCHAR(160),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "name_ar" VARCHAR(100),
    "name_fr" VARCHAR(100),
    "name_en" VARCHAR(100),
    "type" "TagType" NOT NULL DEFAULT 'GENERAL',
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_categories" (
    "article_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_categories_pkey" PRIMARY KEY ("article_id","category_id")
);

-- CreateTable
CREATE TABLE "article_tags" (
    "article_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_tags_pkey" PRIMARY KEY ("article_id","tag_id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "type" "MediaType" NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "url" VARCHAR(1000) NOT NULL,
    "thumbnail_url" VARCHAR(1000),
    "alt" VARCHAR(300),
    "caption" TEXT,
    "credit" VARCHAR(200),
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "metadata" JSONB,
    "folder_id" UUID,
    "uploaded_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_folders" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "parent_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "type" "SourceTypeEnum" NOT NULL,
    "base_url" VARCHAR(500) NOT NULL,
    "feed_url" VARCHAR(500),
    "api_endpoint" VARCHAR(500),
    "api_key" VARCHAR(500),
    "language" VARCHAR(10) NOT NULL DEFAULT 'ar',
    "country" VARCHAR(5),
    "logo_url" VARCHAR(500),
    "description" TEXT,
    "trust_score" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "fetch_interval" INTEGER NOT NULL DEFAULT 300,
    "last_fetched_at" TIMESTAMP(3),
    "last_success_at" TIMESTAMP(3),
    "consecutive_errors" INTEGER NOT NULL DEFAULT 0,
    "config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingested_items" (
    "id" UUID NOT NULL,
    "source_id" UUID NOT NULL,
    "external_id" VARCHAR(500) NOT NULL,
    "external_url" VARCHAR(1000) NOT NULL,
    "status" "IngestionStatus" NOT NULL DEFAULT 'NEW',
    "raw_title" TEXT NOT NULL,
    "raw_content" TEXT,
    "raw_html" TEXT,
    "raw_excerpt" TEXT,
    "raw_author" VARCHAR(200),
    "raw_image_url" VARCHAR(1000),
    "raw_published_at" TIMESTAMP(3),
    "raw_categories" TEXT[],
    "raw_tags" TEXT[],
    "raw_metadata" JSONB,
    "content_hash" VARCHAR(64),
    "is_duplicate" BOOLEAN NOT NULL DEFAULT false,
    "duplicate_of_id" UUID,
    "quality_score" DOUBLE PRECISION,
    "relevance_score" DOUBLE PRECISION,
    "ai_summary" TEXT,
    "ai_headline" VARCHAR(500),
    "ai_categories" TEXT[],
    "ai_tags" TEXT[],
    "ai_sentiment" VARCHAR(20),
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingested_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingestion_logs" (
    "id" UUID NOT NULL,
    "source_id" UUID NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "fetched_count" INTEGER NOT NULL DEFAULT 0,
    "new_count" INTEGER NOT NULL DEFAULT 0,
    "duplicate_count" INTEGER NOT NULL DEFAULT 0,
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingestion_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_jobs" (
    "id" UUID NOT NULL,
    "type" "AIJobType" NOT NULL,
    "status" "AIJobStatus" NOT NULL DEFAULT 'PENDING',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "target_type" VARCHAR(50) NOT NULL,
    "target_id" UUID NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "model" VARCHAR(100),
    "input_payload" JSONB,
    "output_result" JSONB,
    "tokens_used" INTEGER,
    "cost_cents" INTEGER,
    "processing_ms" INTEGER,
    "error_message" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "max_retries" INTEGER NOT NULL DEFAULT 3,
    "scheduled_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_providers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "display_name" VARCHAR(100) NOT NULL,
    "api_key_enc" VARCHAR(500),
    "base_url" VARCHAR(500),
    "models" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "rate_limit_rpm" INTEGER,
    "rate_limit_tpd" INTEGER,
    "config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" UUID NOT NULL,
    "type" "EventType" NOT NULL,
    "session_id" UUID,
    "user_id" UUID,
    "article_id" UUID,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "referer" VARCHAR(500),
    "country" VARCHAR(5),
    "city" VARCHAR(100),
    "device_type" VARCHAR(20),
    "browser" VARCHAR(50),
    "os" VARCHAR(50),
    "metadata" JSONB,
    "duration" INTEGER,
    "scroll_depth" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_analytics" (
    "id" UUID NOT NULL,
    "article_id" UUID NOT NULL,
    "views_total" INTEGER NOT NULL DEFAULT 0,
    "views_today" INTEGER NOT NULL DEFAULT 0,
    "views_week" INTEGER NOT NULL DEFAULT 0,
    "views_month" INTEGER NOT NULL DEFAULT 0,
    "unique_visitors" INTEGER NOT NULL DEFAULT 0,
    "shares_total" INTEGER NOT NULL DEFAULT 0,
    "bookmarks_total" INTEGER NOT NULL DEFAULT 0,
    "comments_total" INTEGER NOT NULL DEFAULT 0,
    "avg_read_time" DOUBLE PRECISION,
    "avg_scroll_depth" DOUBLE PRECISION,
    "bounce_rate" DOUBLE PRECISION,
    "shares_facebook" INTEGER NOT NULL DEFAULT 0,
    "shares_twitter" INTEGER NOT NULL DEFAULT 0,
    "shares_whatsapp" INTEGER NOT NULL DEFAULT 0,
    "shares_linkedin" INTEGER NOT NULL DEFAULT 0,
    "trending_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "peak_hour" INTEGER,
    "last_calculated_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'IN_APP',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" UUID NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "value" JSONB NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "group" VARCHAR(50) NOT NULL,
    "label" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refresh_token_key" ON "sessions"("refresh_token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_refresh_token_idx" ON "sessions"("refresh_token");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE INDEX "roles_name_idx" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE INDEX "permissions_module_idx" ON "permissions"("module");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_module_action_key" ON "permissions"("module", "action");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_ingested_item_id_key" ON "articles"("ingested_item_id");

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_idx" ON "articles"("status");

-- CreateIndex
CREATE INDEX "articles_language_idx" ON "articles"("language");

-- CreateIndex
CREATE INDEX "articles_author_id_idx" ON "articles"("author_id");

-- CreateIndex
CREATE INDEX "articles_published_at_idx" ON "articles"("published_at");

-- CreateIndex
CREATE INDEX "articles_created_at_idx" ON "articles"("created_at");

-- CreateIndex
CREATE INDEX "articles_type_idx" ON "articles"("type");

-- CreateIndex
CREATE INDEX "articles_is_pinned_is_featured_idx" ON "articles"("is_pinned", "is_featured");

-- CreateIndex
CREATE INDEX "article_versions_article_id_idx" ON "article_versions"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "article_versions_article_id_version_key" ON "article_versions"("article_id", "version");

-- CreateIndex
CREATE INDEX "article_translations_article_id_idx" ON "article_translations"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "article_translations_article_id_language_key" ON "article_translations"("article_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE INDEX "categories_is_active_idx" ON "categories"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_slug_idx" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_type_idx" ON "tags"("type");

-- CreateIndex
CREATE INDEX "tags_usage_count_idx" ON "tags"("usage_count");

-- CreateIndex
CREATE INDEX "media_assets_type_idx" ON "media_assets"("type");

-- CreateIndex
CREATE INDEX "media_assets_folder_id_idx" ON "media_assets"("folder_id");

-- CreateIndex
CREATE INDEX "media_assets_created_at_idx" ON "media_assets"("created_at");

-- CreateIndex
CREATE INDEX "media_folders_parent_id_idx" ON "media_folders"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "sources_slug_key" ON "sources"("slug");

-- CreateIndex
CREATE INDEX "sources_type_idx" ON "sources"("type");

-- CreateIndex
CREATE INDEX "sources_is_active_idx" ON "sources"("is_active");

-- CreateIndex
CREATE INDEX "sources_language_idx" ON "sources"("language");

-- CreateIndex
CREATE INDEX "ingested_items_status_idx" ON "ingested_items"("status");

-- CreateIndex
CREATE INDEX "ingested_items_content_hash_idx" ON "ingested_items"("content_hash");

-- CreateIndex
CREATE INDEX "ingested_items_fetched_at_idx" ON "ingested_items"("fetched_at");

-- CreateIndex
CREATE UNIQUE INDEX "ingested_items_source_id_external_id_key" ON "ingested_items"("source_id", "external_id");

-- CreateIndex
CREATE INDEX "ingestion_logs_source_id_idx" ON "ingestion_logs"("source_id");

-- CreateIndex
CREATE INDEX "ingestion_logs_started_at_idx" ON "ingestion_logs"("started_at");

-- CreateIndex
CREATE INDEX "ai_jobs_type_idx" ON "ai_jobs"("type");

-- CreateIndex
CREATE INDEX "ai_jobs_status_idx" ON "ai_jobs"("status");

-- CreateIndex
CREATE INDEX "ai_jobs_target_type_target_id_idx" ON "ai_jobs"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "ai_jobs_scheduled_at_idx" ON "ai_jobs"("scheduled_at");

-- CreateIndex
CREATE UNIQUE INDEX "ai_providers_name_key" ON "ai_providers"("name");

-- CreateIndex
CREATE INDEX "analytics_events_type_idx" ON "analytics_events"("type");

-- CreateIndex
CREATE INDEX "analytics_events_article_id_idx" ON "analytics_events"("article_id");

-- CreateIndex
CREATE INDEX "analytics_events_session_id_idx" ON "analytics_events"("session_id");

-- CreateIndex
CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "article_analytics_article_id_key" ON "article_analytics"("article_id");

-- CreateIndex
CREATE INDEX "article_analytics_views_total_idx" ON "article_analytics"("views_total");

-- CreateIndex
CREATE INDEX "article_analytics_trending_score_idx" ON "article_analytics"("trending_score");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE INDEX "settings_group_idx" ON "settings"("group");

-- CreateIndex
CREATE INDEX "settings_is_public_idx" ON "settings"("is_public");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_editor_id_fkey" FOREIGN KEY ("editor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_ingested_item_id_fkey" FOREIGN KEY ("ingested_item_id") REFERENCES "ingested_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_versions" ADD CONSTRAINT "article_versions_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_versions" ADD CONSTRAINT "article_versions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_translations" ADD CONSTRAINT "article_translations_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "related_articles" ADD CONSTRAINT "related_articles_from_article_id_fkey" FOREIGN KEY ("from_article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "related_articles" ADD CONSTRAINT "related_articles_to_article_id_fkey" FOREIGN KEY ("to_article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_categories" ADD CONSTRAINT "article_categories_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_categories" ADD CONSTRAINT "article_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "media_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_folders" ADD CONSTRAINT "media_folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "media_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingested_items" ADD CONSTRAINT "ingested_items_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingestion_logs" ADD CONSTRAINT "ingestion_logs_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_jobs" ADD CONSTRAINT "ai_jobs_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "ingested_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_analytics" ADD CONSTRAINT "article_analytics_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
