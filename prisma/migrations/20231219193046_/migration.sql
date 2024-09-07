/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Client_id_key` ON `Client`;

-- AlterTable
ALTER TABLE `Session_whatsapp` MODIFY `init` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Client_phone_key` ON `Client`(`phone`);
