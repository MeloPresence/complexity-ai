"use client"

import DragAndDropFilePicker from "@/components/drag-and-drop-file-picker"
import { ChatInput } from "@/components/input"
import { ChatBubble, LoadingChatBubble } from "@/components/message"
import { MessageTreeNode } from "@/utils/message"
import { Message } from "ai"
import { useChat } from "ai/react"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"

export default function AnonymousChatPage() {
  const [isSwappingMessageTreeBranches, setIsSwappingMessageTreeBranches] =
    useState<boolean>(false)
  const [latestMessageTreeNode, setLatestMessageTreeNode] = useState(
    new MessageTreeNode(),
  )

  const currentMessageNodePath = useMemo<MessageTreeNode[]>(
    () => latestMessageTreeNode.getMessageNodePath(),
    [latestMessageTreeNode],
  )
  const customMessages = useMemo<Message[]>(
    () => currentMessageNodePath.map((node) => node.getMessage()!),
    [currentMessageNodePath],
  )

  const prevMessagesCount = useRef(0)

  const chat = useChat({
    keepLastMessageOnError: true,
    onError: (error: Error) => {
      // TODO: Development purposes only
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

    // This flag is used to edit the messages array without triggering this side effect
    if (isSwappingMessageTreeBranches) {
      setIsSwappingMessageTreeBranches(false)
      return
    }

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
        const difference = prevMessagesCount.current - messages.length
        let parentNode: MessageTreeNode | null = null
        for (let i = 0; i < difference; i++) {
          if (i === 0) {
            parentNode = latestMessageTreeNode.getParentNode()
          } else {
            parentNode = parentNode ? parentNode.getParentNode() : null
          }
        }
        // Fewer messages
        // Send new message when error happens to previous message
        // (Does not trigger when resending an errored message)
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
    } else if (latestMessageTreeNode.getParentNode()) {
      // equals
      console.log("Updated message!")
      const parentNode = latestMessageTreeNode.getParentNode()!
      parentNode.popChild()
      const newNode = parentNode.createChild(messages[messages.length - 1])
      setLatestMessageTreeNode(newNode)
    }
  }, [messages])

  return (
    <DragAndDropFilePicker onAddFiles={setFiles}>
      <div className="flex flex-col w-full gap-4">
        {currentMessageNodePath.length > 0 ? (
          // Have existing messages
          <div className="flex flex-col gap-2 items-center min-h-full ml-60 mr-60">
            {currentMessageNodePath.map((node, index) => (
              <ChatBubble
                {...{
                  node,
                  index,
                  chat,
                  isLatestMessage: index === customMessages.length - 1,
                  setIsSwappingMessageTreeBranches,
                  setLatestMessageTreeNode,
                }}
                key={node.getMessage()!.id}
              />
            ))}

            {isLoading &&
              currentMessageNodePath[
                currentMessageNodePath.length - 1
              ].getMessage()!.role !== "assistant" && <LoadingChatBubble />}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          // No messages (new conversation)
          <div className="justify-center h-[360px] w-full md:w-[100%] pt-20">
            <div className="font-sans text-[32px] font-semibold text-center py-40 flex flex-col text-stone-700">
              <p>
                How can I assist you today?
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
