CREATE TABLE `menu_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `menu_categories_name_key`(`name`),
    UNIQUE INDEX `menu_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `menu_categories` (`name`, `slug`, `updatedAt`) VALUES
    ('Appetizer', 'APPETIZER', CURRENT_TIMESTAMP(3)),
    ('Main Course', 'MAIN_COURSE', CURRENT_TIMESTAMP(3)),
    ('Dessert', 'DESSERT', CURRENT_TIMESTAMP(3)),
    ('Beverage', 'BEVERAGE', CURRENT_TIMESTAMP(3)),
    ('Special', 'SPECIAL', CURRENT_TIMESTAMP(3));

ALTER TABLE `menu_items` ADD COLUMN `categoryId` INTEGER NULL;

UPDATE `menu_items` AS item
JOIN `menu_categories` AS category ON category.`slug` = item.`category`
SET item.`categoryId` = category.`id`;

ALTER TABLE `menu_items` MODIFY `categoryId` INTEGER NOT NULL;
ALTER TABLE `menu_items` DROP COLUMN `category`;
CREATE INDEX `menu_items_categoryId_idx` ON `menu_items`(`categoryId`);
ALTER TABLE `menu_items` ADD CONSTRAINT `menu_items_categoryId_fkey`
    FOREIGN KEY (`categoryId`) REFERENCES `menu_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
