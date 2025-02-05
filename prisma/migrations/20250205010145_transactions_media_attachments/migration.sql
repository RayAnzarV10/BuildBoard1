/*
  Warnings:

  - You are about to drop the `client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `expense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `income` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mediaexpense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mediaincome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `client`;

-- DropTable
DROP TABLE `expense`;

-- DropTable
DROP TABLE `income`;

-- DropTable
DROP TABLE `mediaexpense`;

-- DropTable
DROP TABLE `mediaincome`;

-- DropTable
DROP TABLE `supplier`;

-- CreateTable
CREATE TABLE `Party` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('CLIENT', 'SUPPLIER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `orgId` VARCHAR(191) NOT NULL,

    INDEX `Party_orgId_idx`(`orgId`),
    INDEX `Party_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('INCOME', 'EXPENSE') NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `partyId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `description` TEXT NOT NULL,
    `paymentMethod` ENUM('CASH', 'TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'OTHER') NOT NULL,
    `currency` ENUM('MXN', 'USD', 'EUR', 'OTHER') NOT NULL,
    `exchangeRate` DOUBLE NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NULL,
    `recurrence` VARCHAR(191) NULL,

    INDEX `Transaction_projectId_idx`(`projectId`),
    INDEX `Transaction_partyId_idx`(`partyId`),
    INDEX `Transaction_orgId_idx`(`orgId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransactionTax` (
    `id` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `rate` DOUBLE NOT NULL,
    `amount` DOUBLE NOT NULL,

    INDEX `TransactionTax_transactionId_idx`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaAttachment` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `s3Key` VARCHAR(191) NOT NULL,
    `size` INTEGER NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MediaAttachment_s3Key_key`(`s3Key`),
    INDEX `MediaAttachment_transactionId_idx`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
