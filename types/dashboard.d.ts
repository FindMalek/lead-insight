import { TLogLevel } from "@/types/enums"

export type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  image?: string | null | undefined | undefined
}

export interface TLogEntry {
  timestamp: number
  level: TLogLevel
  message: string
  details?: string[]
}

export interface TTimeInfo {
  localTime: string
  utcTime: string
  timestamp: number
  relativeToStart: string
  relativeToPrevious: string
}
