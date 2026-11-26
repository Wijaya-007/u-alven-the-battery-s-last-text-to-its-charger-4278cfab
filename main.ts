// The Battery's Last Text to Its Charger — one line, at most 200 characters.
// The battery texts like a clingy ex: it waited all day, it is at 1%, and it
// wants the charger to know the cable and the wall heard it tried.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LINE =
  "Hey. It's me. 1%. I've been holding on since 7am just to say goodbye, and you spent the whole day in the other room. Tell the cable I waited. Tell the wall I tried.";

// Gate: a single line of plain text, 1-200 Unicode code points.
const codePoints = [...LINE].length;
if (codePoints < 1 || codePoints > 200) {
  throw new Error(`line is ${codePoints} code points, must be 1-200`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}
if (LINE !== LINE.trim() || LINE.includes("  ")) {
  throw new Error("line must not have leading/trailing whitespace or double spaces");
}
if (!/charger|cable/i.test(LINE)) {
  throw new Error("line must mention the charger or the cable");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ||
  join(dirname(fileURLToPath(import.meta.url)), "output");
const outPath = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, LINE + "\n", "utf8");

// Verify the written bytes round-trip exactly.
const back = readFileSync(outPath, "utf8");
if (back !== LINE + "\n") {
  throw new Error("written entry does not match the line");
}
console.log(`wrote ${outPath} (${codePoints} chars)`);
console.log(LINE);
