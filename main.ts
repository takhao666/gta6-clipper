// Entry program for gta6-clipper-01 (Node 22, standard library only).
// It copies VIDEO.json from the repository root to /output/VIDEO.json, where
// the gate reads the YouTube video's address. That is all the program has
// to do: the entry is the video itself. The house reads the video's views
// from YouTube, and places go by views, the most first.
//
// Before copying, it checks VIDEO.json really names a YouTube Short, so a
// placeholder link can never be submitted by accident.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A real YouTube Short: www.youtube.com/shorts/<id>, youtube.com/shorts/<id>,
// or youtu.be/<id>, where <id> is the 11-character video id.
const SHORT_RE = /^https:\/\/(?:www\.youtube\.com\/shorts\/|youtube\.com\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]{11})$/;

const videoPath = join(BOT_DIR, 'VIDEO.json');
let url: string;
try {
  url = (JSON.parse(readFileSync(videoPath, 'utf8')) as { url: unknown }).url as string;
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

const match = typeof url === 'string' ? SHORT_RE.exec(url) : null;
if (!match || match[1] === '00000000000') {
  console.error(`Invalid YouTube Short link in VIDEO.json: ${JSON.stringify(url)} (expected https://www.youtube.com/shorts/<11-character id>)`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(videoPath, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
console.log(`Publishing YouTube Short: ${url}`);
