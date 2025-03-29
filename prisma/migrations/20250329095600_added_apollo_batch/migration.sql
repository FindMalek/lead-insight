-- CreateEnum
CREATE TYPE "import_type" AS ENUM ('APOLLO_INSTAGRAM_LEADS');

-- CreateEnum
CREATE TYPE "batch_status" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "lead_status" AS ENUM ('NEW', 'CONTACTED', 'RESPONDED', 'QUALIFIED', 'DISQUALIFIED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "upload_status" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "job_status" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "log_level" AS ENUM ('INFO', 'WARNING', 'ERROR', 'DEBUG');

-- CreateTable
CREATE TABLE "instagram_batch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fileName" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "errorMessage" TEXT,
    "status" "batch_status" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "instagram_batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instagram_lead" (
    "id" TEXT NOT NULL,
    "profileUrl" TEXT NOT NULL,
    "profileName" TEXT NOT NULL,
    "fullName" TEXT,
    "bio" TEXT,
    "instagramId" TEXT,
    "imageUrl" TEXT,
    "followersCount" DOUBLE PRECISION,
    "followingCount" DOUBLE PRECISION,
    "postsCount" DOUBLE PRECISION,
    "mutualFollowersCount" DOUBLE PRECISION,
    "isBusinessAccount" BOOLEAN,
    "isPrivate" BOOLEAN,
    "isVerified" BOOLEAN,
    "joinedRecently" BOOLEAN,
    "category" TEXT,
    "businessCategory" TEXT,
    "businessStreetAddress" TEXT,
    "businessZipCode" TEXT,
    "businessCity" TEXT,
    "website" TEXT,
    "email" TEXT,
    "alternativeEmail" TEXT,
    "phoneNumber" TEXT,
    "snapchat" TEXT,
    "blockedByViewer" BOOLEAN,
    "followedByViewer" BOOLEAN,
    "followsViewer" BOOLEAN,
    "requestedByViewer" BOOLEAN,
    "query" TEXT,
    "timestamp" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "error" TEXT,
    "status" "lead_status" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "batchId" TEXT NOT NULL,

    CONSTRAINT "instagram_lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_upload" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "errorMessage" TEXT,
    "status" "upload_status" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "file_upload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_job" (
    "id" TEXT NOT NULL,
    "type" "import_type" NOT NULL,
    "totalRows" INTEGER,
    "failedRows" INTEGER,
    "processedRows" INTEGER,
    "progress" DOUBLE PRECISION,
    "status" "job_status" NOT NULL DEFAULT 'QUEUED',
    "metadata" JSONB,
    "errorMessage" TEXT,
    "batchId" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileUploadId" TEXT NOT NULL,

    CONSTRAINT "import_job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_job_log" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "level" "log_level" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importJobId" TEXT NOT NULL,

    CONSTRAINT "import_job_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InstagramLeadToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InstagramLeadToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "instagram_batch_userId_idx" ON "instagram_batch"("userId");

-- CreateIndex
CREATE INDEX "instagram_lead_email_idx" ON "instagram_lead"("email");

-- CreateIndex
CREATE INDEX "instagram_lead_status_idx" ON "instagram_lead"("status");

-- CreateIndex
CREATE INDEX "instagram_lead_batchId_idx" ON "instagram_lead"("batchId");

-- CreateIndex
CREATE INDEX "instagram_lead_profileName_idx" ON "instagram_lead"("profileName");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "import_job_fileUploadId_key" ON "import_job"("fileUploadId");

-- CreateIndex
CREATE INDEX "import_job_log_importJobId_idx" ON "import_job_log"("importJobId");

-- CreateIndex
CREATE INDEX "_InstagramLeadToTag_B_index" ON "_InstagramLeadToTag"("B");

-- AddForeignKey
ALTER TABLE "instagram_batch" ADD CONSTRAINT "instagram_batch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instagram_lead" ADD CONSTRAINT "instagram_lead_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "instagram_batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_job" ADD CONSTRAINT "import_job_fileUploadId_fkey" FOREIGN KEY ("fileUploadId") REFERENCES "file_upload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_job_log" ADD CONSTRAINT "import_job_log_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "import_job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstagramLeadToTag" ADD CONSTRAINT "_InstagramLeadToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "instagram_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstagramLeadToTag" ADD CONSTRAINT "_InstagramLeadToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
