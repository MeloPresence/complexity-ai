import {
  Conversation,
  type ConversationDataModel,
  type ConversationInfo,
  type ConversationServiceInterface,
} from "@/lib/conversation"
import { db } from "@/lib/server/firebase/app"
import { logger } from "@/lib/server/logger"
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
    return Conversation.fromModel(data)
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
    const log = logger.startTime()
    const result = await this.collectionRef.add(conversation)
    log.info({
      type: "cloud-firestore",
      action: "write",
      success: true,
      initiatorUserId: conversation.userId,
      endpoint: `@google-cloud/firestore/FirebaseFirestore.Firestore.collection(${CONVERSATIONS_TABLE_NAME}).add`,
    })
    return result
  }

  public async deleteConversation(
    conversationId: string,
  ): Promise<WriteResult> {
    const log = logger.startTime()
    const documentRef = this.collectionRef.doc(conversationId)
    const result = await documentRef.delete()
    log.info({
      type: "cloud-firestore",
      action: "write",
      success: true,
      initiatorUserId: null,
      endpoint: `@google-cloud/firestore/FirebaseFirestore.Firestore.collection(${CONVERSATIONS_TABLE_NAME}).doc.delete`,
    })
    return result
  }

  public async updateConversation(
    conversationId: string,
    conversation: Conversation,
  ): Promise<WriteResult> {
    const log = logger.startTime()
    const documentRef = this.collectionRef.doc(conversationId)
    const result = await documentRef.set(conversation) // .update() does not use the converter
    log.info({
      type: "cloud-firestore",
      action: "write",
      success: true,
      initiatorUserId: conversation.userId,
      endpoint: `@google-cloud/firestore/FirebaseFirestore.Firestore.collection(${CONVERSATIONS_TABLE_NAME}).doc.set`,
    })
    return result
  }

  public async getConversation(
    userId: string,
    conversationId: string,
  ): Promise<DocumentSnapshot<Conversation, ConversationDataModel>> {
    const log = logger.startTime({
      type: "cloud-firestore",
      action: "read",
      initiatorUserId: userId,
      endpoint: `@google-cloud/firestore/FirebaseFirestore.Firestore.collection(${CONVERSATIONS_TABLE_NAME}).doc.get`,
    })
    const documentRef = this.collectionRef.doc(conversationId)
    const data = await documentRef.get()
    if (!data.exists || data.get("userId") !== userId) {
      log.info({
        success: false,
        message: "NOT_FOUND",
      })
      throw new Error("Not found")
    }
    log.info({
      success: true,
    })
    return data
  }

  public async getConversationList(
    userId: string,
  ): Promise<ConversationInfo[]> {
    const log = logger.startTime()
    const result = await this.collectionRef
      .where("userId", "==", userId)
      .select("name", "isPublic")
      .get()
    log.info({
      type: "cloud-firestore",
      action: "read",
      success: true,
      initiatorUserId: userId,
      endpoint: `@google-cloud/firestore/FirebaseFirestore.Firestore.collection(${CONVERSATIONS_TABLE_NAME}).get`,
    })
    return result.docs.map((doc) => ({
      id: doc.id,
      createTime: doc.createTime.toDate().toJSON(),
      readTime: doc.readTime.toDate().toJSON(),
      updateTime: doc.updateTime.toDate().toJSON(),
      name: doc.get("name") || null,
    }))
  }
}
