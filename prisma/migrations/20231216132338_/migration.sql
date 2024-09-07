/*
  Warnings:

  - You are about to drop the column `group` on the `Produto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Produto` DROP COLUMN `group`;

-- CreateTable
CREATE TABLE `Group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `produto_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
