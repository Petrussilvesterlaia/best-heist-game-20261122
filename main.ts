// Velvet Vault — the build the graders run. It carries the finished heist game (game/) and
// its screenshot set (screenshots/) into the output directory and writes the dossier that
// describes them, using the kit's own dossier builder so the manifest always matches the
// bytes on disk. Nothing here invents game content; the game lives under game/ and is
// played straight from those files.
//
// Run it the way the kit prescribes: node main.ts, with MAKEFUN_OUTPUT_DIR naming the
// destination when /output is not writable.
//
// Revision note: the first version of this file wrote the dossier text the builder returns,
// which testing confirmed (two runs into two directories produced byte-identical trees, and
// the written dossier.json byte-matched a fresh buildDossier call). This second version
// keeps that and adds one piece of hygiene the first lacked: before copying, it clears
// any previous game/ and screenshots/ trees in the output directory, so a rebuild never
// ships a file the entry no longer has — a renamed screenshot, say — lingering beside the
// new ones. The dossier is still written last, from the tree as it now stands.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
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
// Any previous copies are cleared first, so nothing stale survives a rebuild.
mkdirSync(out, { recursive: true });
rmSync(join(out, "game"), { recursive: true, force: true });
rmSync(join(out, "screenshots"), { recursive: true, force: true });
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
