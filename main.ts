// The One-Liner Groan-Off — make.fun bounty
// u-alfasurya91-the-one-liner-groan-off-5a1febd5
//
// Writes one original dad joke, a single line of at most 140 characters,
// to /output/entry.txt and prints the same line to stdout.
// Deterministic: no network, no randomness, no clock, no input files.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry. A dad changes the Wi-Fi password so the kids have to
// concede the point every time they want to get online — the setup
// is the password, the punchline is the admission.
const ENTRY =
  "I changed the Wi-Fi password to 'DadIsAlwaysRight' — now the kids have to admit I'm right just to get online.";

// The sealed gate scores /output/entry.txt: UTF-8 text, 1 to 140
// characters, not only whitespace. Check the same rules here so a
// bad entry fails loudly instead of reaching the judge as a zero.
const length = [...ENTRY].length;
if (length < 1 || length > 140) {
  throw new Error(`entry is ${length} characters; the limit is 1 to 140`);
}
if (ENTRY.trim() === "") {
  throw new Error("entry must not be only whitespace");
}
// One line means one line: no line breaks, and no stray leading or
// trailing spaces that would pad the count or split the joke.
if (/[\n\r]/.test(ENTRY)) {
  throw new Error("entry must be a single line with no line breaks");
}
if (ENTRY !== ENTRY.trim()) {
  throw new Error("entry must not start or end with whitespace");
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });

const target = join(outputDir, "entry.txt");
writeFileSync(target, ENTRY, "utf8");

// Read it back: what the judge sees must be byte-for-byte the line
// above, with no trailing newline or encoding surprise smuggled in.
const written = readFileSync(target, "utf8");
if (written !== ENTRY) {
  throw new Error("entry.txt does not match the entry exactly");
}

console.log(ENTRY);
console.error(`wrote ${length} characters to ${target}`);
