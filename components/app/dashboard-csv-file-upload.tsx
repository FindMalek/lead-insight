"use client"

import { useCallback, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileSpreadsheet, Upload, X } from "lucide-react"
import { useForm } from "react-hook-form"

import { batchUploadSchema, TBatchUploadSchema } from "@/config/schema"
import { cn } from "@/lib/utils"
import { useCSVUpload } from "@/hooks/use-csv-upload"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface CSVFileUploadProps {
  onUpload: (file: File) => Promise<void>
  isUploading: boolean
}

export function DashboardCSVFileUpload({
  onUpload,
  isUploading,
}: CSVFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const form = useForm<TBatchUploadSchema>({
    resolver: zodResolver(batchUploadSchema),
    defaultValues: {
      file: undefined,
    },
  })

  const {
    fileInputRef,
    fileName,
    handleFileChange,
    handleRemove,
    handleBrowseClick,
  } = useCSVUpload({
    onFileSelect: (file) => {
      form.setValue("file", file, { shouldValidate: true })
    },
  })

  const onSubmit = async (data: TBatchUploadSchema) => {
    if (data.file) {
      await onUpload(data.file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0]
      if (file && file.name.endsWith(".csv")) {
        const fakeEvent = {
          target: {
            files: [file],
          },
        } as React.ChangeEvent<HTMLInputElement>
        handleFileChange(fakeEvent)
      }
    },
    [handleFileChange]
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          onClick={handleBrowseClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-border cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors",
            isDragging ? "border-primary/80 bg-primary/5" : "hover:bg-muted",
            fileName ? "bg-muted/60" : "bg-card"
          )}
        >
          {!fileName ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="bg-muted rounded-full p-4">
                <FileSpreadsheet className="text-muted-foreground h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Upload CSV file</h3>
                <p className="text-muted-foreground max-w-xs text-sm">
                  Drag and drop your CSV file here, or click to browse
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded p-2">
                  <FileSpreadsheet className="text-primary h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-primary max-w-[200px] truncate text-sm font-medium">
                    {fileName}
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Ready to upload
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                className="hover:bg-muted-foreground/10 rounded-full p-1"
                disabled={isUploading}
              >
                <X className="text-muted-foreground h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!fileName || isUploading}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload CSV"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
