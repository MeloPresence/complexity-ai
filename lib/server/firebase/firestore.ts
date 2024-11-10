import {
  Conversation,
  type ConversationDataModel,
  type ConversationServiceInterface,
} from "@/lib/conversation"
import { MessageTreeNode } from "@/lib/message"
import { db } from "@/lib/server/firebase/app"
import {
  type CollectionReference,
  type DocumentReference,
  type DocumentSnapshot,
  type FirestoreDataConverter,
  type WriteResult,
} from "firebase-admin/firestore"

const CONVERSATIONS_TABLE_NAME = "conversations"

const conversationConverter: FirestoreDataConverter<
  Conversation,
  ConversationDataModel
> = {
  toFirestore: (conversation) => (conversation as Conversation).toModel(),
  fromFirestore: (snapshot) => {
    const data = snapshot.data() as ConversationDataModel
    return new Conversation(
      data.name,
      data.userId,
      data.isPublic,
      MessageTreeNode.fromModel(data.messageTree),
    )
  },
}

export class ConversationService implements ConversationServiceInterface {
  private readonly collectionRef: CollectionReference<
    Conversation,
    ConversationDataModel
  >

  public constructor() {
    // TODO: Undo this converter nonsense because it's redundant in the current client-server architecture
    this.collectionRef = db
      .collection(CONVERSATIONS_TABLE_NAME)
      .withConverter(conversationConverter)
  }

  public async createConversation(
    conversation: Conversation,
  ): Promise<DocumentReference<Conversation, ConversationDataModel>> {
    return this.collectionRef.add(conversation)
  }

  public async deleteConversation(
    conversationId: string,
  ): Promise<WriteResult> {
    const documentRef = this.collectionRef.doc(conversationId)
    return documentRef.delete()
  }

  public async updateConversation(
    conversationId: string,
    conversation: Conversation,
  ): Promise<WriteResult> {
    const documentRef = this.collectionRef.doc(conversationId)
    return documentRef.set(conversation) // .update() does not use the converter
  }

  public async getConversation(
    conversationId: string,
  ): Promise<DocumentSnapshot<Conversation, ConversationDataModel>> {
    const documentRef = this.collectionRef.doc(conversationId)
    return documentRef.get()
  }

  public async getConversationList(userId: string) {
    const result = await this.collectionRef
      .where("userId", "==", userId)
      .select("name", "isPublic")
      .get()
    console.log("getConversationList", result.docs)
    return result.docs
  }
}
