import { Direction, ExitSymbol, ExitToken, GameState } from "../types";

export const NUM_ROOMS = 54;
export const EXITS_PER_ROOM = 4;
export const DEATH_EXIT = 128;

// 2D map data: [roomIndex][direction] => ExitToken
// Each inner array corresponds to a room (1-based conceptually).
export const mapData: ExitToken[][] = [
  // Rooms 1–4
  [2, 0, 0, 0],
  [0, 0, 3, 4],
  [2, 5, 5, 0],
  [2, 5, 0, 9],
  // Rooms 5–8
  [0, 6, 3, 4],
  [5, 0, 7, 8],
  [0, 0, DEATH_EXIT, 6],
  [0, 0, 6, 0],
  // Rooms 9–12
  [0, 10, 4, 0],
  [9, ExitSymbol.H, 4, 0],
  [10, 12, DEATH_EXIT, DEATH_EXIT],
  [ExitSymbol.H, 13, 13, 0],
  // Rooms 13–16
  [12, 12, 14, 12],
  [15, 16, 0, 13],
  [0, 14, 0, 0],
  [14, 18, 0, 17],
  // Rooms 17–20
  [0, 0, 16, 0],
  [16, 0, 23, 0],
  [0, 0, 20, 0],
  [21, 23, 0, ExitSymbol.T],
  // Rooms 21–24
  [0, 24, 0, 20],
  [0, 23, 21, 16],
  [22, 0, 18, 18],
  [21, 26, 0, 18],
  // Rooms 25–28
  [0, 27, 24, 0],
  [24, 27, 29, 25],
  [18, 0, 0, 28],
  [0, 0, 27, 0],
  // Rooms 29–32
  [0, 33, 0, 26],
  [29, 31, 0, 0],
  [32, 0, 0, 0],
  [33, 30, 0, 0],
  // Rooms 33–36
  [0, 31, 34, 0],
  [0, 0, 0, 33],
  [0, 0, 0, 0],
  [39, 0, 35, 40],
  // Rooms 37–40
  [0, 35, 0, ExitSymbol.E],
  [ExitSymbol.W, 0, 0, ExitSymbol.G],
  [0, 36, 38, 0],
  [45, 48, 36, DEATH_EXIT],
  // Rooms 41–44
  [46, 43, 54, 42],
  [46, 43, 41, 43],
  [46, 38, 42, 44],
  [47, 47, 0, 47],
  // Rooms 45–48
  [0, 40, 0, DEATH_EXIT],
  [47, 0, 47, 47],
  [0, 45, 46, 0],
  [40, DEATH_EXIT, 0, ExitSymbol.D],
  // Rooms 49–52
  [0, 0, 48, 50],
  [0, 52, 49, 51],
  [0, 0, 50, 0],
  [50, 0, 53, 50],
  // Rooms 53–54
  [54, 0, 0, 52],
  [0, 53, 41, 0],
];

export function resolveMapToken(token: ExitToken, state: GameState): number {
  switch (token) {
    case ExitSymbol.H:
      return state.H;
    case ExitSymbol.T:
      return state.T;
    case ExitSymbol.E:
      return state.E;
    case ExitSymbol.W:
      return state.W;
    case ExitSymbol.G:
      return state.G;
    case ExitSymbol.D:
      return state.D;
    default:
      return token;
  }
}

export function getExit(state: GameState, room: number, dir: Direction): number {
  if (room < 1 || room > NUM_ROOMS) {
    throw new Error(`Room ${room} is outside valid map bounds`);
  }
  const exits = mapData[room - 1];
  const raw = exits[dir];
  return resolveMapToken(raw, state);
}
