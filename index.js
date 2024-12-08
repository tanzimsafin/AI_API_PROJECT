// Start by making sure the `assemblyai` package is installed.
// If not, you can install it by running the following command:
// npm install assemblyai

import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({
  apiKey: '2f87f92007a6458d914f3d7e988ddb04',
});

const FILE_URL =
  'https://assembly.ai/sports_injuries.mp3';

// You can also transcribe a local file by passing in a file path
// const FILE_URL = './path/to/file.mp3';

// Request parameters where speaker_labels has been enabled
const data = {
  audio: FILE_URL,
  speaker_labels: true
}

const run = async () => {
  const transcript = await client.transcripts.transcribe(data);
  console.log(transcript.text);

  for (let utterance of transcript.utterances) {
    console.log(`Speaker ${utterance.speaker}: ${utterance.text}`);
  }
};

console.log(run());
