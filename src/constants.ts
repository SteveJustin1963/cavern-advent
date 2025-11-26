// Game-wide constants and identifiers derived from the BASIC source

// Rooms
export const START_ROOM = 1;
export const ROOM_BRIDGE_HALF = 11; // triggers bridge collapse (H -> DEATH)
export const ROOM_WATERFALL = 45; // opens W to ROOM_STEPS
export const ROOM_LOKI_STATUE = 35; // closes W
export const ROOM_DRAWBRIDGE = 49; // sets D to ROOM_DRAWBRIDGE

// Destinations used by dynamic exits
export const DEST_BRIDGE_SAFE = ROOM_BRIDGE_HALF; // initial value of H
export const DEST_STEPS = 43; // W opens to here
export const DEST_GRATE_OPEN = 39; // G becomes this once grill is gone
export const DEATH_EXIT = 128;

// P array index ranges
export const MONSTER_START = 1;
export const MONSTER_END = 6;
export const ITEM_START = 7;
export const ITEM_END = 24;

// Object indices (P array)
export const OBJ_GRILL = 24; // ventilation grill
export const OBJ_CANDLE = 21;
export const OBJ_SWORD = 20;

// P(24) initial room
export const GRILL_START_ROOM = 38;
