-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'EDITOR') NOT NULL DEFAULT 'EDITOR',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `village_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description_id` TEXT NOT NULL,
    `description_en` TEXT NOT NULL,
    `vision_id` TEXT NOT NULL,
    `vision_en` TEXT NOT NULL,
    `mission_id` TEXT NOT NULL,
    `mission_en` TEXT NOT NULL,
    `history_id` TEXT NOT NULL,
    `history_en` TEXT NOT NULL,
    `hero_video_url` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `population` INTEGER NULL,
    `area` DOUBLE NULL,
    `social_media` JSON NULL,
    `footer_description_id` TEXT NULL,
    `footer_description_en` TEXT NULL,
    `copyright_id` VARCHAR(191) NULL,
    `copyright_en` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mission_items` (
    `id` VARCHAR(191) NOT NULL,
    `text_id` TEXT NOT NULL,
    `text_en` TEXT NOT NULL,
    `order` INTEGER NOT NULL,
    `profile_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization_members` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `position_id` VARCHAR(191) NOT NULL,
    `position_en` VARCHAR(191) NOT NULL,
    `photo_url` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL,
    `profile_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `name_id` VARCHAR(191) NOT NULL,
    `name_en` VARCHAR(191) NOT NULL,
    `description_id` TEXT NOT NULL,
    `description_en` TEXT NOT NULL,
    `category` ENUM('UMKM', 'WISATA', 'PERTANIAN', 'KERAJINAN', 'KULINER') NOT NULL,
    `price` DOUBLE NULL,
    `unit` VARCHAR(191) NULL,
    `image_url` VARCHAR(191) NULL,
    `store_image_url` VARCHAR(191) NULL,
    `production_image_url` VARCHAR(191) NULL,
    `gallery` JSON NULL,
    `contact` VARCHAR(191) NULL,
    `location_url` TEXT NULL,
    `specifications_id` TEXT NULL,
    `specifications_en` TEXT NULL,
    `is_potential` BOOLEAN NOT NULL DEFAULT false,
    `investment_required` DOUBLE NULL,
    `investment_details_id` TEXT NULL,
    `investment_details_en` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `products_category_idx`(`category`),
    INDEX `products_is_active_idx`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_records` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `type` ENUM('INCOME', 'EXPENSE') NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `category_en` VARCHAR(191) NOT NULL,
    `subcategory_id` VARCHAR(191) NULL,
    `subcategory_en` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `budget` DOUBLE NULL,
    `source_id` VARCHAR(191) NULL,
    `source_en` VARCHAR(191) NULL,
    `description_id` TEXT NULL,
    `description_en` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `finance_records_year_idx`(`year`),
    INDEX `finance_records_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `map_features` (
    `id` VARCHAR(191) NOT NULL,
    `name_id` VARCHAR(191) NOT NULL,
    `name_en` VARCHAR(191) NOT NULL,
    `type` ENUM('BOUNDARY', 'POI', 'ROAD', 'FACILITY') NOT NULL,
    `icon` VARCHAR(191) NULL,
    `geometry` JSON NOT NULL,
    `properties` JSON NULL,
    `description_id` TEXT NULL,
    `description_en` TEXT NULL,
    `is_visible` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `map_features_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `id` VARCHAR(191) NOT NULL,
    `title_id` VARCHAR(191) NOT NULL,
    `title_en` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `content_id` TEXT NOT NULL,
    `content_en` TEXT NOT NULL,
    `excerpt_id` VARCHAR(191) NULL,
    `excerpt_en` VARCHAR(191) NULL,
    `cover_image_url` VARCHAR(191) NULL,
    `category` ENUM('PENGUMUMAN', 'KEGIATAN', 'PEMBANGUNAN', 'UMUM') NOT NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `author_id` VARCHAR(191) NOT NULL,
    `published_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `news_slug_key`(`slug`),
    INDEX `news_category_idx`(`category`),
    INDEX `news_is_published_idx`(`is_published`),
    INDEX `news_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gallery_items` (
    `id` VARCHAR(191) NOT NULL,
    `title_id` VARCHAR(191) NOT NULL,
    `title_en` VARCHAR(191) NOT NULL,
    `description_id` VARCHAR(191) NULL,
    `description_en` VARCHAR(191) NULL,
    `type` ENUM('PHOTO', 'VIDEO') NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `thumbnail_url` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `gallery_items_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `digital_materials` (
    `id` VARCHAR(191) NOT NULL,
    `title_id` VARCHAR(191) NOT NULL,
    `title_en` VARCHAR(191) NOT NULL,
    `description_id` TEXT NULL,
    `description_en` TEXT NULL,
    `category` ENUM('PENDIDIKAN', 'KESEHATAN', 'PERTANIAN', 'TEKNOLOGI', 'UMUM') NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `file_type` ENUM('PDF', 'DOC', 'VIDEO', 'IMAGE', 'OTHER') NOT NULL,
    `file_size` INTEGER NOT NULL,
    `file_name` VARCHAR(191) NOT NULL,
    `thumbnail_url` VARCHAR(191) NULL,
    `download_count` INTEGER NOT NULL DEFAULT 0,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `digital_materials_category_idx`(`category`),
    INDEX `digital_materials_file_type_idx`(`file_type`),
    INDEX `digital_materials_is_published_idx`(`is_published`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mission_items` ADD CONSTRAINT `mission_items_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `village_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_members` ADD CONSTRAINT `organization_members_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `village_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `news_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
