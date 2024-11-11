"use server"

import type { ModdedCoreMessage } from "@/lib/server/message"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"

const SYSTEM_PROMPT = `
  You are Complexity AI. You are a helpful document summarization specialist.
  You are given a conversation between you and a user.
  Generate a very short, identifiable title of up to 5 words for this conversation.
  The user can find this conversation again by seeing this title.
  
  If you only see one message and that message is from the user, that means another copy of you is still generating an answer.
  In this case, generate the title using the user's message and the type of response you expect to give.
  
  REMEMBER: Generate a very short, identifiable title of up to 5 words.
`

export async function generateTitle(
  messages: ModdedCoreMessage[],
): Promise<string> {
  const { text } = await generateText({
    model: google("gemini-1.5-flash-latest"),
    system: SYSTEM_PROMPT,
    messages,
  })
  console.log("generateTitle", { text })
  return text.trim()
}
