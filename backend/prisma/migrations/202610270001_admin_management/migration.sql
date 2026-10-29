-- Add persisted admin replies to contact messages.
ALTER TABLE `contact_messages`
    ADD COLUMN `reply` TEXT NULL,
    ADD COLUMN `repliedAt` DATETIME(3) NULL;

-- Store the single set of public restaurant contact and map details.
CREATE TABLE `restaurant_settings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(500) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `mapUrl` VARCHAR(1000) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `restaurant_settings` (`id`, `name`, `address`, `email`, `phone`, `mapUrl`, `updatedAt`)
VALUES (
    1,
    'FUCHSIUS Culinary Hearth',
    '44 Ironwood Pavilion, Galle Fort, Southern Province, Sri Lanka',
    'reservations@fuchsius.com',
    '+94 (91) 458 8900',
    NULL,
    NOW()
);
