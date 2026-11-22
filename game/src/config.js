// Velvet Vault — shared constants: the size of the world, how fast everyone moves, how quickly
// the alarm climbs when Wren is seen, and the names of the screens the game moves between.
// Everything else in src/ reads these from here so the game's tuning lives in one place.

/** One floor tile is a square this many pixels across; every level is COLS by ROWS tiles. */
export const TILE = 40;
export const COLS = 25;
export const ROWS = 16;

/** The room itself, in pixels, and the height of the HUD strip painted above it. */
export const WORLD_W = COLS * TILE;
export const WORLD_H = ROWS * TILE;
export const HUD_H = 72;
export const CANVAS_W = WORLD_W;
export const CANVAS_H = WORLD_H + HUD_H;

/** The fixed step the world advances in, seconds: the loop runs several in a slow frame. */
export const STEP = 1 / 60;

/** Wren's speeds, pixels a second: a normal walk, and the slower sneak (harder to spot). */
export const THIEF_SPEED = 158;
export const THIEF_SNEAK_SPEED = 88;
export const THIEF_RADIUS = 13;

/** A Warden's patrol speed, pixels a second, and how long he pauses at each end of his beat. */
export const GUARD_SPEED = 74;
export const GUARD_PAUSE = 0.8;
export const GUARD_RADIUS = 14;

/** Vision cones: half-angle and reach for a Warden's eyes and for a sweeping camera. */
export const GUARD_CONE_HALF = 0.62; // radians, about 35 degrees each side
export const GUARD_CONE_RANGE = 178;
export const CAMERA_CONE_HALF = 0.46; // about 26 degrees each side
export const CAMERA_CONE_RANGE = 168;

/**
 * The alarm meter runs 0 to ALARM_MAX. While Wren is seen it climbs at a rate between the far
 * and near values (closer is worse), halved while she sneaks; unseen, it cools after a grace.
 */
export const ALARM_MAX = 100;
export const ALARM_GRACE = 0.6;
export const ALARM_DECAY = 17;
export const GUARD_SPOT_NEAR = 95;
export const GUARD_SPOT_FAR = 34;
export const CAMERA_SPOT_NEAR = 62;
export const CAMERA_SPOT_FAR = 26;

/** Throwing a coin costs score and pulls Wardens within COIN_HEAR pixels to look at it. */
export const COIN_COST = 25;
export const COIN_HEAR = 165;
export const COIN_DISTRACT = 2.6;

/** Scoring: a level's time bonus per second left of par, and the ghost bonus for never being seen. */
export const TIME_BONUS_PER_SECOND = 10;
export const GHOST_BONUS = 500;
export const CAUGHT_PENALTY = 150;
export const MAX_STRIKES = 3;

/** The screens main.js moves between; render.js paints one of these over the world. */
export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_CAUGHT = 'caught';
export const SCREEN_CLEAR = 'clear';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

/** Where the best score is kept between visits. */
export const BEST_KEY = 'velvet-vault-best';
