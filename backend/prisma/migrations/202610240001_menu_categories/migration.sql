-- AlterTable
ALTER TABLE `menu_items` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    MODIFY `category` VARCHAR(64) NOT NULL;

-- CreateTable
CREATE TABLE `menu_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(64) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `menu_categories_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Preserve existing category codes and seed defaults before adding the relation.
INSERT INTO `menu_categories` (`code`, `name`, `updatedAt`) VALUES
('APPETIZER', 'Appetizers', NOW()), ('MAIN_COURSE', 'Signature Mains', NOW()),
('SPECIAL', 'Chef Specials', NOW()), ('DESSERT', 'Desserts', NOW()), ('BEVERAGE', 'Beverages', NOW());
INSERT IGNORE INTO `menu_categories` (`code`, `name`, `updatedAt`)
SELECT DISTINCT `category`, `category`, NOW() FROM `menu_items`;

-- AddForeignKey
ALTER TABLE `menu_items` ADD CONSTRAINT `menu_items_category_fkey` FOREIGN KEY (`category`) REFERENCES `menu_categories`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

