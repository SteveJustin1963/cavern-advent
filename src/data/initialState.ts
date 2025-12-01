import {
  GRILL_START_ROOM,
  START_ROOM,
  DEST_BRIDGE_SAFE,
  DEATH_EXIT,
} from "../constants";
import { GameState } from "../types";

// P is 1-based and holds monster/object positions.
const initialPositions: number[] = [
  0, // padding for 1-based indexing
  36,
  19,
  10,
  14,
  17,
  47,
  8,
  1,
  51,
  45,
  22,
  46,
  54,
  19,
  19,
  19,
  19,
  0,
  34,
  7,
  18,
  15,
  24,
  GRILL_START_ROOM,
];

export function createInitialState(): GameState {
  return {
    room: START_ROOM,
    bridgeRopeExit: DEST_BRIDGE_SAFE,
    drawbridgeExit: DEATH_EXIT,
    waterfallLedgeExit: 0,
    grateExit: 0,
    bombDoorExit: 0,
    cryptWallExit: 0,
    moves: 0,
    alive: true,
    candleLit: true,
    carried: [],
    positions: [...initialPositions],
  };
}
