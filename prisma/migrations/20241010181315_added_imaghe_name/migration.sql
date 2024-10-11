-- DropIndex
DROP INDEX "images_id_idx";

-- AlterTable
ALTER TABLE "images" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Untitled';

-- CreateIndex
CREATE INDEX "images_name_idx" ON "images"("name");
