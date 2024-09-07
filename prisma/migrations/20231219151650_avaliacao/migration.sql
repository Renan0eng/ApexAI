-- CreateTable
CREATE TABLE `Session_whatsapp` (
    `id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NULL,
    `whatsapp_client_id` INTEGER NULL,
    `init` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NULL,
    `ia_config_id` VARCHAR(191) NOT NULL,
    `clien_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Session_whatsapp_id_key`(`id`),
    INDEX `Session_whatsapp_client_id_idx`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Client_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session_whatsapp` ADD CONSTRAINT `Session_whatsapp_ia_config_id_fkey` FOREIGN KEY (`ia_config_id`) REFERENCES `AIConfig`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session_whatsapp` ADD CONSTRAINT `Session_whatsapp_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session_whatsapp` ADD CONSTRAINT `Session_whatsapp_whatsapp_client_id_fkey` FOREIGN KEY (`whatsapp_client_id`) REFERENCES `WhatsappClient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
