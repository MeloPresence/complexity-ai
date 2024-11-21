"use server"

import { logger } from "@/lib/server/logger"
import type { ModdedCoreMessage } from "@/lib/server/message"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"

const SYSTEM_PROMPT = `
  Generate a very short, identifiable title of UP TO 5 WORDS for this conversation.
  The user can find this conversation again by seeing this title.
  
  REMEMBER: Generate a very short, identifiable title of UP TO 5 WORDS.
`

export async function generateTitle(
  messages: ModdedCoreMessage[],
): Promise<string> {
  const backendLog = logger.startTime()
  const geminiAiLog = logger.startTime()
  const { text } = await generateText({
    model: google("gemini-1.5-flash-latest"),
    system: SYSTEM_PROMPT,
    messages,
  })
  geminiAiLog.info({
    type: "gemini-ai",
    action: "read",
    success: true,
    initiatorUserId: null,
    endpoint: "ai/generateText",
  })
  backendLog.info({
    type: "backend",
    action: "read",
    success: true,
    initiatorUserId: null,
    endpoint: "@/actions/title/generateTitle",
  })
  return text.trim()
}
