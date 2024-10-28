import { NextResponse } from 'next/server';
import { GoogleAIFileManager, FileState, UploadFileResponse } from '@google/generative-ai/server';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Initialize GoogleAIFileManager and GoogleGenerativeAI once with the API key
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string);

export async function POST(request: Request) {
  try {
    const { mediaPath } = await request.json();

    // Upload the audio file using GoogleAIFileManager
    const uploadResult: UploadFileResponse = await fileManager.uploadFile(mediaPath, {
      mimeType: 'audio/mpeg',
      displayName: 'Audio sample',
    });

    // Check the file state until it's processed
    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === FileState.PROCESSING) {
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error('Audio processing failed.');
    }

    // Retrieve the generative model
    const model: GenerativeModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate content based on the uploaded audio file
    const result = await model.generateContent([
      'Tell me about this audio clip.',
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    return NextResponse.json({ text: result.response.text });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json({ error: 'Error processing audio file' }, { status: 500 });
  }
}
