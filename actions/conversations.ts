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
  const before = Date.now()
  const conversation = Conversation.fromModel(data)
  const result = await conversationService.createConversation(conversation)
  logger.info({
    type: "backend",
    action: "write",
    success: true,
    responseTime: Date.now() - before,
    initiatorUserId: data.userId,
    endpoint: "actions/conversations/createConversation",
  })
  return result.id
}

export async function updateConversation(
  id: string,
  data: ConversationDataModel,
): Promise<void> {
  const before = Date.now()
  const conversation = Conversation.fromModel(data)
  await conversationService.updateConversation(id, conversation)
  logger.info({
    type: "backend",
    action: "write",
    success: true,
    responseTime: Date.now() - before,
    initiatorUserId: data.userId,
    endpoint: "actions/conversations/updateConversation",
  })
}

export async function getConversation(
  userId: string,
  conversationId: string,
): Promise<ConversationDataModel> {
  const before = Date.now()
  const result = await conversationService.getConversation(
    userId,
    conversationId,
  )
  const conversation = result.data()
  if (!conversation) {
    logger.info({
      type: "backend",
      action: "read",
      success: false,
      responseTime: Date.now() - before,
      initiatorUserId: userId,
      endpoint: "actions/conversations/getConversation",
      message: "NOT_FOUND",
    })
    throw new Error("Conversation not found")
  }
  logger.info({
    type: "backend",
    action: "read",
    success: true,
    responseTime: Date.now() - before,
    initiatorUserId: userId,
    endpoint: "actions/conversations/getConversation",
  })
  return conversation.toModel()
}

export async function getConversationList(
  userId: string,
): Promise<ConversationInfo[]> {
  const before = Date.now()
  const result = await conversationService.getConversationList(userId)
  logger.info({
    type: "backend",
    action: "read",
    success: true,
    responseTime: Date.now() - before,
    initiatorUserId: userId,
    endpoint: "actions/conversations/getConversationList",
  })
  return result
}
