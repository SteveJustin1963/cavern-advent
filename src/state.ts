import { createInitialState } from "./data/initialState";
import { directionWords } from "./data/vocab";
import { getExit } from "./data/map";
import { search } from "./helpers/search";
import { normalizeInput } from "./helpers/text";
import {
  DEST_GRATE_OPEN,
  DEST_STEPS,
  OBJ_GRILL,
  GRILL_START_ROOM,
  DEATH_EXIT,
  ITEM_START,
  ITEM_END,
  MONSTER_START,
  MONSTER_END,
  OBJ_SWORD,
  ROOM_BRIDGE_HALF,
  ROOM_DRAWBRIDGE,
  ROOM_LOKI_STATUE,
  ROOM_WATERFALL,
} from "./constants";
import {
  canSee,
  describeVisibleEntities,
  getLocationText,
} from "./logic/descriptions";
import { describeEntity, matchesEntityName } from "./data/entities";
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
  for (let i = ITEM_START; i <= ITEM_END; i += 1) {
    if (state.positions[i] === -1) {
      carried.push(describeEntity(i));
    }
  }
  if (!carried.length) {
    return ["You are carrying nothing."];
  }
  return ["You are carrying:", ...carried];
}

function findItemInCommand(normalized: string): number | null {
  for (let i = ITEM_START; i <= ITEM_END; i += 1) {
    if (matchesEntityName(normalized, i)) {
      return i;
    }
  }
  return null;
}

function findMonsterInRoom(state: GameState): number | null {
  for (let i = MONSTER_START; i <= MONSTER_END; i += 1) {
    if (state.positions[i] === state.room) {
      return i;
    }
  }
  return null;
}

function handleCombat(state: GameState, monsterIndex: number): string[] {
  const output: string[] = [];
  // Increase fight counter to approximate BASIC's F
  if (typeof (state as any)._fightCount === "undefined") {
    (state as any)._fightCount = 0;
  }
  (state as any)._fightCount += 1;
  const fightCount = (state as any)._fightCount as number;

  // Chance of immediate death grows with fights (BASIC line 144/145)
  if (Math.random() * 7 + 15 <= fightCount) {
    state.alive = false;
    output.push(
      "You swing with your sword but miss and the creature smashes your skull."
    );
    return output;
  }

  // Chance to kill
  if (Math.random() < 0.38) {
    output.push("The sword strikes home and your foe dies...");
    state.positions[monsterIndex] = 0;
    return output;
  }

  // Otherwise exchange blows with flavor text
  const lines = [
    "You attack but the creature moves aside.",
    "The creature deflects your blow.",
    "The foe is stunned but quickly regains his balance.",
    "You missed and he deals a blow to your head.",
  ];
  output.push(lines[Math.floor(Math.random() * lines.length)]);
  return output;
}

export function handleInput(state: GameState, raw: string): GameResponse {
  const normalized = normalizeInput(raw);
  state.moves += 1;
  applyDynamicFlags(state);

  const output: string[] = [];

  // Candle dim/out messages (BASIC lines 59–62)
  if (state.moves > 200 && state.moves < 230) {
    output.push("Your candle is growing dim.");
  } else if (state.moves >= 230 && state.candleLit) {
    state.candleLit = false;
    output.push("In fact...it went out!");
  }

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

  if (search(normalized, " galar ") > 0) {
    output.push("Suddenly a magic wind carried you to another place...");
    state.room = 16;
    return { output, state };
  }

  if (search(normalized, " ape ") > 0) {
    output.push("Hey! the eastern wall of the crypt slid open...");
    state.cryptWallExit = 38;
    return { output, state };
  }

  const itemIndex = findItemInCommand(normalized);

  // Get/drop handling
  if (search(normalized, " get ") > 0 || search(normalized, " take ") > 0) {
    if (!itemIndex) {
      output.push("Where? I can't see it.");
      return { output, state };
    }
    if (state.positions[itemIndex] !== state.room) {
      output.push("Where? I can't see it.");
      return { output, state };
    }
    let carriedCount = 0;
    for (let i = ITEM_START; i <= ITEM_END; i += 1) {
      if (state.positions[i] === -1) carriedCount += 1;
    }
    if (carriedCount > 10) {
      output.push("You are carrying too many objects.");
      return { output, state };
    }
    state.positions[itemIndex] = -1;
    output.push("Taken.");
    return { output, state };
  }

  if (search(normalized, " drop ") > 0) {
    if (!itemIndex) {
      output.push("Where? I can't see it.");
      return { output, state };
    }
    if (state.positions[itemIndex] !== -1) {
      output.push("You're not carrying that.");
      return { output, state };
    }
    state.positions[itemIndex] = state.room;
    output.push("Dropped.");
    return { output, state };
  }

  if (
    search(normalized, " kill ") > 0 ||
    search(normalized, " attack ") > 0
  ) {
    const monsterIndex = findMonsterInRoom(state);
    if (!monsterIndex) {
      output.push("But there's nothing to kill...");
      return { output, state };
    }
    if (state.positions[OBJ_SWORD] !== -1) {
      output.push("How am I supposed to use it?");
      return { output, state };
    }
    output.push(...handleCombat(state, monsterIndex));
    return { output, state };
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
  if (state.room === ROOM_BRIDGE_HALF) {
    state.bridgeRopeExit = DEATH_EXIT;
  }
  if (state.room === ROOM_WATERFALL) {
    state.waterfallLedgeExit = DEST_STEPS;
  }
  if (state.room === ROOM_LOKI_STATUE) {
    state.waterfallLedgeExit = 0;
  }
  if (state.positions[OBJ_GRILL] !== GRILL_START_ROOM) {
    state.grateExit = DEST_GRATE_OPEN;
  }
  if (state.room === ROOM_DRAWBRIDGE) {
    state.drawbridgeExit = ROOM_DRAWBRIDGE;
  }
}

export function getState(state: GameState): GameState {
  return state;
}
