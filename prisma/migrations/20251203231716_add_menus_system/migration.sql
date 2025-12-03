-- CreateEnum
CREATE TYPE "MenuItemType" AS ENUM ('CUSTOM', 'CATEGORY', 'TAG', 'ARTICLE', 'PAGE', 'DIVIDER', 'HEADING', 'DYNAMIC');

-- CreateTable
CREATE TABLE "menus" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "css_class" VARCHAR(200),
    "theme" VARCHAR(50),
    "created_by_id" UUID,
    "updated_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" UUID NOT NULL,
    "menu_id" UUID NOT NULL,
    "parent_id" UUID,
    "label" VARCHAR(200) NOT NULL,
    "label_ar" VARCHAR(200),
    "label_en" VARCHAR(200),
    "label_fr" VARCHAR(200),
    "type" "MenuItemType" NOT NULL,
    "target" VARCHAR(50),
    "url" VARCHAR(1000),
    "category_id" UUID,
    "tag_id" UUID,
    "article_id" UUID,
    "page_id" UUID,
    "icon" VARCHAR(100),
    "image_url" VARCHAR(500),
    "description" TEXT,
    "css_class" VARCHAR(200),
    "is_mega_menu" BOOLEAN NOT NULL DEFAULT false,
    "mega_menu_layout" VARCHAR(50),
    "mega_menu_content" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "show_on_mobile" BOOLEAN NOT NULL DEFAULT true,
    "show_on_desktop" BOOLEAN NOT NULL DEFAULT true,
    "display_conditions" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "seo_title" VARCHAR(200),
    "seo_description" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_locations" (
    "id" UUID NOT NULL,
    "menu_id" UUID NOT NULL,
    "location" VARCHAR(50) NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "conditions" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_revisions" (
    "id" UUID NOT NULL,
    "menu_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "changes" JSONB,
    "reason" VARCHAR(500),
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "menus_slug_key" ON "menus"("slug");

-- CreateIndex
CREATE INDEX "menus_slug_idx" ON "menus"("slug");

-- CreateIndex
CREATE INDEX "menus_is_active_idx" ON "menus"("is_active");

-- CreateIndex
CREATE INDEX "menu_items_menu_id_idx" ON "menu_items"("menu_id");

-- CreateIndex
CREATE INDEX "menu_items_parent_id_idx" ON "menu_items"("parent_id");

-- CreateIndex
CREATE INDEX "menu_items_sort_order_idx" ON "menu_items"("sort_order");

-- CreateIndex
CREATE INDEX "menu_items_is_active_idx" ON "menu_items"("is_active");

-- CreateIndex
CREATE INDEX "menu_locations_location_idx" ON "menu_locations"("location");

-- CreateIndex
CREATE INDEX "menu_locations_is_active_idx" ON "menu_locations"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "menu_locations_menu_id_location_key" ON "menu_locations"("menu_id", "location");

-- CreateIndex
CREATE INDEX "menu_revisions_menu_id_idx" ON "menu_revisions"("menu_id");

-- CreateIndex
CREATE INDEX "menu_revisions_created_at_idx" ON "menu_revisions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "menu_revisions_menu_id_version_key" ON "menu_revisions"("menu_id", "version");

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_locations" ADD CONSTRAINT "menu_locations_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_revisions" ADD CONSTRAINT "menu_revisions_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_revisions" ADD CONSTRAINT "menu_revisions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
