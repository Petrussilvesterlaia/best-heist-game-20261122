// Velvet Vault — tuning: one place for every number the heist runs on. Room size, movement
// speeds, how far a Warden or a camera can see, how fast the alarm climbs when Wren is caught
// in the light, what a thrown coin costs, and what a clean room is worth. Nothing else in
// src/ hard-codes a number that lives here.

/** A floor tile is this many pixels on a side; each room is COLS tiles wide, ROWS tall. */
export const TILE = 40;
export const COLS = 25;
export const ROWS = 16;

/** The room in pixels, the HUD strip above it, and the canvas that holds both. */
export const WORLD_W = COLS * TILE;
export const WORLD_H = ROWS * TILE;
export const HUD_H = 72;
export const CANVAS_W = WORLD_W;
export const CANVAS_H = WORLD_H + HUD_H;

/** The world advances in fixed slices of this many seconds; slow frames run several. */
export const STEP = 1 / 60;

/** Wren: her walking pace, her slower sneak (the alarm climbs half as fast while she sneaks). */
export const THIEF_SPEED = 158;
export const THIEF_SNEAK_SPEED = 88;
export const THIEF_RADIUS = 13;

/** A Warden: patrol pace, and the pause at each end of his beat while he looks around. */
export const GUARD_SPEED = 74;
export const GUARD_PAUSE = 0.8;
export const GUARD_RADIUS = 14;

/** Sight: half-angle and reach of a Warden's eyes and of a sweeping camera's lens. */
export const GUARD_CONE_HALF = 0.62; // about 35 degrees to each side
export const GUARD_CONE_RANGE = 178;
export const CAMERA_CONE_HALF = 0.46; // about 26 degrees to each side
export const CAMERA_CONE_RANGE = 168;

/**
 * The alarm meter runs from 0 to ALARM_MAX. While Wren is seen it rises at a rate between
 * the far and near values — closer to the watcher is worse — halved while she sneaks. Once
 * unseen for longer than ALARM_GRACE it cools at ALARM_DECAY per second.
 */
export const ALARM_MAX = 100;
export const ALARM_GRACE = 0.6;
export const ALARM_DECAY = 17;
export const GUARD_SPOT_NEAR = 95;
export const GUARD_SPOT_FAR = 34;
export const CAMERA_SPOT_NEAR = 62;
export const CAMERA_SPOT_FAR = 26;

/** A thrown coin costs this much score and draws Wardens within COIN_HEAR pixels to look. */
export const COIN_COST = 25;
export const COIN_HEAR = 165;
export const COIN_DISTRACT = 2.6;

/** Scoring: time bonus per second under par, the Ghost bonus, the fine for being caught. */
export const TIME_BONUS_PER_SECOND = 10;
export const GHOST_BONUS = 500;
export const CAUGHT_PENALTY = 150;
export const MAX_STRIKES = 3;

/** The screens main.js steps between; render.js paints an overlay for each of these. */
export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_CAUGHT = 'caught';
export const SCREEN_CLEAR = 'clear';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

/** localStorage key for the best night's score. */
export const BEST_KEY = 'velvet-vault-best';
