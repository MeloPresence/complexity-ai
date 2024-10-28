"use client"

import DragAndDropFilePicker from "@/components/drag-and-drop-file-picker"
import { ChatInput } from "@/components/input"
import { ChatBubble, LoadingChatBubble } from "@/components/message"
import { useChat } from "ai/react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { processAudioFile } from "@/utils/processAudio";

export default function AnonymousChatPage() {
  const chat = useChat({
    keepLastMessageOnError: true,
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

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Process audio files
  useEffect(() => {
    if (files) {
      Array.from(files).forEach(async (file) => {
        if (file.type.startsWith("audio/mpeg")) {
          const mediaPath = URL.createObjectURL(file);
          await processAudioFile(mediaPath);
        } else {
          console.error("Unsupported file type:", file.type);
        }
      });
    }
  }, [files]);

  return (
    <DragAndDropFilePicker onAddFiles={setFiles}>
      <div className="flex flex-col justify-between gap-4">
        {messages.length > 0 ? (
          <div className="flex flex-col gap-2 items-center min-h-full">
            {messages.map((message, index) => (
              <ChatBubble {...{ message, index, chat }} key={message.id} />
            ))}
            {isLoading &&
              messages[messages.length - 1].role !== "assistant" && (
                <LoadingChatBubble />
              )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
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
