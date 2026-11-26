#!/usr/bin/env node
/**
 * Generate personalized invitation URLs from a list of guest names.
 *
 *   node scripts/make-invite-links.mjs scripts/guest-names.example.txt
 *   node scripts/make-invite-links.mjs guests.txt
 *   cat guests.txt | node scripts/make-invite-links.mjs
 *
 * Each non-empty line is a name. Lines starting with # are ignored.
 * Names are trimmed, NFC-normalized, and capped at 20 characters.
 */
import { readFileSync } from 'node:fs';

const BASE = 'https://yurongwedding1220.github.io/yu-rong.love/invitation';
const MAX_GUEST_NAME_LENGTH = 20;

const parseGuestName = (raw) => {
  if (!raw) return null;
  let name = raw.normalize('NFC');
  name = name.replace(/[\u0000-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g, '');
  name = name.replace(/\s+/g, ' ').trim();
  if (!name) return null;
  name = Array.from(name).slice(0, MAX_GUEST_NAME_LENGTH).join('').trim();
  return name || null;
};

const inputPath = process.argv[2];
let text = '';

if (inputPath) {
  text = readFileSync(inputPath, 'utf8');
} else if (!process.stdin.isTTY) {
  text = readFileSync(0, 'utf8');
} else {
  console.error('Usage: node scripts/make-invite-links.mjs guests.txt');
  console.error('Each line is a guest name. Example: scripts/guest-names.example.txt');
  process.exit(1);
}

for (const line of text.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const name = parseGuestName(trimmed);
  if (!name) {
    console.error(`# skipped: ${trimmed}`);
    continue;
  }
  console.log(`${name}\t${BASE}?to=${encodeURIComponent(name)}`);
}
