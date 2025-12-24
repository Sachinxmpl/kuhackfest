/*
  Warnings:

  - You are about to drop the column `isActive` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `meetLink` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `mentorId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `requestId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `avgRating` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `clerkId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `impactPoints` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `totalSessions` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Badge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HelpRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MentorApplication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectStat` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[beaconId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `beaconId` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `helperId` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BeaconType" AS ENUM ('NORMAL', 'URGENT');

-- CreateEnum
CREATE TYPE "BeaconStatus" AS ENUM ('OPEN', 'IN_SESSION', 'CLOSED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Badge" DROP CONSTRAINT "Badge_userId_fkey";

-- DropForeignKey
ALTER TABLE "HelpRequest" DROP CONSTRAINT "HelpRequest_learnerId_fkey";

-- DropForeignKey
ALTER TABLE "MentorApplication" DROP CONSTRAINT "MentorApplication_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "MentorApplication" DROP CONSTRAINT "MentorApplication_requestId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_requestId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectStat" DROP CONSTRAINT "SubjectStat_userId_fkey";

-- DropIndex
DROP INDEX "Session_requestId_key";

-- DropIndex
DROP INDEX "User_clerkId_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "isActive",
DROP COLUMN "meetLink",
DROP COLUMN "mentorId",
DROP COLUMN "requestId",
ADD COLUMN     "beaconId" TEXT NOT NULL,
ADD COLUMN     "helperId" TEXT NOT NULL,
ADD COLUMN     "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
DROP COLUMN "avgRating",
DROP COLUMN "bio",
DROP COLUMN "clerkId",
DROP COLUMN "impactPoints",
DROP COLUMN "name",
DROP COLUMN "totalSessions",
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- DropTable
DROP TABLE "Badge";

-- DropTable
DROP TABLE "HelpRequest";

-- DropTable
DROP TABLE "MentorApplication";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "SubjectStat";

-- DropEnum
DROP TYPE "RequestStatus";

-- DropEnum
DROP TYPE "RequestType";

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "interests" TEXT[],
    "skills" TEXT[],

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beacon" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "BeaconType" NOT NULL,
    "status" "BeaconStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Beacon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeaconApplication" (
    "id" TEXT NOT NULL,
    "beaconId" TEXT NOT NULL,
    "helperId" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT,

    CONSTRAINT "BeaconApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelperStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "helpCount" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "HelperStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Beacon_status_idx" ON "Beacon"("status");

-- CreateIndex
CREATE INDEX "Beacon_type_idx" ON "Beacon"("type");

-- CreateIndex
CREATE INDEX "BeaconApplication_beaconId_idx" ON "BeaconApplication"("beaconId");

-- CreateIndex
CREATE UNIQUE INDEX "BeaconApplication_beaconId_helperId_key" ON "BeaconApplication"("beaconId", "helperId");

-- CreateIndex
CREATE INDEX "Rating_toUserId_idx" ON "Rating"("toUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_sessionId_fromUserId_key" ON "Rating"("sessionId", "fromUserId");

-- CreateIndex
CREATE UNIQUE INDEX "HelperStats_userId_key" ON "HelperStats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_beaconId_key" ON "Session"("beaconId");

-- CreateIndex
CREATE INDEX "Session_learnerId_idx" ON "Session"("learnerId");

-- CreateIndex
CREATE INDEX "Session_helperId_idx" ON "Session"("helperId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beacon" ADD CONSTRAINT "Beacon_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeaconApplication" ADD CONSTRAINT "BeaconApplication_beaconId_fkey" FOREIGN KEY ("beaconId") REFERENCES "Beacon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeaconApplication" ADD CONSTRAINT "BeaconApplication_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_beaconId_fkey" FOREIGN KEY ("beaconId") REFERENCES "Beacon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelperStats" ADD CONSTRAINT "HelperStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
