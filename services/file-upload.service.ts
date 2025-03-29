import { createReadStream, promises as fs } from "fs"
import path from "path"

import { database } from "@/prisma/client"
import { FileUpload, PrismaClient, UploadStatus } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

export interface IUploadedFile {
  originalname: string
  mimetype: string
  path: string
  size: number
  buffer?: Buffer
}

export class FileUploadService {
  private prisma: PrismaClient
  private uploadDir: string

  constructor(uploadDir: string = "uploads") {
    this.prisma = database
    this.uploadDir = uploadDir
    this.ensureUploadDirExists()
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true })
    } catch (error) {
      console.error("Failed to create upload directory:", error)
      throw new Error("Failed to initialize upload service")
    }
  }

  /**
   * Store an uploaded file to the filesystem and database
   */
  async storeFile(file: IUploadedFile, userId: string): Promise<FileUpload> {
    // Generate a unique filename to prevent collisions
    const fileExtension = path.extname(file.originalname)
    const fileName = `${uuidv4()}${fileExtension}`
    const filePath = path.join(this.uploadDir, fileName)

    try {
      // If we have a buffer, write it; otherwise, copy the file
      if (file.buffer) {
        await fs.writeFile(filePath, file.buffer)
      } else if (file.path) {
        // Copy from temp upload path to our storage
        await fs.copyFile(file.path, filePath)
      } else {
        throw new Error("Invalid file: missing both buffer and path")
      }

      // Create a record in the database
      const fileUpload = await this.prisma.fileUpload.create({
        data: {
          fileName,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: filePath,
          status: UploadStatus.PENDING,
          user: {
            connect: { id: userId },
          },
        },
      })

      return fileUpload
    } catch (error) {
      // Clean up any created file if there was an error
      try {
        await fs.unlink(filePath)
      } catch (unlinkError) {
        // Ignore errors when cleaning up
      }

      console.error("Error storing file:", error)
      throw new Error("Failed to store uploaded file")
    }
  }

  /**
   * Get a file by its ID
   */
  async getFileById(fileId: string): Promise<FileUpload | null> {
    return this.prisma.fileUpload.findUnique({
      where: { id: fileId },
    })
  }

  /**
   * Create a readable stream from a file
   */
  createReadStream(filePath: string): NodeJS.ReadableStream {
    return createReadStream(filePath)
  }

  /**
   * Update file status
   */
  async updateFileStatus(
    fileId: string,
    status: UploadStatus,
    errorMessage?: string
  ): Promise<FileUpload> {
    return this.prisma.fileUpload.update({
      where: { id: fileId },
      data: {
        status,
        errorMessage,
        ...(status === UploadStatus.COMPLETED || status === UploadStatus.FAILED
          ? { processedAt: new Date() }
          : {}),
      },
    })
  }

  /**
   * Delete a file from both database and filesystem
   */
  async deleteFile(fileId: string): Promise<void> {
    const file = await this.getFileById(fileId)
    if (!file) {
      throw new Error("File not found")
    }

    // Delete the file from the filesystem
    try {
      await fs.unlink(file.path)
    } catch (error) {
      console.error("Error deleting file from filesystem:", error)
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await this.prisma.fileUpload.delete({
      where: { id: fileId },
    })
  }
}
