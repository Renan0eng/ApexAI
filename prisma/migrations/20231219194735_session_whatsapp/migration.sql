/*
  Warnings:

  - You are about to drop the column `clien_id` on the `Session_whatsapp` table. All the data in the column will be lost.
  - Made the column `client_id` on table `Session_whatsapp` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Session_whatsapp` DROP FOREIGN KEY `Session_whatsapp_client_id_fkey`;

-- AlterTable
ALTER TABLE `Session_whatsapp` DROP COLUMN `clien_id`,
    MODIFY `client_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Session_whatsapp` ADD CONSTRAINT `Session_whatsapp_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
