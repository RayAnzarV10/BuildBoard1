-- AlterTable
ALTER TABLE `project` ADD COLUMN `clientId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Project_clientId_idx` ON `Project`(`clientId`);
