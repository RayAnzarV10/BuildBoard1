/*
  Warnings:

  - You are about to drop the column `adress` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `adress` on the `supplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `client` DROP COLUMN `adress`,
    ADD COLUMN `address` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `supplier` DROP COLUMN `adress`,
    ADD COLUMN `address` VARCHAR(191) NULL;
