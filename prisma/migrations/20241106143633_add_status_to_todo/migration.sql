/*
  Warnings:

  - You are about to drop the column `importance` on the `todo` table. All the data in the column will be lost.
  - You are about to alter the column `dueDate` on the `todo` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `todo` DROP COLUMN `importance`,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'Open',
    MODIFY `dueDate` DATETIME NULL;
