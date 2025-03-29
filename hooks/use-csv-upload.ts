import { useCallback, useEffect, useRef, useState } from "react"

interface UseCSVUploadProps {
  onFileSelect?: (file: File) => void
}

export function useCSVUpload({ onFileSelect }: UseCSVUploadProps = {}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0]

      if (selectedFile) {
        if (!selectedFile.name.endsWith(".csv")) {
          // Invalid file type
          return
        }

        setFileName(selectedFile.name)
        setFile(selectedFile)
        onFileSelect?.(selectedFile)
      }
    },
    [onFileSelect]
  )

  const handleRemove = useCallback(() => {
    setFileName(null)
    setFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  return {
    fileInputRef,
    fileName,
    file,
    handleBrowseClick,
    handleFileChange,
    handleRemove,
  }
}
