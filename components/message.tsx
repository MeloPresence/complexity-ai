import { AnimatedMarkdown as Markdown } from "@/components/markdown/markdown"
import { Message } from "ai"
import type { useChat } from "ai/react"

const getTextFromDataUrl = (dataUrl: string): string => {
  const base64 = dataUrl.split(",")[1]
  // Yes, it's (Awful to Beautiful) for (Base64 to readable ASCII text)
  return window.atob(base64)
}

const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

export function ChatBubble({
  message,
  index,
  chat,
  className = "",
  ...props
}: {
  message: Message
  index: number
  chat: ReturnType<typeof useChat>
  className?: string
  props?: unknown
}) {
  const { isLoading, messages } = chat
  return (
    <div
      {...props}
      className={`${className} group hover:bg-zinc-100 flex flex-col gap-1 px-4 w-full md:w-[500px] md:px-0 ${
        index === 0 ? "mt-20" : ""
      }`}
    >
      <div className="flex gap-2">
        {/*Sender icon*/}
        <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
          {message.role === "assistant" ? "🤖" : "👤"}
        </div>

        {/*Message*/}
        <div className="flex flex-col gap-1 max-w-full">
          {/*Text content*/}
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4 markdown">
            {message.role === "assistant" ? (
              <Markdown>{message.content}</Markdown>
            ) : (
              message.content
            )}
          </div>
          {/*File attachments*/}
          <div className="flex flex-row gap-2">
            {message.experimental_attachments?.map((attachment) =>
              attachment.contentType?.startsWith("image/") ? (
                <img
                  className="rounded-md w-40 mb-3"
                  key={attachment.name}
                  src={attachment.url}
                  alt={attachment.name}
                />
              ) : attachment.contentType?.startsWith("text/") ? (
                <div className="text-xs w-40 h-24 overflow-hidden text-zinc-400 border p-2 rounded-md dark:bg-zinc-800 dark:border-zinc-700 mb-3">
                  {getTextFromDataUrl(attachment.url)}
                </div>
              ) : attachment.contentType?.startsWith("application/pdf") ? (
                <div className="text-xs w-40 h-24 overflow-hidden text-zinc-400 border p-2 rounded-md dark:bg-zinc-800 dark:border-zinc-700 mb-3">
                  {attachment.name}
                </div>
              ) : null,
            )}
          </div>
        </div>
      </div>

      {/*Bottom bar context menu (hidden when last message is still streaming)*/}
      {(index !== messages.length - 1 ||
        (index === messages.length - 1 && !isLoading)) && (
        <div className="flex gap-1 text-sm bg-zinc-200 invisible group-hover:visible">
          <div className="text-xs">
            Bottom bar context menu for{" "}
            {message.role === "assistant" ? "🤖" : "👤"}
          </div>

          <button
            className="bg-zinc-100"
            onClick={() => copyToClipboard(message.content)}
          >
            Copy
          </button>

          {message.role === "assistant" ? (
            <>{/*AI-specific actions*/}</>
          ) : (
            <>{/*User-specific actions*/}</>
          )}
        </div>
      )}
    </div>
  )
}

export function LoadingChatBubble() {
  return (
    <div className="flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0">
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400"></div>
      <div className="flex flex-col gap-1 text-zinc-400">
        <div>hmm...</div>
      </div>
    </div>
  )
}
