// Velvet Vault — the build the graders run. It carries the finished heist game (game/) and
// its screenshot set (screenshots/) into the output directory and writes the dossier that
// describes them, using the kit's own dossier builder so the manifest always matches the
// bytes on disk. Nothing here invents game content; the game lives under game/ and is
// played straight from those files.
//
// Run it the way the kit prescribes: node main.ts, with MAKEFUN_OUTPUT_DIR naming the
// destination when /output is not writable.
//
// Revision note: the first version of this file called buildDossier as if it wrote
// dossier.json itself. It does not — it returns the dossier text, and the caller writes
// it. Testing the first version against the kit's builder caught that; this version
// writes the file, and the verification in BUILD-REPORT.md re-checks the written bytes
// against a fresh buildDossier call.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

// This file's own folder, resolved the way the kit's starter resolves it.
const here = fileURLToPath(new URL(".", import.meta.url));

// Where the entry lands: the grader's /output when it is offered, else the folder the
// MAKEFUN_OUTPUT_DIR override names.
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The game itself, copied as-is: index.html plus every script it loads under src/.
// The screenshots travel beside it, named as shots.json describes them; the folder is
// created even before its pictures arrive so the copy below has somewhere to land.
mkdirSync(out, { recursive: true });
cpSync(join(here, "game"), join(out, "game"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The dossier: the kit builder walks the copied tree, measures every file against the
// entry limits, and returns the dossier text; writing it here is this program's job.
// The caps are the scorer's own — an entry the scorer would refuse is refused here
// first, while it can still be fixed.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
