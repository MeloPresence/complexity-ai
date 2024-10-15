import TextFilePreview from "@/components/text-file-preview"
import { type useChat } from "ai/react"
import { isValidAttachment } from "@/utils/validation"

export function ChatInput({
  files,
  setFiles,
  input,
  handleSubmit,
  handleInputChange,
}: {
  files: FileList | null
  setFiles: (files: FileList | null) => void
  input: ReturnType<typeof useChat>["input"]
  handleSubmit: ReturnType<typeof useChat>["handleSubmit"]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // handleSubmit: (...args: any) => any
  handleInputChange: ReturnType<typeof useChat>["handleInputChange"]
}) {
  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items

    if (items) {
      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null)

      if (files.length > 0) {
        const validFiles = files.filter(isValidAttachment)

        if (validFiles.length === files.length) {
          const dataTransfer = new DataTransfer()
          validFiles.forEach((file) => dataTransfer.items.add(file))
          setFiles(dataTransfer.files)
        } else {
          alert("Only image and text files are allowed")
        }
      }
    }
  }

  return (
    <form
      className="flex flex-col gap-2 relative items-center"
      onSubmit={(event) => {
        const options = files ? { experimental_attachments: files } : {}
        handleSubmit(event, options)
        setFiles(null)
      }}
    >
      {files && files.length > 0 && (
        <div className="flex flex-row gap-2 bottom-12 px-4 w-full md:w-[500px] md:px-0">
          {Array.from(files).map((file) =>
            file.type.startsWith("image") ? (
              <div key={file.name}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="rounded-md w-16"
                />
              </div>
            ) : file.type.startsWith("text") ? (
              <div
                key={file.name}
                className="text-[8px] leading-1 w-28 h-16 overflow-hidden text-zinc-500 border p-2 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
              >
                <TextFilePreview file={file} />
              </div>
            ) : null,
          )}
        </div>
      )}

      <input
        className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 md:max-w-[500px] max-w-[calc(100dvw-32px)]"
        placeholder="Send a message..."
        value={input}
        onChange={handleInputChange}
        onPaste={handlePaste}
      />
      <span className="text-xs">Press Enter to send</span>
    </form>
  )
}
