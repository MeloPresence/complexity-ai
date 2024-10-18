export function isValidAttachment(file: File): boolean {
  return ["image/", "text/", "application/pdf"].some((mimeType) =>
    file.type.startsWith(mimeType),
  )
}
