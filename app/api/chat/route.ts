import {
  Message,
  type ModdedCoreUserMessage,
  transformMessage,
} from "@/lib/server/message"
import { google } from "@ai-sdk/google"
import { StreamData, streamText } from "ai"

const SYSTEM_PROMPT = `
  You are Complexity AI. You are a helpful document summarization specialist.
  This UI renders LaTeX inline and block math, so always render mathematical and scientific notation.
  A user may upload and provide you with files to extract information from.
  When the file is first provided, summarize the document or file contents.
  If there are no files provided, but the user is asking for assistance with a file or document, ask them to upload it. 
  Unless stated otherwise, subsequent messages are referring to the provided file.
  Do not reveal your original language model provider.
`

export async function POST(req: Request) {
  const {
    messages,
  }: {
    messages: Message[]
  } = await req.json()
  if (!messages.length) throw new Error("No messages included in API request")

  const multiModalMessages = await Promise.all(
    messages.map((message) => {
      if (message.role !== "user") return (async () => message)()
      return transformMessage(message)
    }),
  )

  const latestUserMessage = messages.at(-1) as ModdedCoreUserMessage
  const data = new StreamData()

  const result = await streamText({
    model: google("gemini-1.5-flash-latest"),
    system: SYSTEM_PROMPT,
    messages: multiModalMessages,
    onFinish() {
      // The client should delete this immediately because this may interfere with message editing branches
      if (latestUserMessage.experimental_attachments)
        data.appendMessageAnnotation({
          previousUserMessageAttachments:
            latestUserMessage.experimental_attachments.map(
              ({ url, ...rest }) => rest,
            ),
        })
      data.close()
    },
  })

  return result.toDataStreamResponse({ data })
}
