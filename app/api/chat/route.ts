import { google } from "@ai-sdk/google"
import { convertToCoreMessages, streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: google("gemini-1.5-flash-latest"),
    system:
      "You are a helpful assistant. The UI used to communicate with you renders LaTeX inline and block math.",
    messages: convertToCoreMessages(messages),
  })

  return result.toDataStreamResponse()
}
