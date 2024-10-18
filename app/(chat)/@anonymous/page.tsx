"use client"

import DragAndDropFilePicker from "@/components/drag-and-drop-file-picker"
import { ChatInput } from "@/components/input"
import { ChatBubble, LoadingChatBubble } from "@/components/message"
import { useChat } from "ai/react"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { MessageTreeNode } from "@/utils/message"

export default function AnonymousChatPage() {
  const [rootMessageTreeNode, setRootMessageTreeNode] = useState(
    new MessageTreeNode(),
  )
  const [latestMessageTreeNode, setLatestMessageTreeNode] =
    useState(rootMessageTreeNode)

  const customMessages = useMemo(
    () => latestMessageTreeNode.getMessages(),
    [latestMessageTreeNode],
  )
  const prevMessagesCount = useRef(0)

  const chat = useChat({
    keepLastMessageOnError: true,
    // TODO: Development purposes only
    onError: (error: Error) => {
      alert(`DEV: ${error}\nCheck console.`)
      console.error(error, error.stack)
    },
  })
  const { messages, setMessages, isLoading } = chat

  const [files, setFiles] = useState<FileList | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()

    // Message count change handler
    if (prevMessagesCount.current !== messages.length) {
      if (messages.length > prevMessagesCount.current) {
        console.log("New message!")
        // New message!
        // This should trigger once for every new message, and thus shouldn't handle multiple messages
        const newNode = latestMessageTreeNode.createChild(
          messages[messages.length - 1],
        )
        setLatestMessageTreeNode(newNode)
      } else {
        console.log("Deleted message!")
        // Fewer messages???
        // Send new message when error happens to previous message
        // (Does not trigger when resending an errored message)
        // But what if I edited the message? How do I disable this behavior?
        const parentNode = latestMessageTreeNode.parentNode
        if (parentNode) {
          parentNode.popChild()
          setLatestMessageTreeNode(parentNode)
        } else {
          throw new Error(
            "All messages are already deleted, this should be impossible!",
          )
        }
      }

      console.log("Change in message count:", { messages, customMessages })
      prevMessagesCount.current = messages.length
    }
  }, [messages])

  useEffect(() => {
    console.log("Change in custom messages:", { messages, customMessages })
  }, [customMessages])

  const editMessage = (node: MessageTreeNode) => {
    const parentNode = node.parentNode
    if (parentNode) {
      parentNode
      setLatestMessageTreeNode(parentNode)
    } else {
      throw new Error(
        "The root node has no message, this should be impossible!",
      )
    }
  }

  return (
    <DragAndDropFilePicker onAddFiles={setFiles}>
      <div className="flex flex-col justify-between gap-4">
        {messages.length > 0 ? (
          // Have existing messages
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
