import { MessageTreeNode } from "@/lib/message"
import {
  type DocumentReference,
  type DocumentSnapshot,
  type WriteResult,
} from "firebase-admin/firestore"

export interface ConversationDataModel {
  name: string
  userId: string
  isPublic: boolean
  /**
   * This is MessageTreeNodeDataModel stringified because Firestore has 20 depth limit
   * But there is also a 1048487 bytes (~1 MB) limit
   */
  // TODO: Arbitrarily limit messages to ~10 length
  messageTreeJson: string
}

export interface ConversationInfo {
  id: string
  name: string
  createTime: string
  readTime: string
  updateTime: string
}

export class Conversation {
  public constructor(
    private _name: string,
    private _userId: string,
    private isPublic: boolean,
    private _messageTree: MessageTreeNode,
  ) {}

  public static fromModel(data: ConversationDataModel): Conversation {
    return new Conversation(
      data.name,
      data.userId,
      data.isPublic,
      MessageTreeNode.fromModel(JSON.parse(data.messageTreeJson)),
    )
  }

  public toModel(): ConversationDataModel {
    const { name, userId, isPublic, _messageTree: messageTreeInstance } = this
    const messageTree = messageTreeInstance.toModel()
    const messageTreeJson = JSON.stringify(messageTree)
    return {
      name,
      userId,
      isPublic,
      messageTreeJson,
    }
  }

  get messageTree(): MessageTreeNode {
    return this._messageTree
  }

  get name(): string {
    return this._name
  }

  get userId(): string {
    return this._userId
  }
}

export interface ConversationServiceInterface {
  createConversation(
    conversation: Conversation,
  ): Promise<DocumentReference<Conversation, ConversationDataModel>> // TODO: Generalize Firestore return type

  deleteConversation(conversationId: string): Promise<WriteResult> // TODO: Generalize Firestore return type

  updateConversation(
    conversationId: string,
    conversation: Conversation,
  ): Promise<WriteResult> // TODO: Generalize Firestore return type

  getConversation(
    userId: string,
    conversationId: string,
  ): Promise<DocumentSnapshot<Conversation, ConversationDataModel>> // TODO: Generalize Firestore return type
}

export type ConversationInfoWithUrl = ConversationInfo & { url: string }

export type CategorizedConversationInfo = {
  today: ConversationInfoWithUrl[]
  yesterday: ConversationInfoWithUrl[]
  previous30days: ConversationInfoWithUrl[]
  older: ConversationInfoWithUrl[]
}

export function categorizeConversationsByTime(
  conversations: ConversationInfo[],
): CategorizedConversationInfo {
  const today = new Date()
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)
  const startOf30DaysAgo = new Date(startOfToday)
  startOf30DaysAgo.setDate(startOf30DaysAgo.getDate() - 30)

  const categorized: CategorizedConversationInfo = {
    today: [],
    yesterday: [],
    previous30days: [],
    older: [],
  }

  conversations
    .map((conversation): [ConversationInfo, Date] => [
      conversation,
      new Date(conversation.updateTime),
    ])
    .toSorted(([, a], [, b]) => b.valueOf() - a.valueOf())
    .forEach(([conversation, updateTime]) => {
      const withUrl = { ...conversation, url: `/${conversation.id}` }

      if (updateTime >= startOfToday) {
        categorized.today.push(withUrl)
      } else if (updateTime >= startOfYesterday) {
        categorized.yesterday.push(withUrl)
      } else if (updateTime >= startOf30DaysAgo) {
        categorized.previous30days.push(withUrl)
      } else {
        categorized.older.push(withUrl)
      }
    })

  return categorized
}
