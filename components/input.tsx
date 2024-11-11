import TextFilePreview from "@/components/text-file-preview"
import { isValidAttachment } from "@/utils/validation"
import { type useChat } from "ai/react"
import { PaperPlaneIcon, StopIcon } from "@radix-ui/react-icons";
import { BsPaperclip } from "react-icons/bs";
import { HiOutlinePaperClip } from "react-icons/hi";

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      const validFiles = Array.from(uploadedFiles).filter(isValidAttachment);

      if (validFiles.length === uploadedFiles.length) {
        setFiles(uploadedFiles);
      } else {
        alert("Only image and text files are allowed");
      }
    }
  };


  const isNewInputAvailable = input || files?.length

  const handleSubmit = () => {
    if (!isNewInputAvailable) {
      if (error) reload();
      return;
    }

    const options = files ? { experimental_attachments: files } : {}
    if (error) setMessages(messages.slice(0, -1)) // Remove last message because the user isn't retrying it
    handleSubmitFn(event, options)
    setFiles(null)
  }

  // File removal
  const handleDeleteFile = (index: number) => {
    if (!files) return;
    const updatedFilesArray = Array.from(files);
    updatedFilesArray.splice(index, 1);

    const dataTransfer = new DataTransfer();
    updatedFilesArray.forEach((file) => dataTransfer.items.add(file));
    setFiles(dataTransfer.files);
  };

  return (
    <form
      className="flex flex-col gap-1 items-center sticky bottom-0 bg-white dark:bg-neutral-800"
      onSubmit={handleSubmit}
    >
      {files && files.length > 0 && (
  <div className="flex flex-row gap-2 bottom-12 px-4 w-full md:w-[800px] md:px-0">
    {Array.from(files).map((file, index) =>
      file.type.startsWith("image") ? (
        <div key={file.name} className="relative">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="rounded-md w-16"
          />
          <button
            onClick={() => handleDeleteFile(index)}
            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>
      ) : file.type.startsWith("text") ? (
        <div
          key={file.name}
          className="relative text-[8px] leading-1 w-28 h-16 overflow-hidden text-zinc-500 border p-2 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
        >
          <TextFilePreview file={file} />
          <button
            onClick={() => handleDeleteFile(index)}
            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>
      ) : file.type.startsWith("application/pdf") ? (
        <div
          key={file.name}
          className="relative text-[8px] leading-1 w-28 h-16 overflow-hidden text-zinc-500 border p-2 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
        >
          {file.name}
          <button
            onClick={() => handleDeleteFile(index)}
            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>
      ) : null,
    )}
  </div>
)}

<form className="flex bg-zinc-100 dark:bg-neutral-700 rounded-3xl p-3 py-1 w-full md:max-w-[810px] max-w-[calc(100dvw-32px)]">
      {/* Paperclip Icon Button for File Input */}
      <div className="mr-auto py-2.5">
        <label htmlFor="file-upload" className="cursor-pointer">
          <HiOutlinePaperClip className="text-xl text-black dark:text-white" />
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileUpload} // Implement this function for file upload handling
        />
      </div>

      {/* Textarea for Message Input */}
      <textarea
        className="outline-none flex-grow bg-transparent text-black dark:text-white resize-none overflow-y-auto max-h-40 text-left ml-2"
        placeholder="Send a message or drop a file"
        value={input}
        onChange={handleInputChange}
        onPaste={handlePaste}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent new line
            handleSubmit(); // Call your submit function
          }
        }}
        style={{
          height: '40px',
          maxHeight: '10rem', // Limit max height for vertical scrolling
          overflowY: 'auto', // Add vertical scrollbar when text overflows
          textAlign: 'left', // Center horizontally
          paddingTop: '0.5rem' // Align text starting at top
        }}
      />

      {/* Retry Button for Error */}
      {error && !isNewInputAvailable && (
        <div>
          <button type="button" onClick={() => reload()}>
            Retry
          </button>
        </div>
      )}

      {/* Stop Button for Loading */}
      {isLoading && (
        <div>
          <button
            type="button"
            onClick={stop}
          >
            <StopIcon className="size-[18px] mr-2 mt-3"/>
          </button>
        </div>
      )}

      {/* Send Button */}
      {!isLoading && ((error && isNewInputAvailable) || !error) && (
        <button
          type="submit"
          className="bg-zinc-100 dark:bg-neutral-700 rounded-full p-2"
          title="Send"
          disabled={isLoading}
        >
          <PaperPlaneIcon className="size-[18px]"/>
        </button>
      )}

      {/* Error Message */}
      {error && <div className="text-xs text-red">An error occurred.</div>}


    </form>
    {/* Hint Text */}
    <div className="text-xs dark:text-stone-400 m-2">Press Enter to send</div>
</form>)}
