/*
  Warnings:

  - You are about to drop the `_ProdutoToVenda` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_ProdutoToVenda` DROP FOREIGN KEY `_ProdutoToVenda_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ProdutoToVenda` DROP FOREIGN KEY `_ProdutoToVenda_B_fkey`;

-- DropTable
DROP TABLE `_ProdutoToVenda`;

-- CreateTable
CREATE TABLE `Produto_Venda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantidade` INTEGER NOT NULL,
    `valor` DOUBLE NOT NULL,
    `produto_id` INTEGER NOT NULL,
    `venda_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Produto_Venda` ADD CONSTRAINT `Produto_Venda_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto_Venda` ADD CONSTRAINT `Produto_Venda_venda_id_fkey` FOREIGN KEY (`venda_id`) REFERENCES `Venda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
