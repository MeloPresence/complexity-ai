import {
  FileState,
  GoogleAIFileManager,
  UploadFileResponse,
} from "@google/generative-ai/server"
import type {
  Attachment,
  CoreMessage,
  CoreUserMessage,
  FilePart,
  TextPart,
  UserContent,
} from "ai"
import { randomUUID } from "node:crypto"
import { mkdir, rm, writeFile } from "node:fs/promises"

const FALLBACK_MIME_TYPE = "application/octet-stream"
const fileManager = new GoogleAIFileManager(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
)
export type PossiblyUploadedAttachment = Attachment & {
  filesApiUri?: string // Gemini File APIs
}
export type ModdedCoreUserMessage = CoreUserMessage & {
  experimental_attachments?: PossiblyUploadedAttachment[]
}
export type Message =
  | Exclude<CoreMessage, CoreUserMessage>
  | ModdedCoreUserMessage

/**
 * Uploads documents to Gemini Files API, and mutates any `CoreUserMessage` in place to store the URI.
 * `ModdedCoreUserMessage` with a URI in its attachments means that the file is already uploaded, and will not be re-uploaded.
 * @param message
 * @returns {Promise<ModdedCoreUserMessage>} Promise that resolves to a `ModdedCoreUserMessage`
 */
export async function transformMessage(message: ModdedCoreUserMessage): Promise<
  ModdedCoreUserMessage & {
    content: Exclude<UserContent, string>
  }
> {
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
  if (message?.experimental_attachments) {
    const fileParts: FilePart[] = []
    for (const attachment of message.experimental_attachments) {
      if (attachment.filesApiUri) {
        const { url, ...rest } = attachment
        console.log("Reusing uploaded file", { file: rest })
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

        let fileMetadataResponse = await fileManager.getFile(
          uploadFileResponse.file.name,
        )
        while (fileMetadataResponse.state === FileState.PROCESSING) {
          await new Promise((resolve) => setTimeout(resolve, 1_000))
          fileMetadataResponse = await fileManager.getFile(
            uploadFileResponse.file.name,
          )
        }

        rm(filePath)

        if (fileMetadataResponse.state === FileState.FAILED) {
          throw new Error("File upload failed.")
        }

        console.log("Uploaded file", { file: fileMetadataResponse })
        const filePart: FilePart = {
          type: "file",
          data: new URL(fileMetadataResponse.uri),
          mimeType: fileMetadataResponse.mimeType,
        }
        fileParts.push(filePart)
        attachment.filesApiUri = uploadFileResponse.file.uri
      }
    }
    modifiedMessage.content = [...modifiedMessage.content, ...fileParts]
  }

  return modifiedMessage
}

export async function storeMessages(
  messages: Message[],
  conversationId?: string,
) {
  // How to store attachments?
  // 1. Immediately upload to Gemini Files API so that the response can be done ASAP
  // 2. Also upload to my own Firebase Bucket
  // 3. Store Gemini Files API URL, the GFA upload time and Firebase Bucket URL
  // 4. When processing a messages, if the GFA time > 24 hours, reupload using Firebase Bucket URL
  console.log(JSON.stringify(messages, null, 2))

  if (!conversationId) {
    // create new document
  } else {
    // update previous document
  }
}
