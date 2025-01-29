/*
  Warnings:

  - You are about to alter the column `role` on the `invitation` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(3))`.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `invitation` MODIFY `role` ENUM('ORG_OWNER', 'ORG_ADMIN', 'ORG_USER') NOT NULL DEFAULT 'ORG_USER';

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ORG_OWNER', 'ORG_ADMIN', 'ORG_USER') NOT NULL DEFAULT 'ORG_USER';
