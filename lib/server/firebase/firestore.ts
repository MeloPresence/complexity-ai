import { db } from "@/lib/server/firebase/app"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  type DocumentReference,
  type DocumentSnapshot,
  type FirestoreDataConverter,
  getDoc,
  type PartialWithFieldValue,
  updateDoc,
} from "@firebase/firestore"

export const CONVERSATIONS_TABLE_NAME = "conversations"

export interface ConversationDataModel {
  name: string
  userId: string
  isPublic: boolean
}

export class Conversation implements ConversationDataModel {
  constructor(
    public name: string,
    public userId: string,
    public isPublic: boolean,
  ) {}
}

export const conversationConverter: FirestoreDataConverter<
  Conversation,
  ConversationDataModel
> = {
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    return new Conversation(data.name, data.userId, data.isPublic)
  },
  toFirestore: (conversation) =>
    (["name", "userId", "isPublic"] as const).reduce((accumulator, current) => {
      accumulator[current] = conversation[current]
      return accumulator
    }, {} as PartialWithFieldValue<ConversationDataModel>),
}

const collectionRef = collection(db, CONVERSATIONS_TABLE_NAME).withConverter(
  conversationConverter,
)

export async function createConversation(
  conversation: Conversation,
): Promise<DocumentReference<Conversation, ConversationDataModel>> {
  return addDoc(collectionRef, conversation)
}

export async function deleteConversation(
  conversationId: string,
): Promise<void> {
  const documentRef = doc(collectionRef, conversationId)
  return deleteDoc(documentRef)
}
export async function updateConversation(
  conversationId: string,
  conversation: Conversation,
) {
  const documentRef = doc(collectionRef, conversationId)
  return updateDoc(documentRef, conversation)
}
export async function getConversation(
  conversationId: string,
): Promise<DocumentSnapshot<Conversation, ConversationDataModel>> {
  const documentRef = doc(collectionRef, conversationId)
  return getDoc(documentRef)
}
