import {
  Conversation,
  type ConversationDataModel,
  type ConversationServiceInterface,
} from "@/lib/conversation"
import { db } from "@/lib/server/firebase/app"
import {
  addDoc,
  deleteDoc,
  doc,
  type DocumentReference,
  type DocumentSnapshot,
  type FirestoreDataConverter,
  getDoc,
  updateDoc,
} from "@firebase/firestore"

const CONVERSATIONS_TABLE_NAME = "conversations"

const conversationConverter: FirestoreDataConverter<
  Conversation,
  ConversationDataModel
> = {
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    return new Conversation(data.name, data.userId, data.isPublic)
  },
  toFirestore: (conversation) => conversation.toJson(),
}

export class ConversationService implements ConversationServiceInterface {
  private collectionRef: CollectionRef<Conversation, ConversationDataModel>

  public constructor() {
    this.collectionRef = db
      .collection(CONVERSATIONS_TABLE_NAME)
      .withConverter(conversationConverter)
  }

  public async createConversation(
    conversation: Conversation,
  ): Promise<DocumentReference<Conversation, ConversationDataModel>> {
    return addDoc(collectionRef, conversation)
  }

  public async deleteConversation(conversationId: string): Promise<void> {
    const documentRef = doc(collectionRef, conversationId)
    return deleteDoc(documentRef)
  }

  public async updateConversation(
    conversationId: string,
    conversation: Conversation,
  ): Promise<void> {
    const documentRef = doc(collectionRef, conversationId)
    return updateDoc(documentRef, conversation)
  }

  public async getConversation(
    conversationId: string,
  ): Promise<DocumentSnapshot<Conversation, ConversationDataModel>> {
    const documentRef = doc(collectionRef, conversationId)
    return getDoc(documentRef)
  }
}
