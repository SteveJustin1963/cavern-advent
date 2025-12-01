export enum Direction {
  North = 0,
  South = 1,
  West = 2,
  East = 3,
}

export enum ExitSymbol {
  BridgeRope = "BRIDGE_ROPE", // H in BASIC
  BombDoor = "BOMB_DOOR", // T in BASIC
  CryptWall = "CRYPT_WALL", // E in BASIC
  WaterfallLedge = "WATERFALL_LEDGE", // W in BASIC
  Grate = "GRATE", // G in BASIC
  Drawbridge = "DRAWBRIDGE", // D in BASIC
}

export type ExitToken = number | ExitSymbol;

export interface GameState {
  room: number; // A in BASIC
  bridgeRopeExit: number; // H in BASIC
  drawbridgeExit: number; // D in BASIC
  waterfallLedgeExit: number; // W in BASIC
  grateExit: number; // G in BASIC
  bombDoorExit: number; // T in BASIC
  cryptWallExit: number; // E in BASIC
  moves: number; // U in BASIC
  alive: boolean;
  candleLit: boolean; // C0 in BASIC, true when light is available
  carried: number[]; // indices of P array carried (-1 in BASIC)
  positions: number[]; // 1-based P array, index 0 unused
}

export interface GameResponse {
  output: string[];
  state: GameState;
}

export interface EntityDescription {
  prefix: string;
  suffix: string;
}
