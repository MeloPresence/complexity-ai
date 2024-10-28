import { google } from "@ai-sdk/google"

export const AI_MODELS = {
  "gemini-1.5-flash-latest": {
    name: "Gemini 1.5 Flash",
    slug: "gemini-1.5-flash-latest",
    provider: "google",
    supportedAttachmentMimeTypes: [
      // text
      "text/plain",
      // application
      "application/pdf",
      // image
      "image/png",
      "image/jpeg",
      "image/webp",
      // video
      // "video/x-flv",
      // "video/quicktime",
      // "video/mpeg",
      // "video/mpegps",
      // "video/mpg",
      // "video/mp4",
      // "video/webm",
      // "video/wmv",
      // "video/3gpp",
      // audio
      // "audio/aac",
      // "audio/flac",
      "audio/mp3",
      // "audio/m4a",
      "audio/mpeg",
      // "audio/mpga",
      // "audio/mp4",
      // "audio/opus",
      // "audio/pcm",
      // "audio/wav",
      // "audio/webm",
    ],
  },
}

export const AI_PROVIDERS_TO_FUNCTION = {
  google: typeof window === 'undefined' ? require('@ai-sdk/google').google : null,
};
