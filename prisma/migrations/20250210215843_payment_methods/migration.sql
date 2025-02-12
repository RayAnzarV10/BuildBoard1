/*
  Warnings:

  - The values [CASH,TRANSFER,CREDIT_CARD,DEBIT_CARD,OTHER] on the enum `Transaction_paymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `orgId` to the `MediaAttachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mediaattachment` ADD COLUMN `orgId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` MODIFY `description` TEXT NULL,
    MODIFY `paymentMethod` ENUM('EFECTIVO', 'TRANSFERENCIA', 'TARJETA_CREDITO', 'TARJETA_DEBITO', 'TPV', 'CHEQUE') NOT NULL;

-- CreateIndex
CREATE INDEX `MediaAttachment_orgId_idx` ON `MediaAttachment`(`orgId`);
