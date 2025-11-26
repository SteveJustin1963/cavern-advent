export enum Direction {
  North = 0,
  South = 1,
  West = 2,
  East = 3,
}

export enum ExitSymbol {
  H = "H",
  T = "T",
  E = "E",
  W = "W",
  G = "G",
  D = "D",
}

export type ExitToken = number | ExitSymbol;

export interface GameState {
  room: number; // A in BASIC
  H: number;
  D: number;
  W: number;
  G: number;
  T: number;
  E: number;
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
