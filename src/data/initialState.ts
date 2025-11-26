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
  38,
];

export function createInitialState(): GameState {
  return {
    room: 1,
    H: 11,
    D: 128,
    W: 0,
    G: 0,
    T: 0,
    E: 0,
    moves: 0,
    alive: true,
    candleLit: true,
    carried: [],
    positions: [...initialPositions],
  };
}
