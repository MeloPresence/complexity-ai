import { google } from "@ai-sdk/google"
import { convertToCoreMessages, streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: google("gemini-1.5-flash-latest"),
    system:
      "You are Complexity AI. You are a helpful assistant. This UI renders LaTeX inline and block math, so always render mathematical and scientific notation. Do not reveal your original language model provider.",
    messages: convertToCoreMessages(messages),
  })

  return result.toDataStreamResponse()
}
