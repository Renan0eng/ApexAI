/*
  Warnings:

  - You are about to drop the column `user_id` on the `Venda` table. All the data in the column will be lost.
  - Made the column `ai_config_id` on table `Cliente` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Cliente` DROP FOREIGN KEY `Cliente_ai_config_id_fkey`;

-- AlterTable
ALTER TABLE `Cliente` MODIFY `ai_config_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Venda` DROP COLUMN `user_id`;

-- CreateTable
CREATE TABLE `_ProdutoToVenda` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProdutoToVenda_AB_unique`(`A`, `B`),
    INDEX `_ProdutoToVenda_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_ai_config_id_fkey` FOREIGN KEY (`ai_config_id`) REFERENCES `AIConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProdutoToVenda` ADD CONSTRAINT `_ProdutoToVenda_A_fkey` FOREIGN KEY (`A`) REFERENCES `Produto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProdutoToVenda` ADD CONSTRAINT `_ProdutoToVenda_B_fkey` FOREIGN KEY (`B`) REFERENCES `Venda`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
