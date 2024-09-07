/*
  Warnings:

  - Added the required column `group` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Produto` ADD COLUMN `group` VARCHAR(191) NOT NULL;
