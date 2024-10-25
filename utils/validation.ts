export function isValidAttachment(file: File): boolean {
  return ["image/", "text/", "application/pdf", "audio/mp3"].some((mimeType) =>
    file.type.startsWith(mimeType),
  )
}
