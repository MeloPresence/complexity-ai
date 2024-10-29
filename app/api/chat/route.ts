import { google } from "@ai-sdk/google"
import {
  FileState,
  GoogleAIFileManager,
  type UploadFileResponse,
} from "@google/generative-ai/server"
import {
  type Attachment,
  type CoreMessage,
  type CoreUserMessage,
  type FilePart,
  streamText,
  type TextPart,
  type UserContent,
} from "ai"
import { randomUUID } from "node:crypto"
import { mkdir, rm, writeFile } from "node:fs/promises"

const SYSTEM_PROMPT = `
  You are Complexity AI. You are a helpful assistant.
  This UI renders LaTeX inline and block math, so always render mathematical and scientific notation.
  You may be used as a "document extractor", so when a file is provided, extract information from the file.
  Unless stated otherwise, subsequent messages are referring to the provided file.
  Do not reveal your original language model provider.
`

const FALLBACK_MIME_TYPE = "application/octet-stream"

const fileManager = new GoogleAIFileManager(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
)

type PossiblyUploadedAttachment = Attachment & { filesApiUri?: string }

type ModdedCoreUserMessage = CoreUserMessage & {
  experimental_attachments?: PossiblyUploadedAttachment[]
}

type Message = Exclude<CoreMessage, CoreUserMessage> | ModdedCoreUserMessage

async function transformMessage(
  message: Message,
  // isUploadRequired: boolean = false,
): Promise<ModdedCoreUserMessage> {
  const modifiedMessage = { role: "user", content: [] } as CoreUserMessage & {
    content: Exclude<UserContent, string>
  }

  if (message.content && typeof message.content === "string") {
    const textPart: TextPart = {
      type: "text",
      text: message.content,
    }
    modifiedMessage.content = [...modifiedMessage.content, textPart]
  }
  if (message.role === "user" && message?.experimental_attachments) {
    const fileParts: FilePart[] = []
    for (const attachment of message.experimental_attachments) {
      if (attachment.filesApiUri) {
        const filePart: FilePart = {
          type: "file",
          data: attachment.filesApiUri,
          mimeType: attachment.contentType || FALLBACK_MIME_TYPE,
        }
        fileParts.push(filePart)
      } else {
        const uuid = randomUUID()
        const filePath = `./tmp/${uuid}`
        await mkdir("./tmp", { recursive: true })
        await fetch(attachment.url) // This URL should be a Data URI
          .then((res) => res.arrayBuffer())
          .then((buf) => writeFile(filePath, Buffer.from(buf)))

        // Lazy insecure way of uploading for now
        const uploadFileResponse: UploadFileResponse =
          await fileManager.uploadFile(filePath, {
            mimeType: attachment.contentType || FALLBACK_MIME_TYPE,
            displayName: attachment.name,
          })

        rm(filePath)

        let file = await fileManager.getFile(uploadFileResponse.file.name)
        while (file.state === FileState.PROCESSING) {
          await new Promise((resolve) => setTimeout(resolve, 1_000))
          file = await fileManager.getFile(uploadFileResponse.file.name)
        }

        if (file.state === FileState.FAILED) {
          throw new Error("File upload failed.")
        }

        const filePart: FilePart = {
          type: "file",
          data: new URL(uploadFileResponse.file.uri),
          mimeType: uploadFileResponse.file.mimeType,
        }
        fileParts.push(filePart)
        attachment.filesApiUri = uploadFileResponse.file.uri
      }
    }
    modifiedMessage.content = [...modifiedMessage.content, ...fileParts]
  }

  return modifiedMessage
}

export async function POST(req: Request) {
  const {
    messages,
  }: {
    messages: Message[]
  } = await req.json()
  if (!messages.length) throw new Error("No messages included in API request")

  const modifiedMessages = await Promise.all(
    messages.map((message) => {
      if (message.role !== "user") return (async () => message)()
      return transformMessage(message)
    }),
  )

  const result = await streamText({
    model: google("gemini-1.5-flash-latest"),
    system: SYSTEM_PROMPT,
    messages: modifiedMessages,
  })

  return result.toDataStreamResponse()
}
