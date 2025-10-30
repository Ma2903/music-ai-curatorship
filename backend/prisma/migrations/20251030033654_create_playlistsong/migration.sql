-- CreateTable
CREATE TABLE "PlaylistSong" (
    "id" SERIAL NOT NULL,
    "playlistId" INTEGER NOT NULL,
    "jamendoSongId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "songTitle" TEXT NOT NULL,
    "songArtist" TEXT NOT NULL,
    "songAlbum" TEXT NOT NULL,
    "songDuration" TEXT NOT NULL,
    "songImageUrl" TEXT,
    "songAudioUrl" TEXT,

    CONSTRAINT "PlaylistSong_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlaylistSong_playlistId_idx" ON "PlaylistSong"("playlistId");

-- CreateIndex
CREATE INDEX "PlaylistSong_jamendoSongId_idx" ON "PlaylistSong"("jamendoSongId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistSong_playlistId_jamendoSongId_key" ON "PlaylistSong"("playlistId", "jamendoSongId");

-- AddForeignKey
ALTER TABLE "PlaylistSong" ADD CONSTRAINT "PlaylistSong_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
