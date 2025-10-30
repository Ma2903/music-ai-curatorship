/*
  Warnings:

  - You are about to drop the column `songId` on the `HistoryEntry` table. All the data in the column will be lost.
  - You are about to drop the `PlaylistSong` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Song` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jamendoSongId` to the `HistoryEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `songArtist` to the `HistoryEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `songTitle` to the `HistoryEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."HistoryEntry" DROP CONSTRAINT "HistoryEntry_songId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PlaylistSong" DROP CONSTRAINT "PlaylistSong_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PlaylistSong" DROP CONSTRAINT "PlaylistSong_songId_fkey";

-- DropIndex
DROP INDEX "public"."HistoryEntry_songId_idx";

-- AlterTable
ALTER TABLE "HistoryEntry" DROP COLUMN "songId",
ADD COLUMN     "jamendoSongId" TEXT NOT NULL,
ADD COLUMN     "songArtist" TEXT NOT NULL,
ADD COLUMN     "songGenre" TEXT,
ADD COLUMN     "songMood" TEXT,
ADD COLUMN     "songTitle" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."PlaylistSong";

-- DropTable
DROP TABLE "public"."Song";

-- CreateIndex
CREATE INDEX "HistoryEntry_jamendoSongId_idx" ON "HistoryEntry"("jamendoSongId");
