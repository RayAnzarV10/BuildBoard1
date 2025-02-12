/*
  Warnings:

  - You are about to drop the column `totalExpenses` on the `project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `totalExpenses`,
    ADD COLUMN `totalExpense` DECIMAL(65, 30) NOT NULL DEFAULT 0;
