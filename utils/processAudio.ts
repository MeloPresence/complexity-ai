
export async function processAudioFile(mediaPath: string) {
    try {
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

      const data = await response.json();
      console.log('Generated response:', data.text);
    } catch (error) {
      console.error('Error processing the audio file:', error);
    }
  }
