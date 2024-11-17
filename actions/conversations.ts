"use server"

import {
  Conversation,
  type ConversationDataModel,
  type ConversationInfo,
} from "@/lib/conversation"
import { ConversationService } from "@/lib/server/firebase/firestore"
import { logger } from "@/lib/server/logger"

const conversationService = new ConversationService()

// TODO: VERIFY FIREBASE TOKEN

export async function createConversation(
  data: ConversationDataModel,
): Promise<string> {
  logger.info({
    action: "createConversation",
    user_id: data.userId,
  })
  const conversation = Conversation.fromModel(data)
  const result = await conversationService.createConversation(conversation)
  return result.id
}

export async function updateConversation(
  id: string,
  data: ConversationDataModel,
): Promise<void> {
  logger.info({
    action: "updateConversation",
    user_id: data.userId,
    conversation_id: id,
  })
  const conversation = Conversation.fromModel(data)
  await conversationService.updateConversation(id, conversation)
}

export async function getConversation(
  userId: string,
  conversationId: string,
): Promise<ConversationDataModel> {
  logger.info({
    action: "getConversation",
    user_id: userId,
    conversation_id: conversationId,
  })
  const result = await conversationService.getConversation(
    userId,
    conversationId,
  )
  const conversation = result.data()
  if (!conversation) {
    logger.error({
      action: "getConversation",
      user_id: userId,
      conversation_id: conversationId,
      error: "NOT_FOUND",
    })
    throw new Error("Conversation not found")
  }
  return conversation.toModel()
}

export async function getConversationList(
  userId: string,
): Promise<ConversationInfo[]> {
  logger.info({
    action: "getConversationList",
    user_id: userId,
  })
  return await conversationService.getConversationList(userId)
}
