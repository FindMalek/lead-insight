import { createReadStream } from "fs"
import { Readable } from "stream"

import { parse } from "csv-parse"

export interface IInstagramLeadRow {
  profileUrl: string
  profileName: string
  fullName?: string
  bio?: string
  blockedByViewer?: string
  followersCount?: string
  followingCount?: string
  followedByViewer?: string
  followsViewer?: string
  instagramID?: string
  isBusinessAccount?: string
  joinedRecently?: string
  category?: string
  phoneNumber?: string
  isPrivate?: string
  isVerified?: string
  mutualFollowersCount?: string
  imageUrl?: string
  requestedByViewer?: string
  postsCount?: string
  website?: string
  query?: string
  timestamp?: string
  mailFound?: string
  businessCategory?: string
  businessStreetAddress?: string
  businessZipCode?: string
  businessCity?: string
  mailFound2?: string
  snapchat?: string
  error?: string
}

export class CSVParserService {
  /**
   * Parse a CSV file from a path
   */
  async parseFromFile(filePath: string): Promise<IInstagramLeadRow[]> {
    return new Promise((resolve, reject) => {
      const results: IInstagramLeadRow[] = []
      const parser = parse({
        delimiter: ",",
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })

      createReadStream(filePath)
        .pipe(parser)
        .on("data", (data: IInstagramLeadRow) => {
          results.push(data)
        })
        .on("error", (error) => {
          reject(error)
        })
        .on("end", () => {
          resolve(results)
        })
    })
  }

  /**
   * Parse a CSV from a buffer or stream
   */
  async parseFromBuffer(buffer: Buffer): Promise<IInstagramLeadRow[]> {
    return new Promise((resolve, reject) => {
      const results: IInstagramLeadRow[] = []
      const parser = parse({
        delimiter: ",",
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })

      Readable.from(buffer)
        .pipe(parser)
        .on("data", (data: IInstagramLeadRow) => {
          results.push(data)
        })
        .on("error", (error) => {
          reject(error)
        })
        .on("end", () => {
          resolve(results)
        })
    })
  }

  /**
   * Validate if the CSV has the required headers for Instagram leads
   */
  validateInstagramLeadCSV(rows: IInstagramLeadRow[]): {
    isValid: boolean
    missingColumns: string[]
  } {
    if (rows.length === 0) {
      return { isValid: false, missingColumns: ["Empty file"] }
    }

    const requiredColumns = ["profileUrl", "profileName"]
    const missingColumns = requiredColumns.filter(
      (column) => !Object.keys(rows[0]).includes(column)
    )

    return {
      isValid: missingColumns.length === 0,
      missingColumns,
    }
  }

  /**
   * Transform CSV row data to prepare for database insertion
   */
  transformInstagramLeadRow(row: IInstagramLeadRow): any {
    return {
      profileUrl: row.profileUrl,
      profileName: row.profileName,
      fullName: row.fullName || null,
      bio: row.bio || null,
      instagramId: row.instagramID || null,
      imageUrl: row.imageUrl || null,

      // Convert string numbers to float where appropriate
      followersCount: row.followersCount
        ? parseFloat(row.followersCount)
        : null,
      followingCount: row.followingCount
        ? parseFloat(row.followingCount)
        : null,
      postsCount: row.postsCount ? parseFloat(row.postsCount) : null,
      mutualFollowersCount: row.mutualFollowersCount
        ? parseFloat(row.mutualFollowersCount)
        : null,

      // Convert string booleans to actual booleans
      isBusinessAccount: row.isBusinessAccount === "TRUE",
      isPrivate: row.isPrivate === "TRUE",
      isVerified: row.isVerified === "TRUE",
      joinedRecently: row.joinedRecently === "TRUE",
      blockedByViewer: row.blockedByViewer === "TRUE",
      followedByViewer: row.followedByViewer === "TRUE",
      followsViewer: row.followsViewer === "TRUE",
      requestedByViewer: row.requestedByViewer === "TRUE",

      // Business information
      category: row.category || null,
      businessCategory: row.businessCategory || null,
      businessStreetAddress: row.businessStreetAddress || null,
      businessZipCode: row.businessZipCode || null,
      businessCity: row.businessCity || null,

      // Contact information
      website: row.website || null,
      email: row.mailFound || null,
      alternativeEmail: row.mailFound2 || null,
      phoneNumber: row.phoneNumber || null,
      snapchat: row.snapchat || null,

      // Meta information
      query: row.query || null,
      timestamp: row.timestamp ? new Date(row.timestamp) : null,
      error: row.error || null,
    }
  }
}
