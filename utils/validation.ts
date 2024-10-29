export function isValidAttachment(file: File): boolean {
  return ["image/", "text/", "application/pdf", "audio/", "video/"].some(
    (mimeType) => file.type.startsWith(mimeType),
  )
}
