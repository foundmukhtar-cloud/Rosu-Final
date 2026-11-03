#!/usr/bin/env node
/**
 * Prepares scroll frame sequences for the ROSU site.
 *
 * For each sequence it:
 *  1. extracts the untouched source ZIP into public/assets/rosu/<id>/frames/
 *  2. writes an optimised web frame set into public/assets/rosu/<id>/web/
 *  3. writes public/assets/rosu/<id>/manifest.json
 *  4. regenerates src/lib/sequences.ts with every sequence
 *
 * The ZIPs in Assets/ are never modified. Re-running is idempotent.
 */
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUT_ROOT = join(ROOT, 'public', 'assets', 'rosu');

const SEQUENCES = [
  {
    id: 'hero-uad',
    title: 'Skyline to UAD 3.6',
    description:
      'A continuous camera move from the Lower Manhattan skyline at morning light, across the limestone architectural model, through the opening and into the penthouse appraisal scene.',
    chapters: ['New York skyline', 'UAD 3.6'],
    source: 'Assets/ezgif-828b6d0c1a7083cc-png-split.zip',
  },
  {
    id: 'penthouse-lounge',
    title: 'Penthouse to lounge',
    description:
      'The camera withdraws from the appraisal booklet and the building model, across the penthouse floor, and comes to rest in a navy lounge overlooking the city.',
    chapters: ['Penthouse'],
    source: 'Assets/ezgif-86cc61827b114774-png-split.zip',
  },
  {
    id: 'gallery',
    title: 'Lounge to gallery',
    description:
      'From the lounge the camera crosses a marble table holding a glazed architectural model, then moves into a gallery corridor where a consultant works at a desk.',
    chapters: ['Gallery'],
    source: 'Assets/ezgif-8db394740eeaf22e-png-split.zip',
  },
  {
    id: 'regional-expertise',
    title: 'Regional expertise',
    description:
      'The camera moves through New York itself — from Central New York homes to the city’s high-rise core — following the architectural line that links the markets ROSU serves.',
    chapters: ['New York'],
    source: 'Assets/ezgif-8d72ca0e6e756d03-png-split.zip',
  },
  {
    id: 'new-york-continuation',
    title: 'New York continuation',
    description:
      'A direct continuation of the New York regional camera move, carrying the scene forward without a cut.',
    chapters: ['New York'],
    source: 'Assets/ezgif-863039b5cd089970-png-split.zip',
  },
  {
    id: 'new-york-continuation-2',
    title: 'New York continuation II',
    description:
      'A second direct continuation of the New York regional camera move, carrying the scene forward without a cut.',
    chapters: ['New York'],
    source: 'Assets/ezgif-8abff9f8296eb104-png-split.zip',
  },
  {
    id: 'new-york-continuation-3',
    title: 'New York continuation III',
    description:
      'A third direct continuation of the New York regional camera move, carrying the scene forward without a cut.',
    chapters: ['New York'],
    source: 'Assets/ezgif-4c55a15441f66be1-png-split.zip',
  },
  {
    id: 'new-york-continuation-4',
    title: 'New York continuation IV',
    description:
      'A fourth direct continuation of the New York regional camera move, carrying the scene forward without a cut.',
    chapters: ['New York'],
    source: 'Assets/ezgif-85a76d311d4f3965-png-split.zip',
  },
];

const collected = [];

