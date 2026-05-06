import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const MUSIC_PROMPT =
  'Solo piano, slow, ambient. Five minutes, loopable. Room tone of a 1957 academic lecture hall in summer — windows open onto a quad, occasional distant footsteps, no audible voices. The piano plays sparse intervals — open fifths, suspended chords — never resolving fully. Tempo around 50 BPM. No melody to remember. Tape hiss audible at low level.';

interface MiniMaxResponse {
  data?: {
    audio?: string;
    audio_url?: string;
    status?: number;
  };
  base_resp?: {
    status_code?: number;
    status_msg?: string;
  };
}

async function downloadAudio(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`MiniMax audio download failed: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function generateMusic() {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error(
      'MINIMAX_API_KEY is not set. Set it in the environment before generating music.',
    );
  }

  const response = await fetch('https://api.minimax.io/v1/music_generation', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'music-2.6',
      prompt: MUSIC_PROMPT,
      is_instrumental: true,
      output_format: 'hex',
      audio_setting: {
        sample_rate: 44100,
        bitrate: 256000,
        format: 'mp3',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`MiniMax music generation failed: HTTP ${response.status}`);
  }

  const payload = (await response.json()) as MiniMaxResponse;
  if (payload.base_resp?.status_code && payload.base_resp.status_code !== 0) {
    throw new Error(
      `MiniMax music generation failed: ${payload.base_resp.status_msg ?? payload.base_resp.status_code}`,
    );
  }

  const audio = payload.data?.audio
    ? Buffer.from(payload.data.audio, 'hex')
    : payload.data?.audio_url
      ? await downloadAudio(payload.data.audio_url)
      : null;

  if (!audio?.length) {
    throw new Error('MiniMax music generation returned no audio data.');
  }

  const outputPath = join(process.cwd(), 'public', 'audio', 'era-1956.mp3');
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, audio);
  console.log(`Wrote ${outputPath}`);
}

generateMusic().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
