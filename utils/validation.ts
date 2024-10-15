export function isValidAttachment(file: File): boolean {
  return file.type.startsWith("image/") || file.type.startsWith("text/")
}
