"use server"

import type { ModdedCoreMessage } from "@/lib/server/message"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { logger } from "@/lib/server/logger"

const SYSTEM_PROMPT = `
  Generate a very short, identifiable title of UP TO 5 WORDS for this conversation.
  The user can find this conversation again by seeing this title.
  
  REMEMBER: Generate a very short, identifiable title of UP TO 5 WORDS.
`

export async function generateTitle(
  messages: ModdedCoreMessage[],
): Promise<string> {
  logger.info({
    action: "generateTitle",
  })
  const { text } = await generateText({
    model: google("gemini-1.5-flash-latest"),
    system: SYSTEM_PROMPT,
    messages,
  })
  return text.trim()
}
