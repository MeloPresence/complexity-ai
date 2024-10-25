import { NextResponse } from 'next/server';
import { GoogleAIFileManager, FileState, UploadFileResponse } from '@google/generative-ai/server';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { mediaPath } = await request.json(); // Get the mediaPath from the client

    // Initialize GoogleAIFileManager with your API key
    const fileManager = new GoogleAIFileManager(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string);

    // Upload the audio file
    const uploadResult: UploadFileResponse = await fileManager.uploadFile(`${mediaPath}`, {
      mimeType: 'audio/mp3',
      displayName: 'Audio sample',
    });

    // Check file state until processing is done
    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === FileState.PROCESSING) {
      await new Promise((resolve) => setTimeout(resolve, 10_000)); // Wait for 10 seconds
      file = await fileManager.getFile(uploadResult.file.name); // Re-check file state
    }

    if (file.state === FileState.FAILED) {
      throw new Error('Audio processing failed.');
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string);
    const model: GenerativeModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate content from the audio file
    const result = await model.generateContent([
      'Tell me about this audio clip.',
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    // Send the result back to the client
    return NextResponse.json({ text: result.response.text });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json({ error: 'Error processing audio file' }, { status: 500 });
  }
}
