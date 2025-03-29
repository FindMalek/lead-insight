"use server"

import { database } from "@/prisma/client"
import { BatchStatus, JobStatus, LeadStatus } from "@prisma/client"

export async function getLeadStatusCounts() {
  try {
    // Query for all lead statuses and group by status
    const statusCounts = await database.instagramLead.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    })

    // Transform the data into a simple status -> count map
    const result = statusCounts.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count.id
        return acc
      },
      {} as Record<string, number>
    )

    // Make sure all statuses are represented even if they have 0 entries
    const allStatuses = Object.values(LeadStatus)
    allStatuses.forEach((status) => {
      if (result[status] === undefined) {
        result[status] = 0
      }
    })

    return result
  } catch (error) {
    console.error("Error fetching lead status counts:", error)
    throw new Error("Failed to fetch lead status counts")
  }
}

export async function getBatchStatusCounts() {
  try {
    // Query for all batch statuses and group by status
    const statusCounts = await database.apolloBatch.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    })

    // Transform the data into a simple status -> count map
    const result = statusCounts.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count.id
        return acc
      },
      {} as Record<string, number>
    )

    // Make sure all statuses are represented even if they have 0 entries
    const allStatuses = Object.values(BatchStatus)
    allStatuses.forEach((status) => {
      if (result[status] === undefined) {
        result[status] = 0
      }
    })

    return result
  } catch (error) {
    console.error("Error fetching batch status counts:", error)
    throw new Error("Failed to fetch batch status counts")
  }
}

export async function getLeadQualityMetrics() {
  try {
    const totalLeads = await database.instagramLead.count()

    if (totalLeads === 0) {
      return {
        businessPercentage: 0,
        withEmailPercentage: 0,
        withPhonePercentage: 0,
        withWebsitePercentage: 0,
        verifiedPercentage: 0,
      }
    }

    // Get counts for different metrics
    const [
      businessCount,
      withEmailCount,
      withPhoneCount,
      withWebsiteCount,
      verifiedCount,
    ] = await Promise.all([
      database.instagramLead.count({
        where: {
          isBusinessAccount: true,
        },
      }),
      database.instagramLead.count({
        where: {
          email: { not: null },
        },
      }),
      database.instagramLead.count({
        where: {
          phoneNumber: { not: null },
        },
      }),
      database.instagramLead.count({
        where: {
          website: { not: null },
        },
      }),
      database.instagramLead.count({
        where: {
          isVerified: true,
        },
      }),
    ])

    // Calculate percentages
    const businessPercentage = (businessCount / totalLeads) * 100
    const withEmailPercentage = (withEmailCount / totalLeads) * 100
    const withPhonePercentage = (withPhoneCount / totalLeads) * 100
    const withWebsitePercentage = (withWebsiteCount / totalLeads) * 100
    const verifiedPercentage = (verifiedCount / totalLeads) * 100

    return {
      businessPercentage: parseFloat(businessPercentage.toFixed(1)),
      withEmailPercentage: parseFloat(withEmailPercentage.toFixed(1)),
      withPhonePercentage: parseFloat(withPhonePercentage.toFixed(1)),
      withWebsitePercentage: parseFloat(withWebsitePercentage.toFixed(1)),
      verifiedPercentage: parseFloat(verifiedPercentage.toFixed(1)),
    }
  } catch (error) {
    console.error("Error fetching lead metrics:", error)
    throw new Error("Failed to fetch lead quality metrics")
  }
}

export async function getDashboardStats() {
  const [totalLeads, totalBatches, recentlyConverted, totalImports] =
    await Promise.all([
      database.instagramLead.count(),
      database.apolloBatch.count(),
      database.instagramLead.count({
        where: {
          status: LeadStatus.CONVERTED,
        },
      }),
      database.importJob.count(),
    ])

  return {
    totalLeads,
    totalBatches,
    recentlyConverted,
    totalImports,
  }
}

export async function getRecentImports() {
  const imports = await database.importJob.findMany({
    select: {
      id: true,
      type: true,
      status: true,
      createdAt: true,
      fileUpload: {
        select: {
          originalName: true,
          size: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  })

  return imports
}
