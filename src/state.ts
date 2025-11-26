import { createInitialState } from "./data/initialState";
import { directionWords } from "./data/vocab";
import { DEATH_EXIT, getExit } from "./data/map";
import { search } from "./helpers/search";
import { normalizeInput } from "./helpers/text";
import {
  canSee,
  describeVisibleEntities,
  getLocationText,
} from "./logic/descriptions";
import { describeEntity } from "./data/entities";
import { Direction, GameResponse, GameState } from "./types";

export function createEngine(state: GameState = createInitialState()): GameState {
  return state;
}

export function look(state: GameState): string[] {
  const lines = getLocationText(state);
  if (canSee(state)) {
    lines.push(...describeVisibleEntities(state));
  }
  return lines;
}

export function move(state: GameState, dir: Direction): string[] {
  const dest = getExit(state, state.room, dir);
  if (dest === 0) {
    return ["You can't go that way."];
  }
  if (dest === DEATH_EXIT) {
    state.alive = false;
    return [
      "You stumble and fall into the chasm and smash yourself to a pulp on the rocks below.",
    ];
  }
  state.room = dest;
  applyDynamicFlags(state);
  return look(state);
}

export function listInventory(state: GameState): string[] {
  const carried: string[] = [];
  for (let i = 7; i <= 24; i += 1) {
    if (state.positions[i] === -1) {
      carried.push(describeEntity(i));
    }
  }
  if (!carried.length) {
    return ["You are carrying nothing."];
  }
  return ["You are carrying:", ...carried];
}

export function handleInput(state: GameState, raw: string): GameResponse {
  const normalized = normalizeInput(raw);
  state.moves += 1;
  applyDynamicFlags(state);

  const output: string[] = [];

  if (search(normalized, " quit ") > 0) {
    state.alive = false;
    output.push("Thanks for playing. (Quit command issued)");
    return { output, state };
  }

  if (search(normalized, " look ") > 0) {
    output.push(...look(state));
    return { output, state };
  }

  for (let dir = 0; dir < directionWords.length; dir += 1) {
    if (search(normalized, directionWords[dir]) > 0) {
      output.push(...move(state, dir as Direction));
      return { output, state };
    }
  }

  if (search(normalized, " list ") > 0) {
    output.push(...listInventory(state));
    return { output, state };
  }

  output.push(
    "Command parsing is not yet fully implemented. Try 'look' or a direction (north, south, east, west)."
  );
  return { output, state };
}

function applyDynamicFlags(state: GameState): void {
  if (state.room === 11) {
    state.H = 128;
  }
  if (state.room === 45) {
    state.W = 43;
  }
  if (state.room === 35) {
    state.W = 0;
  }
  if (state.positions[24] !== 38) {
    state.G = 39;
  }
  if (state.room === 49) {
    state.D = 49;
  }
}

export function getState(state: GameState): GameState {
  return state;
}
