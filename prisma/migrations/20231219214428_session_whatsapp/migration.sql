-- DropIndex
DROP INDEX `Session_whatsapp_id_key` ON `Session_whatsapp`;

-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(191) NOT NULL,
    `session_whatsapp_id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Message_session_whatsapp_id_idx`(`session_whatsapp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_session_whatsapp_id_fkey` FOREIGN KEY (`session_whatsapp_id`) REFERENCES `Session_whatsapp`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
