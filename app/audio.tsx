// Make sure to include these imports:
import { GoogleAIFileManager, FileState, UploadFileResponse } from "@google/generative-ai/server";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Initialize GoogleAIFileManager with API key from environment variables
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string);

export async function processAudioFile(mediaPath: string) {
  try {
    // Send the file path to the server-side API for processing
    const response = await fetch('/api/audio/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mediaPath }), // Send the media path to the server
    });

    if (!response.ok) {
      throw new Error('Failed to process audio');
    }

    // Get the response from the server-side API route
    const data = await response.json();
    console.log('Generated response:', data.text);
  } catch (error) {
    console.error('Error processing the audio file:', error);
  }
}
