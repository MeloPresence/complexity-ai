"use client"

import {
  createConversation,
  getConversation,
  updateConversation,
} from "@/actions/conversations"
import DragAndDropFilePicker from "@/components/drag-and-drop-file-picker"
import { ChatInput } from "@/components/input"
import { ChatBubble, LoadingChatBubble } from "@/components/message"
import {
  FirebaseUserContext,
  IsAuthenticatedContext,
  IsLoadingContext,
} from "@/lib/client/firebase/user"
import { Conversation } from "@/lib/conversation"
import { MessageTreeNode } from "@/lib/message"
import { type Message as UiMessage, useChat } from "ai/react"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useMemo, useRef, useState } from "react"

export function Chat({
  conversationId: originalConversationId = null,
}: {
  conversationId?: string | null
}) {
  const isLoadingAuthentication = useContext<boolean>(IsLoadingContext)
  const router = useRouter()
  const rootMessageTreeNode = new MessageTreeNode()
  const [isSwappingMessageTreeBranches, setIsSwappingMessageTreeBranches] =
    useState<boolean>(false)
  const [latestMessageTreeNode, setLatestMessageTreeNode] =
    useState(rootMessageTreeNode)

  const currentMessageNodePath = useMemo<MessageTreeNode[]>(
    () => latestMessageTreeNode.getMessageNodePath(),
    [latestMessageTreeNode],
  )
  const customMessages = useMemo<UiMessage[]>(
    () => currentMessageNodePath.map((node) => node.getMessage()!),
    [currentMessageNodePath],
  )

  const prevMessagesCount = useRef(0)

  const user = useContext(FirebaseUserContext)
  const isAuthenticated = useContext<boolean>(IsAuthenticatedContext)

  useEffect(() => {
    console.log({ isLoadingAuthentication, user })
  }, [isLoadingAuthentication, user])

  const chat = useChat({
    keepLastMessageOnError: true,
    // ISSUE: useEffect is not yet triggered
    // I can't really just hack in sending the message tree in this request because what about message editing and message branch swapping?
    // Maybe I should just POST the tree to /api/conversations after the useEffect?
    // If the user newly loads a /chat/<id>, GET the tree at /api/conversations first
    // https://sdk.vercel.ai/examples/next/chat/use-chat-custom-body
    // ts-expect-error Somehow the return type isn't a JSONValue???
    // experimental_prepareRequestBody: ({ messages }) => {
    //   console.log("experimental_prepareRequestBody", { messages })
    //   return { messages }
    // },
    onError: (error: Error) => {
      // TODO: Development purposes only
      alert(`DEV: ${error}\nCheck console.`)
      console.error(error, error.stack)
    },
  })
  const { messages, setMessages, isLoading } = chat

  const [files, setFiles] = useState<FileList | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [conversationTitle, setConversationTitle] = useState<string | null>(
    null,
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  function consumeAnnotations(latestAssistantMessage: UiMessage) {
    if (latestAssistantMessage.annotations) {
      const annotations = latestAssistantMessage.annotations
      const annotationsToRemove = []
      for (const annotation of annotations) {
        // TODO: Maybe use zod? Or is this type of "optional but strict programming" better?
        if (
          !annotation ||
          typeof annotation !== "object" ||
          Array.isArray(annotation)
        )
          continue
        if (
          annotation.previousUserMessageAttachments &&
          typeof annotation.previousUserMessageAttachments === "object" &&
          Array.isArray(annotation.previousUserMessageAttachments)
        ) {
          const latestUserMessage = messages.at(-2)!
          annotation.previousUserMessageAttachments.forEach((attachment) => {
            if (
              attachment &&
              typeof attachment === "object" &&
              !Array.isArray(attachment) &&
              typeof attachment.geminiFilesApiUri === "string"
            ) {
              // Silently modify without triggering a rerender?
              latestUserMessage.experimental_attachments!.forEach(
                (oldAttachment) => {
                  // To show the encrypted Gemini Files API asset to the user, I would need to "tunnel" the request?
                  // But files stored there are temporary, so really I should be storing it in my database
                  // @ts-expect-error Somehow I should override the built-in Attachment type if possible?
                  oldAttachment.geminiFilesApiUri =
                    attachment.geminiFilesApiUri as string | undefined
                  // @ts-expect-error Somehow I should override the built-in Attachment type if possible?
                  oldAttachment.geminiFilesApiExpirationTimestamp =
                    attachment.geminiFilesApiExpirationTimestamp as
                      | string
                      | undefined
                  // @ts-expect-error Somehow I should override the built-in Attachment type if possible?
                  oldAttachment.storageBucketUri =
                    attachment.storageBucketUri as string | undefined
                  // TODO: Remove url (base-64 binary blob) if already uploaded to storage bucket
                },
              )
            }
          })
          annotationsToRemove.push(annotation)
        } else if (annotation.title && typeof annotation.title === "string") {
          setConversationTitle(annotation.title)
          annotationsToRemove.push(annotation)
        }
      }
      console.log(latestAssistantMessage, latestAssistantMessage.annotations)
      // Silently remove annotations without triggering a rerender?
      annotationsToRemove.forEach((annotation) => {
        const index = latestAssistantMessage.annotations!.indexOf(annotation)!
        latestAssistantMessage.annotations!.splice(index, 1)
      })
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

  const [conversationId, setConversationId] = useState<string | null>(
    originalConversationId,
  )

  function createOrUpdateConversation() {
    if (user && latestMessageTreeNode.getMessage()) {
      const rootNode = latestMessageTreeNode.getRootNode()
      const conversation = new Conversation(
        conversationTitle || "Untitled",
        user.uid,
        false,
        rootNode,
      )
      console.log("createOrUpdateConversation", latestMessageTreeNode, rootNode)
      if (!conversationId) {
        createConversation(conversation.toModel()).then((id) => {
          setConversationId(id)
          const newUrl = `/${id}`
          window.history.replaceState(
            {
              ...window.history.state,
              as: newUrl,
              url: newUrl,
            },
            "",
            newUrl,
          )
        })
      } else {
        console.debug(
          "before updateConversation in chat.tsx",
          rootNode,
          conversation.toModel(),
        )
        updateConversation(conversationId, conversation.toModel())
      }
    }
  }

  useEffect(() => {
    const latestMessage = latestMessageTreeNode.getMessage()
    if (
      latestMessage?.annotations?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (annotation) => (annotation as any)?.finished === true,
      )
    ) {
      // Remove finished=true from latestMessage.annotations
      createOrUpdateConversation()
    }
  }, [latestMessageTreeNode])

  useEffect(() => {
    if (user && conversationId) {
      getConversation(user.uid, conversationId)
        .then((data) => {
          const conversation = Conversation.fromModel(data)
          setIsSwappingMessageTreeBranches(true)
          const latestLeafNode = conversation.messageTree.getLatestLeafNode()
          setLatestMessageTreeNode(latestLeafNode)
          setConversationTitle(conversation.name)
          const messages = latestLeafNode
            .getMessageNodePath()
            .map((node) => node.getMessage()!)
          setMessages(messages)
          prevMessagesCount.current = messages.length
        })
        .catch(() => router.push("/"))
    }
  }, [user, conversationId])
  return (
    <DragAndDropFilePicker onAddFiles={setFiles}>
      <div className="flex flex-col w-full justify-between gap-4 dark:bg-neutral-800">
        {currentMessageNodePath.length > 0 ? (
          // Have existing messages
          <div className="flex flex-col gap-2 items-center min-h-full ml-60 mr-60">
            <div className="w-full">
              <div>Title: {conversationTitle || "no title"}</div>
              <div>ID: {conversationId || "no ID"}</div>
            </div>
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
            <div className="font-sans text-[32px] font-semibold text-center gap-4 py-40 flex flex-col text-stone-700 dark:text-white">
              <p>How can I assist you today?</p>
              {!isAuthenticated && (
                <div className="font-sans font-extralight text-[14px] dark:text-stone-400">
                  <p>Sign up or login to access more features</p>
                </div>
              )}
            </div>
          </div>
        )}

        <ChatInput {...{ files, setFiles, chat }} />
      </div>
    </DragAndDropFilePicker>
  )
}
