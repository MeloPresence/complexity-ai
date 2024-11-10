"use server"

import { Conversation, type ConversationDataModel } from "@/lib/conversation"
import { ConversationService } from "@/lib/server/firebase/firestore"

const conversationService = new ConversationService()

// TODO: VERIFY FIREBASE TOKEN

export async function createConversation(
  data: ConversationDataModel,
): Promise<string> {
  const conversation = Conversation.fromModel(data)
  const result = await conversationService.createConversation(conversation)
  return result.id
}

export async function updateConversation(
  id: string,
  data: ConversationDataModel,
): Promise<void> {
  const conversation = Conversation.fromModel(data)
  await conversationService.updateConversation(id, conversation)
}

export async function getConversation(
  id: string,
): Promise<ConversationDataModel> {
  const result = await conversationService.getConversation(id)
  const conversation = result.data()
  if (!conversation) throw new Error("Conversation not found")
  return conversation.toModel()
}

export async function getConversationList(userId: string): Promise<any[]> {
  return conversationService.getConversationList(userId)
}
