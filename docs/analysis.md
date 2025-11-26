# Caverns BASIC vs Current TypeScript (Audit Notes)

This document treats `docs/caverns-1983.txt` (MicroWorld BASIC) as the source of truth. It highlights the original flow, state, and parser logic, then notes gaps/mismatches in the current TypeScript scaffold (`src/state.ts` + data helpers).

## Core Flow (lines 2–77, 79–173)
- Main loop: describe location → list visible objects/monsters → prompt → normalize input → verb dispatch → repeat.
- Input normalization: pad with spaces, convert A–Z to lowercase via ASCII math (lines 79–81).
- Light gating: darkness check at line 7; uses `A` (room), `C0` candle-lit flag, and positions of candle (P(21)) and current room to decide if “too dark” message suppresses descriptions.
- Visibility listing: objects P(7..24) at room → “You can also see…”, monsters P(1..6) → “Nearby there lurks…”.
- Movement: FOR dir 0..3 over direction words (data 189); resolves exit via DATA map; dest 0 = blocked, 128 = death, else update `A`. Giant bat (Z=5) special teleport alters P(5)+7.
- Special magic words: “galar” teleports to room 16; “ape” opens crypt wall (sets E=38).
- Inventory: “list” prints carried items (P=-1).
- Quit: prints score/rank (lines 102–198) and prompts restart.

## State and Flags
- Primary scalars: `A` (room), `H/D/W/G/T/E` (dynamic exit tokens), `U` (moves), `C0` (candle lit flag), `F` (fight counter), `R` (redraw flag), `Z` (monster at room), etc.
- Dynamic exit updates (lines 86–91): if A=11 set H=128; A=45 set W=43; A=35 set W=0; if P(24)<>38 set G=39; if A=49 set D=49.
- Candle: U increments per command; messages at U>200 (dim) and U<230? when goes out (C0 reset).
- Objects/monsters positions: P(1..6) monsters; P(7..24) objects. -1 = carried, 0 = destroyed/dead.

## DATA Sections (lines 174–191)
- Map: 54 rooms × 4 exits, read sequentially; tokens can be numbers or symbols H/T/E/W/G/D pointing to mutable state.
- Entities: descriptors for monsters (1–6) and items (7–24).
- P initial positions: DATA 188.
- Direction words: DATA 189.
- Verb words: primary (190) and secondary (191) total 16 verbs.

## Parser Branches (key behaviors)
- Command matching uses SEARCH against padded, lowered input.
- Order matters: quit → list → movement → magic words → verb dispatch.
- GET/DROP: “get ” sets P(M)=-1 after capacity check; “drop ” sets P(M)=A.
- Use verbs (lines 139–164): four special cases keyed by M-18 (key, sword, bomb, rope) with location checks, combat logic, fuse handling, rope drop.
- Combat (M=20 sword): uses F counter, RNG vs thresholds; killing certain monsters modifies P(Z) specially (dragons, bats).
- Environmental hazards: bridge collapse (H→128 after crossing), candle light dependency, chasm death exits (128).

## Current TS Snapshot (as of this doc)
- `src/state.ts`: functional engine; supports look, movement, list, quit, look; dynamic exits apply; death uses `DEATH_EXIT`. Missing: darkness gating on candle, scoring, combat, items, magic words, proper capacity checks, fuse/rope logic, most parser branches.
- `src/data/map.ts`: 2D array with `ExitSymbol` for H/T/E/W/G/D; matches BASIC DATA order.
- `src/helpers/text.ts`: matches BASIC normalization.
- `src/logic/descriptions.ts`: renders many room texts and some dynamic messages; uses `canSee` but `candleLit` init is true (BASIC C0 starts unset until candle lit?). Light gating not fully aligned with BASIC (room <18 or lit + candle nearby).

## Known Divergences / TODO to reach fidelity
- Implement full parser order and branches per lines 82–173, including magic words, quit/score, get/drop, special uses, combat, monster movement, and Z handling.
- Mirror light/dark logic and candle timers (U, C0, P(21) proximity, dim/out messages).
- Carry capacity check (max 10 carried) and score/rank computations.
- Properly seed/init flags: C0 should start 1? (BASIC sets C0=1 at line 2), H/D/W/G/T/E initial values and updates.
- Reproduce RNG behavior (`RND`) in combat and teleports.
- Ensure map exits respect mutable tokens and bridge collapse semantics.

Use this as a checklist before modifying TS so behavior matches the BASIC source.***
