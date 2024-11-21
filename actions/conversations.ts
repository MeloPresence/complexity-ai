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
  const log = logger.startTime()
  const conversation = Conversation.fromModel(data)
  const result = await conversationService.createConversation(conversation)
  log.info({
    type: "backend",
    action: "write",
    success: true,
    initiatorUserId: data.userId,
    endpoint: "@/actions/conversations/createConversation",
  })
  return result.id
}

export async function updateConversation(
  id: string,
  data: ConversationDataModel,
): Promise<void> {
  const log = logger.startTime()
  const conversation = Conversation.fromModel(data)
  await conversationService.updateConversation(id, conversation)
  log.info({
    type: "backend",
    action: "write",
    success: true,
    initiatorUserId: data.userId,
    endpoint: "@/actions/conversations/updateConversation",
  })
}

export async function getConversation(
  userId: string,
  conversationId: string,
): Promise<ConversationDataModel> {
  const log = logger.startTime({
    type: "backend",
    action: "read",
    initiatorUserId: userId,
    endpoint: "@/actions/conversations/getConversation",
  })
  const result = await conversationService.getConversation(
    userId,
    conversationId,
  )
  const conversation = result.data()
  if (!conversation) {
    log.info({
      success: false,
      message: "NOT_FOUND",
    })
    throw new Error("Conversation not found")
  }
  log.info({
    success: true,
  })
  return conversation.toModel()
}

export async function getConversationList(
  userId: string,
): Promise<ConversationInfo[]> {
  const log = logger.startTime()
  const result = await conversationService.getConversationList(userId)
  log.info({
    type: "backend",
    action: "read",
    success: true,
    initiatorUserId: userId,
    endpoint: "@/actions/conversations/getConversationList",
  })
  return result
}
