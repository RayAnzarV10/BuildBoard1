-- AlterTable
ALTER TABLE `project` ADD COLUMN `totalExpenses` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    ADD COLUMN `totalIncome` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    MODIFY `budget` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` MODIFY `amount` DECIMAL(65, 30) NOT NULL,
    MODIFY `exchangeRate` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `transactiontax` MODIFY `amount` DECIMAL(65, 30) NOT NULL;
