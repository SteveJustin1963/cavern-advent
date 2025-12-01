import { describeEntity } from "../data/entities";
import {
  DEATH_EXIT,
  ITEM_END,
  ITEM_START,
  MONSTER_END,
  MONSTER_START,
  OBJ_CANDLE,
} from "../constants";
import { GameState } from "../types";

export function canSee(state: GameState): boolean {
  const candleLocation = state.positions[OBJ_CANDLE];
  const candleNearby = candleLocation === state.room || candleLocation === -1;
  return state.room < 18 || (state.candleLit && candleNearby);
}

export function getLocationText(state: GameState): string[] {
  if (!canSee(state)) {
    return ["It's very dark, too dark to see anything...I'm scared!"];
  }

  const a = state.room;
  const lines: string[] = [];

  switch (a) {
    case 1:
      lines.push(
        "You are standing in a darkened room. There is a door to the north."
      );
      break;
    case 2:
      lines.push(
        "You are in a forest clearing before a small bark hut. There are no windows, and locked door to the south. The latch was engaged when you closed the door."
      );
      break;
    case 3:
      lines.push(
        "You are deep in a dark forest. In the distance you can see a mighty river."
      );
      break;
    case 4:
      lines.push(
        "You are standing in a field of four-leafed clovers. There is a small hut to the north."
      );
      break;
    case 13:
      lines.push(
        "You are standing on a rock in the middle of a mighty oak forest. Surrounding you are thousands of poisonous mushrooms."
      );
      break;
    case 15:
      lines.push("You are on a cliff face overlooking the river.");
      break;
    case 5:
      lines.push(
        "The forest has opened up at this point. You are standing on a cliff overlooking a wide glacial river. A small foot-beaten path leads south."
      );
      break;
    case 6:
      lines.push(
        "You are standing at the rocky edge of the mighty river Gioll. The path forks east and west."
      );
      break;
    case 7:
      lines.push(
        "You are on the edge of an enormous crater. The rim is extremely slippery. Clouds of water vapour rise high in the air as the Gioll pours into it."
      );
      break;
    case 8:
      lines.push(
        "The path to the east stops here. You are on a rocky outcrop, projected about 15 feet above the river. In the distance, a tiny bridge spans the river."
      );
      break;
    case 9:
      lines.push(
        "You are on the lower slopes of Mt. Ymir. The forest stretches far away and to the west. Arctic winds blow fiercely, it's very cold!"
      );
      break;
    case 10:
      lines.push(
        "You stand on a rocky precipice high above the river, Gioll; Mt. Ymir stands to the north. A flimsy string bridge spans the mighty river."
      );
      break;
    case 11:
      lines.push(
        "You have made your way half way across the creaking bridge. It sways violently from side to side. It's going to collapse any second!!"
      );
      break;
    case 12:
      lines.push(
        "You are on the southern edge of the mighty river, before the string bridge."
      );
      break;
    case 14:
      lines.push(
        "You are in a clearing in the forest. An ancient basalt rock formation towers above you. To your south is the entrance of a VERY interesting cave..."
      );
      break;
    case 16:
      lines.push(
        "You are just inside the cave. Sunlight pours into the cave lighting a path to the east and another to the south. I don't mind saying I'm a bit scared!"
      );
      break;
    case 17:
      lines.push(
        "This passage appears to be a dead end. On a wall before you is carved `Find the Sacred Key of Thialfi'."
      );
      break;
    case 19:
      lines.push(
        "You are in the legendary treasure room of the black elves of Svartalfheim. Every red-blooded Viking has dreamed of entering this sacred room."
      );
      break;
    case 20:
      lines.push(
        "You can see a small oak door to the east. It has been locked from the inside."
      );
      break;
    case 22:
      lines.push(
        "You are standing in an east-west corridor. You can feel a faint breeze coming from the east."
      );
      break;
    case 23:
      lines.push(
        "You are standing in what appears to have once been a torture chamber. Apart from the rather comprehensive range of instruments of absolutely inhuman agony,"
      );
      lines.push(
        "coagulated blood stains on the walls and mangled bits of bone on the floor make me think that a number of would be adventurers croaked it here!"
      );
      break;
    case 24:
      lines.push(
        "You stand in a long tunnel which has been bored out of the rock. It runs from north to south. A faint glow comes from a narrow crack in the eastern wall."
      );
      break;
    case 26:
      lines.push(
        "You are in a large round room with a number of exits. The walls have been painted in a mystical dark purple and a big chalk star is drawn in the centre of the floor."
      );
      lines.push(
        "Note: This is one of the hidden chambers of the infamous pagan sect, the monks of Loki. Norse folk believe them to be gods."
      );
      break;
    case 27:
      lines.push(
        "You are standing on a narrow ledge, high above a subterranean river. There is an exit to the east."
      );
      break;
    case 28:
      lines.push(
        "You are on a balcony, overlooking a huge cavern which has been converted into a pagan temple."
      );
      lines.push(
        "Note: this temple has been dedicated to Loki, the god of fire, who came to live in Svartalfheim after he had been banished to exile by Odin. Since then he has been waiting for the `End Of All Things'."
      );
      break;
    case 33:
      lines.push(
        "You are in the central cave of a giant bat colony. Above you hundreds of giant bats hang from the ceiling and the floor is covered in centuries of giant bat droppings. Careful where you step!"
      );
      lines.push("Incidentally, the smell is indescribable.");
      break;
    case 35:
      lines.push(
        "You are in the temple. To the north is a locked gate and on the wall is a giant statue of Loki, carved out of the living rock itself!"
      );
      break;
    case 37:
      lines.push(
        "You stand in an old and musty crypt, the final resting place of hundreds of Loki devotees. On the wall is carved:``What 3 letter word completes a word starting with 'G---' and another ending with '---X''"
      );
      lines.push(
        "Note: The monks of Loki must have liked silly puzzles. Putrefaction and decay fills the air here."
      );
      break;
    case 38:
      lines.push(
        "You are in a tiny cell. The western wall has now firmly closed again. There is a ventilator shaft on the eastern wall."
      );
      break;
    case 40:
      lines.push(
        "You are on another ledge high above a subterranean river. The water flows in through a hole in the cavern roof, to the north."
      );
      break;
    case 45:
      lines.push(
        "You are standing near an enormous waterfall which brings water down from the surface, from the river Gioll."
      );
      break;
    case 47:
      lines.push(
        "You are standing before a stone staircase which leads southwards."
      );
      break;
    case 48:
      lines.push(
        "You are on a narrow and crumbling ledge. On the other side of the river you can see a magic castle. (Don't ask me why it's magic...I just know it is)"
      );
      break;
    case 49:
      lines.push(
        "You are by the drawbridge which has just lowered itself....by magic!!"
      );
      break;
    case 50:
      lines.push(
        "You are in the courtyard of the magic castle. WOW! This castle is really something! On the wall is inscribed 'hzb tzozi'. A secret escape tunnel leads south"
      );
      break;
    case 51:
      lines.push("You are in the powder magazine of this really super castle.");
      break;
    case 53:
      lines.push("You stand before a small wooden bridge which crosses the river.");
      break;
    case 52:
      lines.push(
        "You are on the eastern side of the river. A small tunnel leads east into the cliff face."
      );
      break;
    case 54:
      lines.push(
        "You are in a conduit draining into the river. The water comes up to your knees and is freezing cold. A narrow service path leads south."
      );
      break;
    default:
      break;
  }

  if (a > 40 && a < 45) {
    lines.push(
      "Somehow you have gotten into the complex drainage system of this entire cavern network!!"
    );
  }

  if (
    a === 18 ||
    a === 21 ||
    a === 25 ||
    (a > 28 && a < 32) ||
    a === 34 ||
    a === 36 ||
    a === 39 ||
    a === 46 ||
    a === 53
  ) {
    lines.push("You are deep in a dark cavern.");
  }

  if ((a === 10 || a === 12) && state.bridgeRopeExit === DEATH_EXIT) {
    lines.push(
      "Two of the ropes have snapped under your weight. It's totally unfit to cross again."
    );
  }

  if (a === 14 && state.positions[4] === 0) {
    lines.push("You can also see the bloody corpse of an enormous dragon.");
  }

  if (a === 48 && state.drawbridgeExit === 49) {
    lines.push("A mighty golden drawbridge spans the waters.");
  }

  if (!lines.length) {
    lines.push("You are deep in a dark cavern.");
  }

  return lines;
}

export function describeVisibleEntities(state: GameState): string[] {
  const here = state.room;
  const lines: string[] = [];
  const objects: string[] = [];
  const monsters: string[] = [];

  for (let i = ITEM_START; i <= ITEM_END; i += 1) {
    if (state.positions[i] === here) {
      objects.push(describeEntity(i));
    }
  }

  for (let i = MONSTER_START; i <= MONSTER_END; i += 1) {
    if (state.positions[i] === here) {
      monsters.push(describeEntity(i));
    }
  }

  if (objects.length) {
    lines.push("You can also see...");
    lines.push(...objects);
  }

  if (monsters.length) {
    lines.push("Nearby there lurks...");
    lines.push(...monsters);
  }

  return lines;
}
