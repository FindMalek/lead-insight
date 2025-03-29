import { useCallback, useState } from "react"

import { TBatchUploadState, TLogEntry } from "@/lib/types"

interface UseBatchUploadProps {
  onUploadStart?: () => void
  onUploadComplete?: () => void
  onUploadError?: () => void
}

export function useBatchUpload({
  onUploadStart,
  onUploadComplete,
  onUploadError,
}: UseBatchUploadProps = {}) {
  const [isUploading, setIsUploading] = useState(false)
  const [logs, setLogs] = useState<TLogEntry[]>([])
  const [progress, setProgress] = useState(0)

  const addLog = useCallback(
    (
      message: string,
      level: TLogEntry["level"] = "info",
      details?: string[]
    ) => {
      setLogs((prev) => [
        ...prev,
        {
          timestamp: Date.now(),
          level,
          message,
          details,
        },
      ])
    },
    []
  )

  const uploadFile = useCallback(
    async (file: File) => {
      try {
        setIsUploading(true)
        setProgress(0)
        setLogs([])

        // Call the start callback
        onUploadStart?.()

        // Add initial log
        addLog(`Starting upload for file: ${file.name}`)

        // Create a FormData object to send the file
        const formData = new FormData()
        formData.append("file", file)

        // Simulate file upload progress (in a real app, we'd use xhr or fetch with progress)
        addLog("Uploading file...")

        // Simulate file upload with progress updates
        await simulateFileUpload((currentProgress) => {
          setProgress(currentProgress)

          // Add progress logs at certain points
          if (currentProgress === 25) {
            addLog("25% uploaded...")
          } else if (currentProgress === 50) {
            addLog("50% uploaded...")
          } else if (currentProgress === 75) {
            addLog("75% uploaded...")
          }
        })

        addLog("File uploaded successfully")

        // Simulate backend processing
        addLog("Starting batch processing...")

        // Simulate processing with API calls and progress updates
        await simulateBatchProcessing(
          (currentProgress, message, level, details) => {
            setProgress(currentProgress)
            addLog(message, level, details)
          }
        )

        // Successful completion
        setProgress(100)
        addLog("Batch processing completed successfully", "info")
        onUploadComplete?.()
      } catch (error) {
        // Handle errors
        addLog("Error during batch processing", "error", [
          error instanceof Error ? error.message : "Unknown error",
          "Please try again or contact support if the issue persists",
        ])
        onUploadError?.()
      } finally {
        setIsUploading(false)
      }
    },
    [addLog, onUploadStart, onUploadComplete, onUploadError]
  )

  const resetUpload = useCallback(() => {
    setLogs([])
    setProgress(0)
  }, [])

  return {
    uploadFile,
    isUploading,
    logs,
    progress,
    resetUpload,
  }
}

// Simulate file upload with progress
function simulateFileUpload(
  onProgress: (progress: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      onProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        resolve()
      }
    }, 150) // Adjust timing as needed
  })
}

// Simulate batch processing with progress and logs
function simulateBatchProcessing(
  onProgress: (
    progress: number,
    message: string,
    level?: TLogEntry["level"],
    details?: string[]
  ) => void
): Promise<void> {
  return new Promise((resolve) => {
    let step = 0
    const totalSteps = 10
    const steps = [
      { message: "Validating CSV format...", level: "info" },
      { message: "CSV format is valid", level: "info" },
      { message: "Parsing data rows...", level: "info" },
      { message: "Found 1432 records to process", level: "info" },
      { message: "Checking for duplicate entries...", level: "info" },
      {
        message: "Found 12 potential duplicate entries",
        level: "warning",
        details: [
          "Row 45: Possible duplicate of existing record",
          "Row 67: Possible duplicate of existing record",
          "Row 128: Possible duplicate of existing record",
          "...",
        ],
      },
      { message: "Transforming data for database insertion...", level: "info" },
      {
        message: "Invalid data format in 3 rows",
        level: "error",
        details: [
          "Row 203: Invalid email format",
          "Row 345: Missing required field 'company'",
          "Row 782: Invalid phone number format",
        ],
      },
      { message: "Inserting valid records into database...", level: "info" },
      { message: "Successfully imported 1429 records", level: "info" },
    ]

    const interval = setInterval(() => {
      const currentStep = steps[step]
      const progress = Math.min(100, Math.round((step / totalSteps) * 100))

      onProgress(
        progress,
        currentStep.message,
        currentStep.level as TLogEntry["level"],
        currentStep.details
      )

      step++

      if (step >= totalSteps) {
        clearInterval(interval)
        resolve()
      }
    }, 800) // Adjust timing as needed
  })
}
