import fs from "fs";
import path from "path";
import { createInitialState } from "../src/data/initialState";
import {
  DEATH_EXIT,
  EXITS_PER_ROOM,
  NUM_ROOMS,
  getExit,
  mapData,
  resolveMapToken,
} from "../src/data/map";
import { Direction, ExitSymbol } from "../src/types";

describe("map data", () => {
  it("has NUM_ROOMS rows and EXITS_PER_ROOM columns", () => {
    expect(mapData).toHaveLength(NUM_ROOMS);
    mapData.forEach((row) => expect(row).toHaveLength(EXITS_PER_ROOM));
  });

  it("resolves symbolic tokens against state", () => {
    const state = createInitialState();
    expect(resolveMapToken(ExitSymbol.H, state)).toBe(state.H);
    expect(resolveMapToken(ExitSymbol.D, state)).toBe(state.D);
  });

  it("looks up exits by room and direction", () => {
    const state = createInitialState();
    expect(getExit(state, 1, Direction.North)).toBe(2);
    expect(getExit(state, 10, Direction.South)).toBe(state.H);
  });

  it("matches the original BASIC DATA order", () => {
    const docPath = path.join(__dirname, "..", "docs", "caverns-1983.txt");
    const text = fs.readFileSync(docPath, "utf8");
    const lines = text
      .split(/\r?\n/)
      .filter((line) => /^17[4-9]|18[0-1]/.test(line.trim().split(" ")[0] ?? ""));
    const tokens: Array<number | string> = [];
    for (const line of lines) {
      const [, dataPart] = line.split(/DATA\s+/);
      if (!dataPart) continue;
      for (const raw of dataPart.split(",")) {
        const tok = raw.trim().split(/\s+/)[0];
        if (!tok) continue;
        if (/^\d+$/.test(tok)) {
          tokens.push(Number(tok));
        } else {
          tokens.push(tok);
        }
      }
    }

    const flattenedMap = mapData.flat().map((tok) => {
      if (typeof tok === "number") return tok;
      switch (tok) {
        case ExitSymbol.H:
          return "H";
        case ExitSymbol.T:
          return "T";
        case ExitSymbol.E:
          return "E";
        case ExitSymbol.W:
          return "W";
        case ExitSymbol.G:
          return "G";
        case ExitSymbol.D:
          return "D";
        default:
          return tok;
      }
    });

    expect(tokens).toHaveLength(NUM_ROOMS * EXITS_PER_ROOM);
    expect(flattenedMap).toEqual(tokens);
  });
});
