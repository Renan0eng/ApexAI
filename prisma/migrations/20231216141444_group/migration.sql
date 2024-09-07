/*
  Warnings:

  - You are about to drop the column `produto_id` on the `Group` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Group` DROP FOREIGN KEY `Group_produto_id_fkey`;

-- AlterTable
ALTER TABLE `Group` DROP COLUMN `produto_id`;

-- CreateTable
CREATE TABLE `_GroupToProduto` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GroupToProduto_AB_unique`(`A`, `B`),
    INDEX `_GroupToProduto_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_GroupToProduto` ADD CONSTRAINT `_GroupToProduto_A_fkey` FOREIGN KEY (`A`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GroupToProduto` ADD CONSTRAINT `_GroupToProduto_B_fkey` FOREIGN KEY (`B`) REFERENCES `Produto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
