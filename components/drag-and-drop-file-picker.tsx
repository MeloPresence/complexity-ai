import { isValidAttachment } from "@/lib/validation"
import { DragEvent, useState } from "react"

export default function DragAndDropFilePicker({
  children,
  onAddFiles,
}: {
  children: React.ReactNode
  onAddFiles: (files: FileList) => void
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    console.debug("onDrop event:", { event })
    const droppedFiles = event.dataTransfer.files
    const droppedFilesArray = Array.from(droppedFiles)

    if (droppedFilesArray.length > 0) {
      const validFiles = droppedFilesArray.filter(isValidAttachment)

      if (validFiles.length === droppedFilesArray.length) {
        const dataTransfer = new DataTransfer()
        validFiles.forEach((file) => dataTransfer.items.add(file))
        onAddFiles(dataTransfer.files)
      } else {
        // TODO: Create UI for this instead of a window alert
        alert("Only image, text, PDF, audio, and video files are allowed!")
      }
    }
    setIsDragging(false)
  }

  return (
    <div
      className="flex justify-center bg-white min-h-dvh w-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="fixed inset-0 pointer-events-none z-10 dark:bg-zinc-900/90 z-10 justify-center items-center flex flex-col gap-1 bg-zinc-100/90">
          <div>Drag and drop files here!</div>
          <div className="text-sm dark:text-zinc-400 text-zinc-500">
            {"(Text, images, audio and videos)"}
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
