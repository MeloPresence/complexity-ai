"use client"

import DragAndDropFilePicker from "@/components/drag-and-drop-file-picker"
import { ChatInput } from "@/components/input"
import { ChatBubble, LoadingChatBubble } from "@/components/message"
import { MessageTreeNode } from "@/lib/message"
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

  function consumeAnnotations(latestAssistantMessage: Message) {
    if (latestAssistantMessage.annotations) {
      const annotations = latestAssistantMessage.annotations
      if (
        // TODO: Maybe use zod? Or is this type of "optional but strict programming" better?
        annotations[0] &&
        typeof annotations[0] === "object" &&
        !Array.isArray(annotations[0]) &&
        annotations[0].previousUserMessageAttachments &&
        typeof annotations[0].previousUserMessageAttachments === "object" &&
        Array.isArray(annotations[0].previousUserMessageAttachments)
      ) {
        const latestUserMessage = messages.at(-2)!
        annotations[0].previousUserMessageAttachments.forEach((attachment) => {
          if (
            attachment &&
            typeof attachment === "object" &&
            !Array.isArray(attachment) &&
            typeof attachment.filesApiUri === "string"
          ) {
            // Silently modify without triggering a rerender?
            latestUserMessage.experimental_attachments!.forEach(
              (oldAttachment) =>
                // To show the encrypted Gemini Files API asset to the user, I would need to "tunnel" the request?
                // But files stored there are temporary, so really I should be storing it in my database
                // @ts-expect-error Somehow I should override the built-in Attachment type if possible?
                (oldAttachment.filesApiUri = attachment.filesApiUri),
            )
          }
        })
      }
      console.log(latestAssistantMessage, latestAssistantMessage.annotations)
      // Silently remove annotations without triggering a rerender?
      latestAssistantMessage.annotations = undefined
    }
  }

  useEffect(() => {
    scrollToBottom()

    const latestMessage = messages.at(-1)

    if (latestMessage?.role === "assistant") consumeAnnotations(latestMessage)

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
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [messages])

  return (
    <DragAndDropFilePicker onAddFiles={setFiles}>
      <div className="flex flex-col w-full justify-between gap-4">
        {currentMessageNodePath.length > 0 ? (
          // Have existing messages
          <div className="flex flex-col gap-2 items-center min-h-full w-full">
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
