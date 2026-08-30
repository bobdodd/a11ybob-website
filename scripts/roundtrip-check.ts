/* Proof that the content-file format is LOSSLESS: parsing a file and
 * re-rendering it must reproduce the bytes exactly. Run after any change to
 * content-file.ts — a format that does not round-trip silently rewrites Bob's
 * prose the first time anything re-exports it. */
import { readFileSync, readdirSync, existsSync } from "fs";
import path from "path";
import { parse, render } from "./content-file.js";
let ok = 0, bad = 0;
for (const kind of ["experience", "article"]) {
  const dir = path.join("content", kind);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).sort().filter((x) => x.endsWith(".md"))) {
    const file = path.join(dir, f);
    const cf = parse(file);
    if (render(cf.front, cf.body) === readFileSync(file, "utf8")) ok++;
    else { bad++; console.log(`  MISMATCH ${file}`); }
  }
}
console.log(`  round-tripped identically: ${ok}   mismatched: ${bad}`);
process.exit(bad ? 1 : 0);