function pngSize(file) {
  const buffer = readFileSync(file);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function frameNumber(name) {
  const match = name.match(/(\d+)\.png$/i);
  return match ? Number(match[1]) : NaN;
}

function run(command, args) {
  execFileSync(command, args, { stdio: 'inherit' });
}

for (const sequence of SEQUENCES) {
  const sourceZip = join(ROOT, sequence.source);
  if (!existsSync(sourceZip)) {
    throw new Error(`Missing source ZIP for ${sequence.id}: ${sequence.source}`);
  }

  const dir = join(OUT_ROOT, sequence.id);
  const framesDir = join(dir, 'frames');
  const webDir = join(dir, 'web');
  mkdirSync(framesDir, { recursive: true });
  mkdirSync(webDir, { recursive: true });

  if (readdirSync(framesDir).filter((f) => f.toLowerCase().endsWith('.png')).length === 0) {
    console.log(`[${sequence.id}] extracting ${sequence.source}`);
    run('unzip', ['-o', '-j', sourceZip, '-d', framesDir]);
  }

  // Numeric order, never alphabetical order.
  const pngs = readdirSync(framesDir)
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .sort((a, b) => frameNumber(a) - frameNumber(b));

  if (pngs.length === 0) throw new Error(`No frames extracted for ${sequence.id}`);

  const numbers = pngs.map(frameNumber);
  for (let i = 0; i < numbers.length; i += 1) {
    if (numbers[i] !== i + 1) {
      throw new Error(
        `Frame numbering in ${sequence.id} is not contiguous at ${pngs[i]} (expected ${i + 1})`,
      );
    }
  }

  const first = pngs[0];
  const prefix = first.replace(/0*1\.png$/i, '');
  const digits = String(numbers[numbers.length - 1]).length;
  const { width, height } = pngSize(join(framesDir, first));

  console.log(`[${sequence.id}] ${pngs.length} frames, ${width}x${height}`);

  const webCount = readdirSync(webDir).filter((f) => f.endsWith('.webp')).length;
  if (webCount !== pngs.length) {
    console.log(`[${sequence.id}] encoding web frames`);
    run('ffmpeg', [
      '-y',
      '-loglevel',
      'error',
      '-start_number',
      '1',
      '-i',
      join(framesDir, `${prefix}%0${digits}d.png`),
      '-c:v',
      'libwebp',
      '-quality',
      '82',
      '-compression_level',
      '5',
      '-preset',
      'picture',
      join(webDir, `${prefix}%0${digits}d.webp`),
    ]);
  }

  const manifest = {
    id: sequence.id,
    title: sequence.title,
    description: sequence.description,
    chapters: sequence.chapters,
    source: sequence.source,
    frameCount: pngs.length,
    width,
    height,
    startNumber: 1,
    digits,
    pattern: `${prefix}{index}.webp`,
    sourcePattern: `${prefix}{index}.png`,
    directory: `assets/rosu/${sequence.id}`,
    poster: `${prefix}${String(1).padStart(digits, '0')}.webp`,
    lastFrame: `${prefix}${String(pngs.length).padStart(digits, '0')}.webp`,
  };

  writeFileSync(join(dir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  collected.push({
    exportName: sequence.id.replace(/-(\w)/g, (_, c) => c.toUpperCase()),
    data: {
      id: manifest.id,
      title: manifest.title,
      description: manifest.description,
      chapters: manifest.chapters,
      source: manifest.source,
      frameCount: manifest.frameCount,
      width: manifest.width,
      height: manifest.height,
      startNumber: manifest.startNumber,
      digits: manifest.digits,
      pattern: `${manifest.directory}/web/${manifest.pattern}`,
      poster: `${manifest.directory}/web/${manifest.poster}`,
      lastFrame: `${manifest.directory}/web/${manifest.lastFrame}`,
      manifestPath: `${manifest.directory}/manifest.json`,
    },
  });

  console.log(`[${sequence.id}] manifest written`);
}

const header = `// Generated by scripts/prepare-frames.mjs — do not edit by hand.
import type { Sequence } from './frames';

`;
const declarations = collected
  .map(
    ({ exportName, data }) =>
      `export const ${exportName}: Sequence = ${JSON.stringify(data, null, 2)};`,
  )
  .join('\n\n');
const names = collected.map(({ exportName }) => exportName).join(', ');

writeFileSync(
  join(ROOT, 'src', 'lib', 'sequences.ts'),
  `${header}${declarations}\n\nexport const sequences: Sequence[] = [${names}];\n`,
);
console.log(`wrote src/lib/sequences.ts with ${collected.length} sequence(s)`);
