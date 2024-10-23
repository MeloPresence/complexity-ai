import { AnimatedMarkdown as Markdown } from "@/components/markdown/markdown"
import { MessageTreeNode } from "@/utils/message"
import type { useChat } from "ai/react"
import React, { useCallback, useMemo, useState } from "react"

const getTextFromDataUrl = (dataUrl: string): string => {
  const base64 = dataUrl.split(",")[1]
  // Yes, it's (Awful to Beautiful) for (Base64 to readable ASCII text)
  return window.atob(base64)
}

const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

export function ChatBubble({
  node,
  index,
  chat: { isLoading, setMessages, error, messages, append },
  isLatestMessage,
  setIsSwappingMessageTreeBranches,
  setLatestMessageTreeNode,
  className = "",
  ...props
}: {
  node: MessageTreeNode
  index: number
  chat: ReturnType<typeof useChat>
  isLatestMessage: boolean
  setIsSwappingMessageTreeBranches: (value: boolean) => void
  setLatestMessageTreeNode: (value: MessageTreeNode) => void
  className?: string
  props?: unknown
}) {
  const message = node.getMessage()
  if (!message) throw new Error("Node has no message")

  const [isEditModeEnabled, setIsEditModeEnabled] = useState<boolean>(false)
  const [editInput, setEditInput] = useState<string>("")

  const enableEditMode = useCallback(() => {
    setEditInput(message.content)
    setIsEditModeEnabled(true)
  }, [message])

  const disableEditMode = () => {
    setIsEditModeEnabled(false)
  }

  const isNewInputAvailable = useMemo(
    () => editInput && editInput !== message.content,
    [editInput, message],
  )

  const parentNode: MessageTreeNode = useMemo(
    () => node.getParentNode()!,
    [node],
  )

  const handleSubmitForEdit = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    if (!isNewInputAvailable) return

    console.log("Editing message!")
    const options = message.experimental_attachments
      ? { experimental_attachments: message.experimental_attachments }
      : {}
    // Remove last message because the user isn't retrying it (UNTESTED)
    if (error) setMessages(messages.slice(0, -1))
    // Create a clone of the last USER message as a new branching node
    // Last USER message is two indexes from the end! (end AI) -> (User) -> (AI)...
    parentNode.createChild(messages[messages.length - 2])
    // After this blocking function is done, the useEffect in page.tsx will
    // remove the cloned last USER message, which means the next node.createChild
    // will be a new branch
    setMessages(
      node
        .getMessageNodePath()
        .map((node) => node.getMessage()!)
        .slice(0, -1),
    )
    // This function is async
    // This triggers the useEffect in page.tsx to add new nodes
    // Thanks to the previous child clone, it creates new children as a new branch
    append({
      content: editInput,
      role: "user",
      ...options,
    })
    disableEditMode()
  }

  const numOfSiblings = parentNode.getChildrenCount() || 1

  const siblingIndex = parentNode.getIndexOfChild(node)

  const handleSwap = (index: number) => {
    setIsSwappingMessageTreeBranches(true)
    const sibling = parentNode.getChildAtIndex(index)
    const latestNode = sibling.getLatestLeafNode()
    setLatestMessageTreeNode(latestNode)
    setMessages(
      latestNode.getMessageNodePath().map((node) => node.getMessage()!),
    )
  }

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
        {isEditModeEnabled ? (
          <textarea
            defaultValue={editInput}
            onChange={(event) => {
              setEditInput(event.target.value)
            }}
          />
        ) : (
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
        )}
      </div>

      {/*Bottom bar context menu (hidden when last message is still streaming)*/}
      {(!isLatestMessage || (isLatestMessage && !isLoading)) && (
        <div
          className={`${isEditModeEnabled ? "visible" : "invisible"} flex gap-1 text-sm bg-zinc-200 group-hover:visible`}
        >
          <div className="text-xs">
            Bottom bar context menu for{" "}
            {message.role === "assistant" ? "🤖" : "👤"}
          </div>

          {!isEditModeEnabled && (
            <>
              <button
                className="bg-zinc-100"
                onClick={() => copyToClipboard(message.content)}
              >
                Copy
              </button>
            </>
          )}

          {message.role === "assistant" ? (
            <>{/*AI-specific actions*/}</>
          ) : (
            <>
              {/*User-specific actions*/}
              {isEditModeEnabled ? (
                <>
                  <button className="bg-zinc-100" onClick={disableEditMode}>
                    Cancel
                  </button>
                  <button className="bg-zinc-100" onClick={handleSubmitForEdit}>
                    Submit
                  </button>
                </>
              ) : (
                <>
                  <button className="bg-zinc-100" onClick={enableEditMode}>
                    Edit
                  </button>
                  {numOfSiblings > 1 && (
                    <>
                      <div>
                        {siblingIndex + 1}/{numOfSiblings}
                      </div>
                      <button
                        className="bg-zinc-100"
                        disabled={siblingIndex === 0}
                        onClick={() => handleSwap(siblingIndex - 1)}
                      >
                        Swap left
                      </button>
                      <button
                        className="bg-zinc-100"
                        disabled={siblingIndex === numOfSiblings - 1}
                        onClick={() => handleSwap(siblingIndex + 1)}
                      >
                        Swap right
                      </button>
                    </>
                  )}
                </>
              )}
            </>
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
