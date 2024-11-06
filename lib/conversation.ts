import { MessageTreeNode, type MessageTreeNodeDataModel } from "@/lib/message"
import type { DocumentReference, DocumentSnapshot } from "@firebase/firestore"

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

  public toJson(): ConversationDataModel {
    const { name, userId, isPublic, messageTree: messageTreeInstance } = this
    const messageTree = messageTreeInstance.toJson()
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
  ): Promise<DocumentReference<Conversation, ConversationDataModel>> // TODO: Return type should be generalized, not Firestore

  deleteConversation(conversationId: string): Promise<void>

  updateConversation(
    conversationId: string,
    conversation: Conversation,
  ): Promise<void>

  getConversation(
    conversationId: string,
  ): Promise<DocumentSnapshot<Conversation, ConversationDataModel>> // TODO: Return type should be generalized, not Firestore
}
