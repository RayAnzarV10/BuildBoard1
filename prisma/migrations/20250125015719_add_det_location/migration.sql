/*
  Warnings:

  - You are about to drop the column `primary_color` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the column `whiteLabel` on the `organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `organization` DROP COLUMN `primary_color`,
    DROP COLUMN `whiteLabel`;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `det_location` VARCHAR(191) NOT NULL DEFAULT '';
