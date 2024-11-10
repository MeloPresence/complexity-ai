import type { ModdedCoreMessage, ModdedFilePart } from "@/lib/server/message"
import { type Attachment, type CoreToolMessage, type ToolInvocation } from "ai"
import { Message as UiMessage } from "ai/react"

export type ModdedUiMessage = Omit<UiMessage, "ui" | "createdAt"> & {
  createdAt?: number
  ui: undefined
}

export interface MessageTreeNodeDataModel {
  message: ModdedUiMessage | null
  // There's no need for parent node to be stored as data! It's only for object reference/pointer purposes!
  childNodes: MessageTreeNodeDataModel[]
}

export type PossiblyUploadedAttachment = Attachment & {
  storageBucketUri?: string // Our own
  geminiFilesApiUri?: string // Gemini File APIs
  geminiFilesApiExpirationTimestamp?: number // Timestamp
}

function unmodUiMessage(modded: ModdedUiMessage): UiMessage {
  return {
    ...modded,
    createdAt:
      typeof modded.createdAt === "number"
        ? new Date(modded.createdAt)
        : undefined,
  }
}

function modUiMessage(vanilla: UiMessage): ModdedUiMessage {
  return {
    ...vanilla,
    ui: undefined,
    createdAt: vanilla.createdAt?.valueOf(),
  }
}

export class MessageTreeNode {
  public constructor(
    private message: UiMessage | null = null, // null if root node
    private parentNode: MessageTreeNode | null = null,
    private readonly childNodes: MessageTreeNode[] = [],
  ) {}

  /**
   * Use this only on the root node data model!
   * @param data
   */
  public static fromModel(data: MessageTreeNodeDataModel): MessageTreeNode {
    if (data.message)
      throw new Error("The root node data model should have no message")

    const rootNode = new MessageTreeNode()
    const addChildren = (
      node: MessageTreeNode,
      data: MessageTreeNodeDataModel,
    ) => {
      node.message = data.message ? unmodUiMessage(data.message) : null
      data.childNodes.forEach((childData) => {
        const childNode = new MessageTreeNode(
          childData.message ? unmodUiMessage(childData.message) : null,
          node,
        )
        addChildren(childNode, childData)
        node.childNodes.push(childNode)
      })
    }

    addChildren(rootNode, data)

    return rootNode
  }

  public toModel(): MessageTreeNodeDataModel {
    const { message, childNodes: childNodeInstances } = this
    const childNodes = childNodeInstances.map((node) => node.toModel())
    return {
      message: message ? modUiMessage(message) : null,
      childNodes,
    }
  }

  // Excludes the root, which has no message
  public getMessageNodePath(): MessageTreeNode[] {
    if (!this.parentNode) return []
    return [...this.parentNode.getMessageNodePath(), this]
  }

  public getLatestLeafNode(): MessageTreeNode {
    if (this.childNodes.length === 0) return this

    return this.childNodes.at(-1)!.getLatestLeafNode()
  }

  public getMessage(): UiMessage | null {
    return this.message
  }

  public createChild(message: UiMessage): MessageTreeNode {
    const newNode = new MessageTreeNode(message, this)
    this.childNodes.push(newNode)
    return newNode
  }

  public popChild(): MessageTreeNode | undefined {
    const childNode = this.childNodes.pop()
    if (childNode) childNode.parentNode = null
    return childNode
  }

  public getParentNode(): MessageTreeNode | null {
    return this.parentNode
  }

  public getRootNode(): MessageTreeNode {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: MessageTreeNode = this
    while (node.parentNode) node = node.parentNode
    return node
  }

  public getChildrenCount(): number {
    return this.childNodes.length
  }

  public getIndexOfChild(node: MessageTreeNode): number {
    return this.childNodes.indexOf(node)
  }

  public getChildAtIndex(index: number): MessageTreeNode {
    return this.childNodes[index]
  }
}

// https://github.com/vercel/ai-chatbot/blob/23660c5ad1e3ab2fb3229515c08d72e2977358ef/app/(chat)/chat/%5Bid%5D/page.tsx#L43
export function convertToUiMessages(
  coreMessages: Array<ModdedCoreMessage>,
): Array<UiMessage> {
  return coreMessages.reduce((uiMessages: Array<UiMessage>, coreMessage) => {
    if (coreMessage.role === "tool") {
      // CoreToolMessages are not converter to UI SDK messages!?
      // This means the length of messages on the client and server will be different!
      return uiMessages.map((uiMessage) =>
        addCoreToolMessageResult(coreMessage, uiMessage),
      )
    }

    const uiMessage = convertToUiMessage(coreMessage)
    uiMessages.push(uiMessage)

    return uiMessages
  }, [])
}

function convertToUiMessage(coreMessage: ModdedCoreMessage): UiMessage {
  let textContent = ""
  const toolInvocations: Array<ToolInvocation> = []
  const experimental_attachments: PossiblyUploadedAttachment[] = []

  if (typeof coreMessage.content === "string") {
    textContent = coreMessage.content
  } else if (Array.isArray(coreMessage.content)) {
    for (const content of coreMessage.content) {
      switch (content.type) {
        case "text":
          textContent += content.text
          break
        case "tool-call":
          toolInvocations.push({
            state: "call",
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          })
          break
        case "image":
          // This type is currently unused since everything is uploaded to Gemini Files API
          console.warn("There shouldn't be images in ModdedCoreMessage!")
          break
        case "file":
          const {
            name,
            geminiFilesApiUri,
            geminiFilesApiExpirationTimestamp,
            storageBucketUri,
          } = content as ModdedFilePart
          experimental_attachments.push({
            contentType: content.mimeType,
            name,
            url: content.data as string,
            geminiFilesApiUri,
            geminiFilesApiExpirationTimestamp,
            storageBucketUri,
          })
          break
      }
    }
  }

  return {
    id: generateUUID(),
    role: coreMessage.role,
    content: textContent,
    toolInvocations,
    experimental_attachments,
  }
}

function addCoreToolMessageResult(
  coreToolMessage: CoreToolMessage,
  uiMessage: UiMessage,
): UiMessage {
  if (uiMessage.toolInvocations) {
    return {
      ...uiMessage,
      toolInvocations: uiMessage.toolInvocations.map((toolInvocation) => {
        const toolResult = coreToolMessage.content.find(
          (tool) => tool.toolCallId === toolInvocation.toolCallId,
        )

        if (toolResult) {
          return {
            ...toolInvocation,
            state: "result",
            result: toolResult.result,
          }
        }

        return toolInvocation
      }),
    }
  }

  return uiMessage
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
