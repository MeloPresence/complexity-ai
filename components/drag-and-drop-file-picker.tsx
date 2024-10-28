import { isValidAttachment } from "@/utils/validation"
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
    const droppedFiles = event.dataTransfer.files
    const droppedFilesArray = Array.from(droppedFiles)

    console.log(droppedFilesArray.map(file => file.type));

    if (droppedFilesArray.length > 0) {
      const validFiles = droppedFilesArray.filter(isValidAttachment)

      if (validFiles.length === droppedFilesArray.length) {
        const dataTransfer = new DataTransfer()
        validFiles.forEach((file) => dataTransfer.items.add(file))
        onAddFiles(dataTransfer.files)
      } else {
        // TODO: Create UI for this instead of a window alert
        alert("Only image, text, PDF, and audio files are allowed!")
      }
    }
    setIsDragging(false)
  }

  return (
    <div
      className="flex flex-row justify-center pb-20 bg-white dark:bg-zinc-900 min-h-dvh"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 flex flex-row justify-center items-center flex flex-col gap-1 bg-zinc-100/90">
          <div>Drag and drop files here!</div>
          <div className="text-sm dark:text-zinc-400 text-zinc-500">
            {"(images and text)"}
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
