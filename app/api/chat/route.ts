import { streamText, convertToCoreMessages } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: google("gemini-1.5-flash-latest"),
    system: "You are a helpful assistant.",
    messages: convertToCoreMessages(messages),
  })

  return result.toDataStreamResponse()
}
