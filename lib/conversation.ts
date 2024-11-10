import { MessageTreeNode, type MessageTreeNodeDataModel } from "@/lib/message"
import {
  type DocumentReference,
  type DocumentSnapshot,
  type WriteResult,
} from "firebase-admin/firestore"

export interface ConversationDataModel {
  name: string
  userId: string
  isPublic: boolean
  messageTree: MessageTreeNodeDataModel
}

export class Conversation {
  public constructor(
    private name: string,
    private userId: string,
    private isPublic: boolean,
    private messageTree: MessageTreeNode,
  ) {}

  public static fromModel(data: ConversationDataModel): Conversation {
    return new Conversation(
      data.name,
      data.userId,
      data.isPublic,
      MessageTreeNode.fromModel(data.messageTree),
    )
  }

  public toModel(): ConversationDataModel {
    const { name, userId, isPublic, messageTree: messageTreeInstance } = this
    const messageTree = messageTreeInstance.toModel()
    return {
      name,
      userId,
      isPublic,
      messageTree,
    }
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
    conversationId: string,
  ): Promise<DocumentSnapshot<Conversation, ConversationDataModel>> // TODO: Generalize Firestore return type
}
