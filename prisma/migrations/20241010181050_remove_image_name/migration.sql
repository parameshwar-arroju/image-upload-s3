/*
  Warnings:

  - You are about to drop the column `name` on the `images` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "images_name_idx";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "name";

-- CreateIndex
CREATE INDEX "images_id_idx" ON "images"("id");
