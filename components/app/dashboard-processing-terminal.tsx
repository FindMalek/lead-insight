"use client"

import { useEffect, useRef, useState } from "react"
import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Copy,
  Info,
  RefreshCw,
  RotateCcw,
} from "lucide-react"

import { TLogEntry } from "@/types/dashboard"
import { TBatchUploadState } from "@/types/enums"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface DashboardProcessingTerminalProps {
  logs: TLogEntry[]
  progress: number
  status: TBatchUploadState
  onReset: () => void
}

export function DashboardProcessingTerminal({
  logs,
  progress,
  status,
  onReset,
}: DashboardProcessingTerminalProps) {
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({})
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const logContainerRef = useRef<HTMLDivElement>(null)
  const [startTime] = useState<number>(
    logs.length > 0 ? Math.min(...logs.map((log) => log.timestamp)) : Date.now()
  )
  const [previousLogTime, setPreviousLogTime] = useState<
    Record<number, number>
  >({})

  // Initialize previous log times
  useEffect(() => {
    if (logs.length === 0) return

    const prevTimes: Record<number, number> = {}
    let lastTime = startTime

    logs.forEach((log) => {
      prevTimes[log.timestamp] = lastTime
      lastTime = log.timestamp
    })

    setPreviousLogTime(prevTimes)
  }, [logs, startTime])

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logContainerRef.current && autoScroll) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs, autoScroll])

  // Handle scroll to detect if user has scrolled up
  useEffect(() => {
    const handleScroll = () => {
      if (!logContainerRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50

      setAutoScroll(isAtBottom)
    }

    const container = logContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Format timestamp to HH:MM:SS.sss
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}.${date.getMilliseconds().toString().padStart(3, "0")}`
  }

  // Get icon for log level
  const getLevelIcon = (level: TLogEntry["level"]) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-3 w-3 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />
      case "debug":
        return <Info className="h-3 w-3 text-purple-500" />
      case "info":
      default:
        return <Info className="h-3 w-3 text-blue-500" />
    }
  }

  // Toggle expanded state for a log
  const toggleExpanded = (logId: string) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [logId]: !prev[logId],
    }))
  }

  // Copy log to clipboard
  const copyLogToClipboard = (log: TLogEntry) => {
    const logId = `${log.timestamp}-${log.message}`
    const logText = `[${formatTimestamp(log.timestamp)}] ${log.level.toUpperCase()}: ${log.message}${log.details ? "\n" + log.details.join("\n") : ""}`

    navigator.clipboard.writeText(logText).then(() => {
      setCopiedLogId(logId)
      setTimeout(() => setCopiedLogId(null), 2000)
    })
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>
            {status === "processing"
              ? `Processing (${progress}%)`
              : status === "completed"
                ? "Processing Complete"
                : "Processing Failed"}
          </span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Auto-scroll indicator */}
      {!autoScroll && logs.length > 5 && (
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setAutoScroll(true)
              if (logContainerRef.current) {
                logContainerRef.current.scrollTop =
                  logContainerRef.current.scrollHeight
              }
            }}
            className="h-7 px-2 text-xs"
          >
            <ChevronDown className="mr-1 h-3 w-3" />
            Latest
          </Button>
        </div>
      )}

      {/* Log container */}
      <div
        ref={logContainerRef}
        className="border-border relative h-[300px] overflow-auto rounded-md border font-mono text-xs"
      >
        <table className="w-full table-fixed border-collapse">
          <tbody>
            {logs.map((log, index) => {
              const logId = `${log.timestamp}-${index}`
              const isExpanded = expandedLogs[logId] || false
              const hasDetails = log.details && log.details.length > 0

              return (
                <tr
                  key={logId}
                  className={cn(
                    "border-border/30 hover:bg-muted/30 border-b",
                    log.level === "error" && "bg-red-500/5",
                    log.level === "warning" && "bg-yellow-500/5"
                  )}
                >
                  <td className="text-muted-foreground border-border/30 w-32 whitespace-nowrap border-r py-1 pl-2 pr-2 align-top">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="whitespace-pre-wrap break-all px-2 py-1">
                    <div className="group flex items-start gap-1">
                      <div className="mt-0.5 flex items-center gap-1">
                        <span>{getLevelIcon(log.level)}</span>
                        {hasDetails && (
                          <button
                            onClick={() => toggleExpanded(logId)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={cn(
                            "flex items-center justify-between gap-1",
                            log.level === "error" && "text-red-500",
                            log.level === "warning" && "text-yellow-500",
                            log.level === "debug" && "text-purple-500"
                          )}
                        >
                          <div className="flex-1">{log.message}</div>
                          <button
                            onClick={() => copyLogToClipboard(log)}
                            className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                            title="Copy log"
                          >
                            {copiedLogId ===
                            `${log.timestamp}-${log.message}` ? (
                              <span className="text-[10px] text-green-500">
                                Copied
                              </span>
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        {hasDetails && isExpanded && (
                          <div className="text-muted-foreground border-border/50 mt-1 border-l pl-2">
                            {log.details?.map((detail, i) => (
                              <div key={i} className="py-0.5 pl-2">
                                {detail}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
            {logs.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="text-muted-foreground py-4 text-center"
                >
                  Waiting for processing to start...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end">
        {status === "processing" ? (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Processing in progress...</span>
          </div>
        ) : (
          <Button
            onClick={onReset}
            variant={status === "completed" ? "outline" : "default"}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {status === "completed" ? "Process Another File" : "Try Again"}
          </Button>
        )}
      </div>
    </div>
  )
}
