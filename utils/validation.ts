export function isValidAttachment(file: File): boolean {
  return ["image/", "text/", "application/pdf", "audio/mp3", "audio/mpeg"].some((mimeType) =>
    file.type.startsWith(mimeType),
  )
}
