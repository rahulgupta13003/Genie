/*
  Warnings:

  - Added the required column `sandboxid` to the `Fragment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fragment" ADD COLUMN     "sandboxid" TEXT NOT NULL;
