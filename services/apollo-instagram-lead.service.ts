import { PrismaClient, ApolloBatch, InstagramLead, BatchStatus, LeadStatus } from '@prisma/client';
import { database } from '@/prisma/client';

export class ApolloInstagramLeadService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = database;
  }

  /**
   * Create a new batch for Instagram leads
   */
  async createBatch(data: {
    name: string;
    description?: string;
    fileName: string;
    uploadedBy: string;
    userId: string;
  }): Promise<ApolloBatch> {
    return this.prisma.apolloBatch.create({
      data: {
        name: data.name,
        description: data.description,
        fileName: data.fileName,
        uploadedBy: data.uploadedBy,
        status: BatchStatus.PENDING,
        userId: data.userId
      }
    });
  }

  /**
   * Get a batch by ID
   */
  async getBatchById(batchId: string): Promise<ApolloBatch | null> {
    return this.prisma.apolloBatch.findUnique({
      where: { id: batchId }
    });
  }

  /**
   * Update batch status
   */
  async updateBatchStatus(
    batchId: string, 
    status: BatchStatus, 
    errorMessage?: string
  ): Promise<ApolloBatch> {
    return this.prisma.apolloBatch.update({
      where: { id: batchId },
      data: {
        status,
        errorMessage,
        ...(status === BatchStatus.COMPLETED || status === BatchStatus.FAILED ? { processedAt: new Date() } : {})
      }
    });
  }

  /**
   * Create a lead and associate it with a batch
   */
  async createLead(
    batchId: string, 
    leadData: Omit<InstagramLead, 'id' | 'createdAt' | 'updatedAt' | 'batchId'>
  ): Promise<InstagramLead> {
    return this.prisma.instagramLead.create({
      data: {
        ...leadData,
        batch: {
          connect: { id: batchId }
        }
      }
    });
  }

  /**
   * Create many leads in a batch operation
   */
  async createManyLeads(
    batchId: string, 
    leadsData: Array<Omit<InstagramLead, 'id' | 'createdAt' | 'updatedAt' | 'batchId'>>
  ): Promise<number> {
    // Map the data to include the batchId
    const dataWithBatchId = leadsData.map(lead => ({
      ...lead,
      batchId
    }));

    // Create many leads in a single operation
    const result = await this.prisma.instagramLead.createMany({
      data: dataWithBatchId
    });

    return result.count;
  }

  /**
   * Get leads by batch ID with pagination
   */
  async getLeadsByBatchId(
    batchId: string, 
    page: number = 1, 
    pageSize: number = 50
  ): Promise<{ leads: InstagramLead[]; total: number }> {
    const skip = (page - 1) * pageSize;

    const [leads, total] = await Promise.all([
      this.prisma.instagramLead.findMany({
        where: { batchId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.instagramLead.count({
        where: { batchId }
      })
    ]);

    return { leads, total };
  }

  /**
   * Get all batches with pagination
   */
  async getBatches(
    page: number = 1, 
    pageSize: number = 20, 
    userId?: string
  ): Promise<{ batches: ApolloBatch[]; total: number }> {
    const skip = (page - 1) * pageSize;

    const whereClause = userId ? { userId } : {};

    const [batches, total] = await Promise.all([
      this.prisma.apolloBatch.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { leads: true }
          }
        }
      }),
      this.prisma.apolloBatch.count({
        where: whereClause
      })
    ]);

    return { batches, total };
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(
    leadId: string, 
    status: LeadStatus, 
    notes?: string
  ): Promise<InstagramLead> {
    return this.prisma.instagramLead.update({
      where: { id: leadId },
      data: {
        status,
        ...(notes ? { notes } : {}),
        processedAt: new Date()
      }
    });
  }

  /**
   * Search leads with various filters
   */
  async searchLeads(params: {
    query?: string;
    status?: LeadStatus;
    minFollowers?: number;
    batchId?: string;
    isBusinessAccount?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<{ leads: InstagramLead[]; total: number }> {
    const {
      query,
      status,
      minFollowers,
      batchId,
      isBusinessAccount,
      page = 1,
      pageSize = 50
    } = params;

    const skip = (page - 1) * pageSize;

    // Build where clause based on provided filters
    const whereClause: any = {};
    
    if (query) {
      whereClause.OR = [
        { profileName: { contains: query, mode: 'insensitive' } },
        { fullName: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } }
      ];
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (minFollowers) {
      whereClause.followersCount = { gte: minFollowers };
    }
    
    if (batchId) {
      whereClause.batchId = batchId;
    }
    
    if (isBusinessAccount !== undefined) {
      whereClause.isBusinessAccount = isBusinessAccount;
    }

    const [leads, total] = await Promise.all([
      this.prisma.instagramLead.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: { followersCount: 'desc' },
        include: {
          batch: {
            select: {
              name: true,
              id: true
            }
          }
        }
      }),
      this.prisma.instagramLead.count({
        where: whereClause
      })
    ]);

    return { leads, total };
  }

  /**
   * Get a lead by ID with batch information
   */
  async getLeadById(leadId: string): Promise<InstagramLead | null> {
    return this.prisma.instagramLead.findUnique({
      where: { id: leadId },
      include: {
        batch: true,
        tags: true
      }
    });
  }

  /**
   * Delete a batch and all its associated leads
   */
  async deleteBatch(batchId: string): Promise<void> {
    await this.prisma.apolloBatch.delete({
      where: { id: batchId }
    });
  }
}