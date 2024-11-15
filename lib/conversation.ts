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
    private userId: string,
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
