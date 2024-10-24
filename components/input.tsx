import TextFilePreview from "@/components/text-file-preview"
import { isValidAttachment } from "@/utils/validation"
import { type useChat } from "ai/react"

export function ChatInput({
  files,
  setFiles,
  chat: {
    input,
    isLoading,
    messages,
    setMessages,
    handleSubmit: handleSubmitFn,
    handleInputChange,
    stop,
    error,
    reload,
  },
}: {
  files: FileList | null
  setFiles: (files: FileList | null) => void
  chat: ReturnType<typeof useChat>
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

  const isNewInputAvailable = input || files?.length

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isNewInputAvailable) {
      if (error) reload()
      return
    }

    const options = files ? { experimental_attachments: files } : {}
    if (error) setMessages(messages.slice(0, -1)) // Remove last message because the user isn't retrying it
    handleSubmitFn(event, options)
    setFiles(null)
  }

  return (
    <form
      className="flex flex-col gap-2 items-center sticky bottom-0 bg-white"
      onSubmit={handleSubmit}
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
            ) : file.type.startsWith("application/pdf") ? (
              <div
                key={file.name}
                className="text-[8px] leading-1 w-28 h-16 overflow-hidden text-zinc-500 border p-2 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
              >
                {file.name}
              </div>
            ) : null,
          )}
        </div>
      )}

      <div className="flex gap-1 bg-zinc-100 rounded-md px-2 py-1.5 w-full dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 md:max-w-[500px] max-w-[calc(100dvw-32px)]">
        <input
          className="outline-none flex-grow bg-transparent"
          placeholder="Send a message..."
          value={input}
          onChange={handleInputChange}
          onPaste={handlePaste}
        />
        {error && !isNewInputAvailable && (
          <div>
            <button type="button" onClick={() => reload()}>
              Retry
            </button>
          </div>
        )}
        {isLoading && (
          <div>
            <button type="button" onClick={stop}>
              Stop
            </button>
          </div>
        )}
        {!isLoading && ((error && isNewInputAvailable) || !error) && (
          <input type="submit" disabled={isLoading} />
        )}
      </div>
      {error && <div className="text-xs text-red">An error occurred.</div>}
      <div className="text-xs">Press Enter to send</div>
    </form>
  )
}
