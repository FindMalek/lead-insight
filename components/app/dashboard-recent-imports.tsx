import { formatDistanceToNow } from "date-fns"

import { Badge } from "@/components/ui/badge"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Added interface for the import job structure expected in props
interface RecentImport {
  id: string
  status: string
  createdAt: Date
  fileUpload: {
    originalName: string
    size: number
  }
}

// Added interface for props
interface DashboardRecentImportsProps {
  recentImports: RecentImport[]
}

// Updated function signature: removed async, added props
export function DashboardRecentImports({
  recentImports,
}: DashboardRecentImportsProps) {
  return (
    <div>
      <CardHeader className="pb-2">
        <CardTitle>Recent Imports</CardTitle>
        <CardDescription>
          Most recent file imports and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentImports.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No import jobs found
            </p>
          ) : (
            recentImports.map((importJob) => (
              <div
                key={importJob.id}
                className="flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {importJob.fileUpload.originalName}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatSize(importJob.fileUpload.size)} •{" "}
                    {formatDistanceToNow(importJob.createdAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <StatusBadge status={importJob.status} />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline"

  switch (status) {
    case "COMPLETED":
      variant = "default"
      break
    case "PROCESSING":
    case "QUEUED":
      variant = "secondary"
      break
    case "FAILED":
    case "CANCELLED":
      variant = "destructive"
      break
  }

  return (
    <Badge variant={variant}>
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </Badge>
  )
}

function formatSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
