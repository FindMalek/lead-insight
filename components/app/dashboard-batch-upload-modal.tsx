"use client"

import { useState } from "react"

import { TBatchUploadState } from "@/types/enums"

import { useBatchUpload } from "@/hooks/use-batch-upload"

import { DashboardCSVFileUpload } from "@/components/app/dashboard-csv-file-upload"
import { DashboardProcessingTerminal } from "@/components/app/dashboard-processing-terminal"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DashboardBatchUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DashboardBatchUploadModal({
  isOpen,
  onClose,
}: DashboardBatchUploadModalProps) {
  const [uploadState, setUploadState] = useState<TBatchUploadState>("idle")

  const { uploadFile, isUploading, logs, progress, resetUpload } =
    useBatchUpload({
      onUploadStart: () => setUploadState("processing"),
      onUploadComplete: () => setUploadState("completed"),
      onUploadError: () => setUploadState("error"),
    })

  const handleClose = () => {
    if (uploadState === "processing") return // Prevent closing during processing

    if (uploadState === "completed" || uploadState === "error") {
      resetUpload()
      setUploadState("idle")
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {uploadState === "idle"
              ? "Upload Batch CSV"
              : uploadState === "processing"
                ? "Processing CSV File"
                : uploadState === "completed"
                  ? "Upload Completed"
                  : "Upload Error"}
          </DialogTitle>
        </DialogHeader>

        {uploadState === "idle" ? (
          <DashboardCSVFileUpload
            onUpload={uploadFile}
            isUploading={isUploading}
          />
        ) : (
          <DashboardProcessingTerminal
            logs={logs}
            progress={progress}
            status={uploadState}
            onReset={() => {
              resetUpload()
              setUploadState("idle")
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
