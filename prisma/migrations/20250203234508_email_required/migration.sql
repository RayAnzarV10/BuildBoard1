/*
  Warnings:

  - Made the column `email` on table `client` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `client` MODIFY `description` TEXT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL;
