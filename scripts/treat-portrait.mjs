// Usage:
// node scripts/treat-portrait.mjs --input scripts/raw-portraits/mccarthy.png --output public/portraits/mccarthy.png --era 1956
// Input: PNG/JPEG, square or near-square.
// Output: 512x512 PNG with 1956 duotone, halftone, and archival border.
// Phase 4b runs this for the full portrait set.

import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import sharp from 'sharp';

const size = 512;
const palette = {
  ink: [0x1c, 0x16, 0x11],
  paper: [0xf1, 0xeb, 0xd9],
  sepia: '#8a6a3b'
};

function readArgs(argv) {
  const args = new Map();

  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || !value) throw new Error(`Invalid argument near "${key ?? ''}".`);
    args.set(key.slice(2), value);
  }

  return args;
}

function requiredArg(args, key) {
  const value = args.get(key);
  if (!value) throw new Error(`Missing required --${key} argument.`);
  return value;
}

function duotonePixels(grayscale) {
  const output = Buffer.alloc(size * size * 4);

  for (let index = 0; index < grayscale.length; index += 1) {
    const mix = grayscale[index] / 255;
    const out = index * 4;

    output[out] = Math.round(palette.ink[0] + (palette.paper[0] - palette.ink[0]) * mix);
    output[out + 1] = Math.round(palette.ink[1] + (palette.paper[1] - palette.ink[1]) * mix);
    output[out + 2] = Math.round(palette.ink[2] + (palette.paper[2] - palette.ink[2]) * mix);
    output[out + 3] = 255;
  }

  return output;
}

function borderSvg() {
  return Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="${size - 1}" height="${size - 1}" fill="none" stroke="${palette.sepia}" stroke-width="1"/></svg>`
  );
}

async function treatPortrait({ input, output }) {
  const grayscale = await sharp(input)
    .resize(size, size, { fit: 'cover', position: 'center' })
    .grayscale()
    .raw()
    .toBuffer();

  const halftone = fileURLToPath(new URL('./assets/halftone-512.png', import.meta.url));
  await mkdir(dirname(output), { recursive: true });

  await sharp(duotonePixels(grayscale), {
    raw: {
      width: size,
      height: size,
      channels: 4
    }
  })
    .composite([
      { input: halftone, blend: 'multiply' },
      { input: borderSvg(), blend: 'over' }
    ])
    .png()
    .toFile(output);
}

async function main() {
  const args = readArgs(process.argv.slice(2));
  const era = requiredArg(args, 'era');
  if (era !== '1956') throw new Error(`Unsupported era "${era}". Only --era 1956 is available.`);

  await treatPortrait({
    input: requiredArg(args, 'input'),
    output: requiredArg(args, 'output')
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
