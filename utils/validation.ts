export function isValidAttachment(file: File): boolean {
  console.debug("Validating", { file })
  return [
    "image/",
    "text/",
    "audio/",
    "video/",
    "application/pdf",
    // "application/json", // Needs processing!
    "application/xml", // Browser uses text/xml instead
  ].some((mimeType) => file.type.startsWith(mimeType))
}
