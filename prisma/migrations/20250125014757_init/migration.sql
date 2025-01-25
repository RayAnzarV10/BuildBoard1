-- CreateTable
CREATE TABLE `Organization` (
    `id` VARCHAR(191) NOT NULL,
    `connectAccountId` VARCHAR(191) NULL DEFAULT '',
    `customerId` VARCHAR(191) NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL,
    `logo` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `email` TEXT NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `primary_color` VARCHAR(191) NOT NULL DEFAULT '#FFFFFFF',
    `zipCode` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `whiteLabel` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `teammembers` VARCHAR(191) NOT NULL,
    `financingType` TEXT NOT NULL,
    `productsAndServices` TEXT NOT NULL,
    `pains` TEXT NOT NULL,
    `expectations` TEXT NOT NULL,
    `paymentMethods` TEXT NOT NULL,

    INDEX `Organization_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaExpense` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `link` VARCHAR(191) NOT NULL,
    `expenseId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MediaExpense_link_key`(`link`),
    INDEX `MediaExpense_expenseId_idx`(`expenseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaIncome` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `link` VARCHAR(191) NOT NULL,
    `incomeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MediaIncome_link_key`(`link`),
    INDEX `MediaIncome_incomeId_idx`(`incomeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AddOns` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `priceId` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NULL,

    UNIQUE INDEX `AddOns_priceId_key`(`priceId`),
    INDEX `AddOns_orgId_idx`(`orgId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `notification` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Notification_orgId_idx`(`orgId`),
    INDEX `Notification_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `plan` ENUM('price_1OYxkqFj9oKEERu1NbKUxXxN', 'price_1OYxkqFj9oKEERu1KfJGWxgN') NULL,
    `price` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `priceId` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `currentPeriodEndDate` DATETIME(3) NOT NULL,
    `subscritiptionId` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NULL,

    UNIQUE INDEX `Subscription_subscritiptionId_key`(`subscritiptionId`),
    UNIQUE INDEX `Subscription_orgId_key`(`orgId`),
    INDEX `Subscription_customerId_idx`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `avatarUrl` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `role` ENUM('ORG_OWNER', 'ORG_ADMIN', 'SUBACCOUNT_USER', 'SUBACCOUNT_GUEST') NOT NULL DEFAULT 'SUBACCOUNT_USER',
    `orgId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_orgId_idx`(`orgId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permissions` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `access` BOOLEAN NOT NULL,

    INDEX `Permissions_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invitation` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `status` ENUM('ACCEPTED', 'REVOKED', 'PENDING') NOT NULL DEFAULT 'PENDING',
    `role` ENUM('ORG_OWNER', 'ORG_ADMIN', 'SUBACCOUNT_USER', 'SUBACCOUNT_GUEST') NOT NULL DEFAULT 'SUBACCOUNT_USER',

    UNIQUE INDEX `Invitation_email_key`(`email`),
    INDEX `Invitation_orgId_idx`(`orgId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `number` INTEGER NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` ENUM('Planning', 'In_Progress', 'Completed') NOT NULL,
    `location` TEXT NOT NULL,
    `est_completion` DATETIME(3) NOT NULL,
    `budget` DOUBLE NOT NULL,
    `description` TEXT NOT NULL,

    INDEX `Project_orgId_idx`(`orgId`),
    UNIQUE INDEX `Project_orgId_number_key`(`orgId`, `number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `adress` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,

    INDEX `Client_orgId_idx`(`orgId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `adress` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,

    INDEX `Supplier_orgId_idx`(`orgId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Income` (
    `id` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `tax` DOUBLE NOT NULL,
    `description` TEXT NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `exchangeRate` DOUBLE NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `inv_number` VARCHAR(191) NULL,

    INDEX `Income_projectId_idx`(`projectId`),
    INDEX `Income_clientId_idx`(`clientId`),
    INDEX `Income_orgId_idx`(`orgId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `id` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `supplierId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `rfc` TEXT NULL,
    `amount` DOUBLE NOT NULL,
    `description` TEXT NOT NULL,
    `tax1` DOUBLE NOT NULL,
    `tax2` DOUBLE NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `exchangeRate` DOUBLE NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `inv_number` VARCHAR(191) NULL,
    `recurrence` VARCHAR(191) NULL,

    INDEX `Expense_projectId_idx`(`projectId`),
    INDEX `Expense_supplierId_idx`(`supplierId`),
    INDEX `Expense_orgId_idx`(`orgId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
