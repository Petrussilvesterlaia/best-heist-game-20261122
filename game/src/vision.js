// Velvet Vault — eyes: who can see Wren, and the shape of what they can see. A watcher (a
// Warden, or a camera) sees her when she is inside his cone's reach and angle and no wall or
// display case stands between them. The renderer asks the same questions to draw the cones,
// so what a cone shows is exactly what it catches: the game is fair because the picture is
// the rule.

import { isSolid } from './levels.js';

/** The smallest signed difference between two angles, in (-PI, PI]. */
export function angleDifference(a, b) {
  let d = (a - b) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/** Distance between two points. */
export function distance(x0, y0, x1, y1) {
  return Math.hypot(x1 - x0, y1 - y0);
}

/**
 * True when nothing solid blocks the straight walk from (x0, y0) to (x1, y1). The walk is
 * sampled every few pixels; the first and last few pixels are skipped, so a watcher standing
 * in a doorway or mounted on a wall face is not blinded by his own tile.
 */
export function lineOfSight(level, x0, y0, x1, y1) {
  const d = distance(x0, y0, x1, y1);
  if (d < 1) return true;
  const steps = Math.max(1, Math.floor(d / 6));
  for (let i = 1; i < steps; i += 1) {
    const t = i / steps;
    if (t < 0.08 || t > 0.94) continue;
    if (isSolid(level, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t)) return false;
  }
  return true;
}

/**
 * How well a watcher at (x, y) facing `facing` sees the point (px, py): 0 when he cannot see
 * it at all, otherwise a number in (0, 1] that grows as the point gets closer — the world
 * turns it into how fast the alarm climbs. `half` is the cone's half-angle, `range` its reach.
 */
export function seenAmount(level, x, y, facing, half, range, px, py) {
  const d = distance(x, y, px, py);
  if (d > range) return 0;
  const bearing = Math.atan2(py - y, px - x);
  if (Math.abs(angleDifference(bearing, facing)) > half) return 0;
  if (!lineOfSight(level, x, y, px, py)) return 0;
  return 1 - d / range;
}

/**
 * The polygon of a cone as it is actually drawn and as it actually catches: rays fanned
 * across the arc, each marched out until it hits something solid or runs out of reach.
 * Returns the points after the watcher's own position, in order.
 */
export function conePolygon(level, x, y, facing, half, range, rays = 26) {
  const points = [];
  for (let i = 0; i <= rays; i += 1) {
    const angle = facing - half + (2 * half * i) / rays;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    let reach = range;
    for (let d = 8; d < range; d += 8) {
      if (isSolid(level, x + dx * d, y + dy * d)) {
        reach = d;
        break;
      }
    }
    points.push({ x: x + dx * reach, y: y + dy * reach });
  }
  return points;
}
