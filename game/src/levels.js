// Velvet Vault — the three rooms of the Aurum Trust as tile maps, and the parser that turns
// a map into a playable level. Legend: '#' wall, '=' display case or desk (solid, blocks
// sight as well as feet), '.' open floor, 'P' where Wren slips in, 'E' the exit door,
// 'c' cash stack, 'g' gold bar, 'j' jewel, 'S' the Meridian Star. Warden beats and camera
// mounts sit beside each map, in tile coordinates for the beats and pixels for the cameras.

import { TILE } from './config.js';

/** What each loot letter is worth and what the HUD and clear screen call it. */
export const LOOT_KINDS = {
  c: { value: 100, name: 'cash stack' },
  g: { value: 250, name: 'gold bar' },
  j: { value: 400, name: 'jewel' },
  S: { value: 1000, name: 'the Meridian Star' },
};

const LOBBY = {
  name: 'The Lobby',
  par: 75,
  coins: 2,
  map: [
    '#########################',
    '#P......c...............#',
    '#.....#####....#........#',
    '#.....#####....#....g...#',
    '#..=..#####....#........#',
    '#..=..#####.............#',
    '#.....#####......#..S...#',
    '#................#......#',
    '#....c....==.....#......#',
    '#.......................#',
    '#..#####....==....c.....#',
    '#..#...#................#',
    '#..#........#####.......#',
    '#..#...#....#...#...j...#',
    '#E......g...#...#.......#',
    '#########################',
  ],
  guards: [
    { path: [[2, 8], [9, 8]] },
    { path: [[21, 9], [21, 13]] },
  ],
  cameras: [
    { x: 500, y: 40, base: Math.PI / 2, sweep: 0.85, speed: 0.5, phase: 0 },
  ],
};

const GALLERY = {
  name: 'Gallery of Glass',
  par: 95,
  coins: 3,
  map: [
    '#########################',
    '#P....#....c......#.....#',
    '#.....#....==.....#.....#',
    '#..=..#....==.....#.....#',
    '#..=..#....g......#.....#',
    '#.......................#',
    '#....#####....#####.....#',
    '#....#####....#####..c..#',
    '#....#####....#####.....#',
    '#....#####....#####.....#',
    '#.................#.....#',
    '#..j..........c...#..S..#',
    '#.................#.....#',
    '#...==.....==......#....#',
    '#E......g...............#',
    '#########################',
  ],
  guards: [
    { path: [[8, 1], [16, 1]] },
    { path: [[3, 10], [16, 10]] },
    { path: [[22, 10], [22, 13]] },
  ],
  cameras: [
    { x: 500, y: 40, base: Math.PI / 2, sweep: 0.9, speed: 0.5, phase: 1.7 },
    { x: 40, y: 420, base: 0, sweep: 0.65, speed: 0.65, phase: 0.4 },
  ],
};

const VAULT = {
  name: 'The Vault',
  par: 115,
  coins: 3,
  map: [
    '#########################',
    '#P....#....c....#.......#',
    '#.....#.........#...=...#',
    '#..#..#....==...#.......#',
    '#..#..#.........#...=...#',
    '#..#......g.............#',
    '#..#####....#####...#...#',
    '#..#####....#####...#..j#',
    '#..#####....#####.......#',
    '#..#####....#####.......#',
    '#...................#...#',
    '#..c....==.........#.S..#',
    '#...................#...#',
    '#....==.....==..........#',
    '#E.....g......j.........#',
    '#########################',
  ],
  guards: [
    { path: [[5, 5], [18, 5]] },
    { path: [[1, 7], [1, 13]] },
    { path: [[18, 7], [18, 13]] },
    { path: [[10, 14], [22, 14]] },
  ],
  cameras: [
    { x: 500, y: 40, base: Math.PI / 2, sweep: 0.8, speed: 0.55, phase: 0 },
    { x: 960, y: 300, base: Math.PI, sweep: 0.7, speed: 0.7, phase: 2.1 },
    { x: 820, y: 440, base: Math.PI / 2, sweep: 0.6, speed: 0.8, phase: 4.0 },
  ],
};

/** The night's three rooms, in the order Wren works through them. */
export const LEVELS = [LOBBY, GALLERY, VAULT];

/** The pixel centre of the tile at (tx, ty). */
export function tileCentre(tx, ty) {
  return { x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2 };
}

/**
 * Turn one raw level into play data: the tile grid (spawn, exit and loot letters become
 * floor), Wren's start, the exit tile, the loot pieces, and the Wardens and cameras with
 * their beats and sweeps already in pixels. A malformed map throws, so a bad level fails
 * loudly in a test instead of quietly at the table.
 */
export function parseLevel(raw, index) {
  const grid = [];
  let start = null;
  let exit = null;
  const loot = [];
  for (let ty = 0; ty < raw.map.length; ty += 1) {
    const row = raw.map[ty];
    let line = '';
    for (let tx = 0; tx < row.length; tx += 1) {
      const ch = row[tx];
      if (ch === 'P') {
        start = tileCentre(tx, ty);
        line += '.';
      } else if (ch === 'E') {
        exit = { tx, ty, ...tileCentre(tx, ty) };
        line += '.';
      } else if (LOOT_KINDS[ch]) {
        const at = tileCentre(tx, ty);
        loot.push({ x: at.x, y: at.y, kind: ch, value: LOOT_KINDS[ch].value, name: LOOT_KINDS[ch].name, taken: false });
        line += '.';
      } else {
        line += ch;
      }
    }
    grid.push(line);
  }
  if (!start || !exit) throw new Error(`level ${index}: map needs a P and an E`);
  if (!loot.some((piece) => piece.kind === 'S')) throw new Error(`level ${index}: map needs the Meridian Star (S)`);
  return {
    index,
    name: raw.name,
    par: raw.par,
    coins: raw.coins,
    grid,
    start,
    exit,
    loot,
    guards: raw.guards.map((guard) => ({
      waypoints: guard.path.map(([tx, ty]) => tileCentre(tx, ty)),
    })),
    cameras: raw.cameras.map((camera) => ({ ...camera })),
  };
}

/** True when the tile holding pixel (x, y) stops a body or a look: wall or display case. */
export function isSolid(level, x, y) {
  const tx = Math.floor(x / TILE);
  const ty = Math.floor(y / TILE);
  if (tx < 0 || ty < 0 || ty >= level.grid.length || tx >= level.grid[ty].length) return true;
  const ch = level.grid[ty][tx];
  return ch === '#' || ch === '=';
}
