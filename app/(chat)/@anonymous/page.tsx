"use client"

import DragAndDropFilePicker from "@/components/drag-and-drop-file-picker"
import { ChatInput } from "@/components/input"
import { AnimatedMarkdown as Markdown } from "@/components/markdown/markdown"
import { useChat } from "ai/react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

function getTextFromDataUrl(dataUrl: string) {
  const base64 = dataUrl.split(",")[1]
  // Yes, it's (Awful to Beautiful) for (Base64 to readable ASCII text)
  return window.atob(base64)
}

export default function AnonymousChatPage() {
  const chat = useChat({
    keepLastMessageOnError: true,
    // TODO: Development purposes only
    onError: (error: Error) => {
      alert(`DEV: ${error}\nCheck console.`)
      console.error(error, error.stack)
    },
  })
  const { messages, isLoading } = chat

  const [files, setFiles] = useState<FileList | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <DragAndDropFilePicker onAddFiles={setFiles}>
      <div className="flex flex-col justify-between gap-4">
        {messages.length > 0 ? (
          // Have existing messages
          <div className="flex flex-col gap-2 items-center min-h-full">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`group hover:bg-zinc-100 flex flex-col gap-1 px-4 w-full md:w-[500px] md:px-0 ${
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
                    {/*File attachements*/}
                    <div className="flex flex-row gap-2">
                      {message.experimental_attachments?.map((attachment) =>
                        attachment.contentType?.startsWith("image") ? (
                          <img
                            className="rounded-md w-40 mb-3"
                            key={attachment.name}
                            src={attachment.url}
                            alt={attachment.name}
                          />
                        ) : attachment.contentType?.startsWith("text") ? (
                          <div className="text-xs w-40 h-24 overflow-hidden text-zinc-400 border p-2 rounded-md dark:bg-zinc-800 dark:border-zinc-700 mb-3">
                            {getTextFromDataUrl(attachment.url)}
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
            ))}

            {isLoading &&
              messages[messages.length - 1].role !== "assistant" && (
                <div className="flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0">
                  <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400"></div>
                  <div className="flex flex-col gap-1 text-zinc-400">
                    <div>hmm...</div>
                  </div>
                </div>
              )}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          // No messages (new conversation)
          <div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
            <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
              <p>
                Start messaging below. Drag and drop or paste a document to
                extract and query information related to it.
              </p>
              <p>
                <Link href="/login">Log in</Link> or{" "}
                <Link href="/register">register</Link> to access more features
              </p>
            </div>
          </div>
        )}

        <ChatInput {...{ files, setFiles, chat }} />
      </div>
    </DragAndDropFilePicker>
  )
}
