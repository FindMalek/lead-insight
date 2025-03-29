import { PrismaClient, ImportJob, ImportType, JobStatus, LogLevel } from '@prisma/client';
import { database } from '@/prisma/client';
import { FileUploadService } from '@/services/file-upload.service';
import { CSVParserService } from '@/services/csv-parser.service';
import { ApolloInstagramLeadService } from '@/services/apollo-instagram-lead.service';
import path from 'path';

export class ImportFileService {
  private prisma: PrismaClient;
  private csvParserService: CSVParserService;
  private fileUploadService: FileUploadService;
  private instagramLeadService: ApolloInstagramLeadService;

  constructor() {
    this.prisma = database;
    this.csvParserService = new CSVParserService();
    this.fileUploadService = new FileUploadService();
    this.instagramLeadService = new ApolloInstagramLeadService();
  }

  /**
   * Create a new import job for a file
   */
  async createImportJob(fileUploadId: string, type: ImportType): Promise<ImportJob> {
    return this.prisma.importJob.create({
      data: {
        fileUploadId,
        type,
        status: JobStatus.QUEUED
      }
    });
  }

  /**
   * Log an entry for an import job
   */
  private async logImportJob(
    importJobId: string, 
    level: LogLevel, 
    message: string, 
    metadata?: any
  ): Promise<void> {
    await this.prisma.importJobLog.create({
      data: {
        importJobId,
        level,
        message,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      }
    });
  }

  /**
   * Update import job status
   */
  private async updateJobStatus(
    jobId: string, 
    status: JobStatus, 
    progress?: number, 
    errorMessage?: string
  ): Promise<ImportJob> {
    const data: any = { status };
    
    if (progress !== undefined) {
      data.progress = progress;
    }
    
    if (errorMessage) {
      data.errorMessage = errorMessage;
    }
    
    if (status === 'PROCESSING' && !data.startedAt) {
      data.startedAt = new Date();
    }
    
    if (status === 'COMPLETED' || status === 'FAILED') {
      data.completedAt = new Date();
    }
    
    return this.prisma.importJob.update({
      where: { id: jobId },
      data
    });
  }

  /**
   * Process an Instagram leads import job
   */
  async processInstagramLeadImport(jobId: string, userId: string): Promise<void> {
    // Get the job
    const job = await this.prisma.importJob.findUnique({
      where: { id: jobId },
      include: { fileUpload: true }
    });

    if (!job) {
      throw new Error(`Import job ${jobId} not found`);
    }

    // Update job status to processing
    await this.updateJobStatus(jobId, 'PROCESSING', 0);
    await this.logImportJob(jobId, 'INFO', 'Starting Instagram lead import');

    try {
      // Update file status
      await this.fileUploadService.updateFileStatus(job.fileUploadId, 'PROCESSING');

      // Get the file path
      const filePath = job.fileUpload.path;
      const fileName = path.basename(job.fileUpload.originalName);

      // Parse the CSV file
      await this.logImportJob(jobId, 'INFO', 'Parsing CSV file');
      const rows = await this.csvParserService.parseFromFile(filePath);

      // Validate the CSV
      const validation = this.csvParserService.validateInstagramLeadCSV(rows);
      if (!validation.isValid) {
        throw new Error(`Invalid CSV format: Missing columns: ${validation.missingColumns.join(', ')}`);
      }

      await this.updateJobStatus(jobId, 'PROCESSING', 10);
      await this.logImportJob(jobId, 'INFO', `Found ${rows.length} leads in CSV`);

      // Create a batch for these leads
      const batch = await this.instagramLeadService.createBatch({
        name: `Import ${fileName}`,
        fileName: fileName,
        uploadedBy: job.fileUpload.userId,
        userId
      });

      await this.updateJobStatus(jobId, 'PROCESSING', 20);
      await this.logImportJob(jobId, 'INFO', `Created batch ${batch.id}`);

      // Update job with batchId for reference
      await this.prisma.importJob.update({
        where: { id: jobId },
        data: { batchId: batch.id }
      });

      // Transform the rows
      const transformedLeads = rows.map(row => 
        this.csvParserService.transformInstagramLeadRow(row)
      );

      // Save leads in chunks of 100 to avoid hitting DB limits
      const chunkSize = 100;
      const totalLeads = transformedLeads.length;
      
      for (let i = 0; i < totalLeads; i += chunkSize) {
        const chunk = transformedLeads.slice(i, i + chunkSize);
        await this.instagramLeadService.createManyLeads(batch.id, chunk);
        
        // Update progress
        const progress = Math.min(20 + Math.floor((i + chunk.length) / totalLeads * 70), 90);
        await this.updateJobStatus(jobId, 'PROCESSING', progress);
        await this.logImportJob(
          jobId, 
          'INFO', 
          `Processed ${i + chunk.length}/${totalLeads} leads`
        );
      }

      // Update batch status
      await this.instagramLeadService.updateBatchStatus(batch.id, 'COMPLETED');
      
      // Update job status
      await this.updateJobStatus(jobId, 'COMPLETED', 100);
      await this.logImportJob(jobId, 'INFO', 'Import completed successfully');
      
      // Update file status
      await this.fileUploadService.updateFileStatus(job.fileUploadId, 'COMPLETED');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      await this.logImportJob(jobId, 'ERROR', `Import failed: ${errorMessage}`);
      await this.updateJobStatus(jobId, 'FAILED', undefined, errorMessage);
      
      // Update file status
      await this.fileUploadService.updateFileStatus(job.fileUploadId, 'FAILED', errorMessage);
      
      // If we created a batch, update its status
      const updatedJob = await this.prisma.importJob.findUnique({
        where: { id: jobId }
      });
      
      if (updatedJob?.batchId) {
        await this.instagramLeadService.updateBatchStatus(updatedJob.batchId, 'FAILED', errorMessage);
      }
      
      throw error;
    }
  }

  /**
   * Get an import job by ID
   */
  async getImportJob(jobId: string): Promise<ImportJob | null> {
    return this.prisma.importJob.findUnique({
      where: { id: jobId },
      include: {
        fileUpload: true,
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });
  }

  /**
   * Get jobs for a user
   */
  async getJobs(
    page: number = 1, 
    pageSize: number = 20, 
    userId?: string
  ): Promise<{ jobs: ImportJob[]; total: number }> {
    const skip = (page - 1) * pageSize;

    // Build where clause - if userId is provided, filter by user's jobs
    const whereClause = userId ? {
      fileUpload: {
        userId
      }
    } : {};

    const [jobs, total] = await Promise.all([
      this.prisma.importJob.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          fileUpload: {
            select: {
              originalName: true,
              size: true,
              status: true
            }
          }
        }
      }),
      this.prisma.importJob.count({
        where: whereClause
      })
    ]);

    return { jobs, total };
  }

  /**
   * Start the import process based on file ID
   */
  async startImport(fileId: string, userId: string): Promise<ImportJob> {
    // Get the file
    const file = await this.fileUploadService.getFileById(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    // Determine the import type based on file extension/metadata
    // For simplicity, we're assuming it's for Instagram leads
    const importType: ImportType = ImportType.APOLLO_INSTAGRAM_LEADS;

    // Create a job
    const job = await this.createImportJob(fileId, importType);

    // Start processing in the background
    // In a production environment, this would be handled by a queue system like Bull
    setTimeout(() => {
      this.processInstagramLeadImport(job.id, userId).catch(err => {
        console.error('Background import failed:', err);
      });
    }, 0);

    return job;
  }
}