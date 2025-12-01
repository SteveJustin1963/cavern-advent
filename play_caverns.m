% play_caverns.m
% 
% An Octave implementation of the classic text adventure game "Caverns".
% 
% This program is a port of the 1983 BASIC game by John Hardy. The game
% data (map, descriptions, etc.) has been transcribed from the original
% BASIC source code.
% 
% NOTE: Octave is not ideally suited for this type of string-heavy,
% state-management-based application. This implementation is for
% demonstration purposes and will have limitations compared to a version
% written in a more appropriate language like Python or JavaScript.
% 
% To play, run this script in Octave:
% 
%   octave play_caverns.m
% 

function play_caverns()
  % Suppress warnings about shadowed functions
  warning('off', 'Octave:shadowed-function');

  play_again = true;
  while (play_again)
    % Game data initialization
    state = initialize_game_state();
    descriptions = get_room_descriptions();
    entities = get_entity_descriptions();
    map = get_game_map();
    direction_words = {"north", "south", "west", "east"};

    printf("Welcome to Caverns!\n");
    printf("Based on the 1983 game by John Hardy.\n");
    printf("Move: n=north, s=south, e=east, w=west\n");
    printf("Commands: l=look, i=inventory, h=help, q=quit\n");
    printf("----------------------------------------------------------\n");

    % Main game loop
    while (state.alive)
      % 1. Describe the location
      [state, canSee] = describe_location(state, descriptions);

      if canSee
          % 2. List visible objects and monsters
          list_visible_entities(state, entities);

          % 2a. Check for monster in room
          state.monsterInRoom = 0;
          for i = 1:6
              if state.positions(i) == state.room
                  state.monsterInRoom = i;
                  break;
              end
          end

      else
          state.monsterInRoom = 0;
      end

      % 3. Get player input
      printf("> ");
      fflush(stdout);
      command = get_input_with_arrows();

      % 4. Process the command
      state = process_command(state, command, map, direction_words, entities);

      % 5. Update dynamic exits based on player actions and location
      if state.room == 11
          state.H = 128; % Bridge collapse
      end
      if state.room == 49
          state.D = 49; % Drawbridge open
      end
      if state.room == 45
          state.W = 43; % Waterfall steps appear
      end
      if state.room == 35
          state.W = 0; % Waterfall steps disappear
      end
      if state.positions(24) ~= 38
          state.G = 39; % Grate is open if grill moved
      end

      % 6. Monster Movement
      for i = 1:6
        % Check if monster is alive
        if state.positions(i) > 0 && state.positions(i) < 128
          % 25% chance to move
          if rand() < 0.25
            current_room = state.positions(i);
            possible_moves = [];
            for dir = 1:4
              dest = get_exit_from_room(state, map, current_room, dir);
              if dest > 0 && dest < 128
                possible_moves(end+1) = dest;
              end
            end
            if ~isempty(possible_moves)
              state.positions(i) = possible_moves(randi(length(possible_moves)));
            end
          end
        end
      end

    endwhile

    % Game over
    play_again = show_score(state);
  endwhile
end

% --- Input Handling Functions ---

function command = get_input_with_arrows()
  % Read input and convert arrow keys to directional commands
  raw_input = input("", "s");
  command = lower(strtrim(raw_input));

  % Single-letter shortcuts
  if strcmp(command, "n")
    command = "north";
  elseif strcmp(command, "s")
    command = "south";
  elseif strcmp(command, "e")
    command = "east";
  elseif strcmp(command, "w")
    command = "west";
  elseif strcmp(command, "l")
    command = "look";
  elseif strcmp(command, "i")
    command = "list";
  elseif strcmp(command, "q")
    command = "quit";
  elseif strcmp(command, "h")
    command = "help";
  end

  % Check for arrow key sequences (ANSI escape codes)
  % Up arrow: ESC[A, Down: ESC[B, Right: ESC[C, Left: ESC[D
  if length(command) >= 3
    % Real escape sequence
    if command(1) == char(27) && command(2) == '['
      arrow = command(3);
      if arrow == 'A'
        command = "north";
      elseif arrow == 'B'
        command = "south";
      elseif arrow == 'C'
        command = "east";
      elseif arrow == 'D'
        command = "west";
      end
    % Literal caret sequences that some terminals show
    elseif length(command) >= 4 && strcmp(command(1:3), "^[[")
      arrow = command(4);
      if arrow == 'a'
        command = "north";
      elseif arrow == 'b'
        command = "south";
      elseif arrow == 'c'
        command = "east";
      elseif arrow == 'd'
        command = "west";
      end
    end
  end
end

% --- Data Initialization Functions ---

function state = initialize_game_state()
  state.room = 1;
  state.alive = true;
  state.moves = 0;
  state.health = 100;
  state.candleLit = true;
  state.fightCount = 0;
  state.positions = [36, 19, 10, 14, 17, 47, 8, 1, 51, 45, 22, 46, 54, 19, 19, 19, 19, 0, 34, 7, 18, 15, 24, 38];
  % Dynamic exits
  state.H = 11;
  state.D = 128;
  state.W = 0;
  state.G = 0;
  state.T = 0;
  state.E = 0;
end

function descriptions = get_room_descriptions()
  descriptions = {
    "You are standing in a darkened room. There is a door to the north.", % 1
    "You are in a forest clearing before a small bark hut. There are no windows, and a locked door to the south. The latch was engaged when you closed the door.", % 2
    "You are deep in a dark forest. In the distance you can see a mighty river.", % 3
    "You are standing in a field of four-leafed clovers. There is a small hut to the north.", % 4
    "The forest has opened up at this point. You are standing on a cliff overlooking a wide glacial river. A small foot-beaten path leads south.", % 5
    "You are standing at the rocky edge of the mighty river Gioll. The path forks east and west.", % 6
    "You are on the edge of an enormous crater. The rim is extremely slippery. Clouds of water vapour rise high in the air as the Gioll pours into it.", % 7
    "The path to the east stops here. You are on a rocky outcrop, projected about 15 feet above the river. In the distance, a tiny bridge spans the river.", % 8
    "You are on the lower slopes of Mt. Ymir. The forest stretches far away and to the west. Arctic winds blow fiercely, it's very cold!", % 9
    "You stand on a rocky precipice high above the river, Gioll; Mt. Ymir stands to the north. A flimsy string bridge spans the mighty river.", % 10
    "You have made your way half way across the creaking bridge. It sways violently from side to side. It's going to collapse any second!!", % 11
    "You are on the southern edge of the mighty river, before the string bridge.", % 12
    "You are standing in a rock in the middle of a mighty oak forest. Surrounding you are thousands of poisonous mushrooms.", % 13
    "You are in a clearing in the forest. An ancient basalt rock formation towers above you. To your south is the entrance of a VERY interesting cave...", % 14
    "You are on a cliff face over looking the river.", % 15
    "You are just inside the cave. Sunlight pours into the cave lighting a path to the east and another to the south. I don't mind saying I'm a bit scared!", % 16
    "This passage appears to be a dead end. On a wall before you is carved 'Find the Sacred Key of Thialfi'.", % 17
    "You are deep in a dark cavern.", % 18
    "You are in the legendary treasure room of the black elves of Svartalfheim. Every red-blooded Viking has dreamed of entering this sacred room.", % 19
    "You can see a small oak door to the east. It has been locked from the inside.", % 20
    "You are deep in a dark cavern.", % 21
    "You are standing in an east-west corridor. You can feel a faint breeze coming from the east.", % 22
    "You are standing in what appears to have once been a torture chamber. Apart from the rather comprehensive range of instruments of absolutely inhuman agony, coagulated blood stains on the walls and mangled bits of bone on the floor make me think that a number of would be adventurers croaked it here!", % 23
    "You stand in a long tunnel which has been bored out of the rock. It runs from north to south. A faint glow comes from a narrow crack in the eastern wall.", % 24
    "You are deep in a dark cavern.", % 25
    "You are in a large round room with a number of exits. The walls have been painted in a mystical dark purple and a big chalk star is drawn in the centre of the floor. Note: This is one of the hidden chambers of the infamous pagan sect, the monks of Loki. Norse folk believe them to be gods.", % 26
    "You are standing on a narrow ledge, high above a subterranean river. There is an exit to the east. ", % 27
    "You are on a balcony, overlooking a huge cavern which has been converted into a pagan temple. Note: this temple has been dedicated to Loki, the god of fire, who came to live in Svartalfheim after he had been banished to exile by Odin. Since then he has been waiting for the 'End Of All Things'.", % 28
    "You are deep in a dark cavern.", % 29
    "You are deep in a dark cavern.", % 30
    "You are deep in a dark cavern.", % 31
    "You are deep in a dark cavern.", % 32
    "You are in the central cave of a giant bat colony. Above you hundreds of giant bats hang from the ceiling and the floor is covered in centuries of giant bat droppings. Careful where you step! Incidentally, the smell is indescribable.", % 33
    "You are deep in a dark cavern.", % 34
    "You are in the temple. To the north is a locked gate and on the wall is a giant statue of Loki, carved out of the living rock itself!", % 35
    "You are deep in a dark cavern.", % 36
    "You stand in an old and musty crypt, the final resting place of hundreds of Loki devotees. On the wall is carved:``What 3 letter word completes a word starting with 'G---' and another ending with '---X'' Note: The monks of Loki must have liked silly puzzles. Putrefaction and decay fills the air here.", % 37
    "You are in a tiny cell. The western wall has now firmly closed again. There is a ventilator shaft on the eastern wall.", % 38
    "You are deep in a dark cavern.", % 39
    "You are on another ledge high above a subterranean river. The water flows in through a hole in the cavern roof, to the north.", % 40
    "Somehow you have gotten into the complex drainage system of this entire cavern network!!", % 41
    "Somehow you have gotten into the complex drainage system of this entire cavern network!!", % 42
    "Somehow you have gotten into the complex drainage system of this entire cavern network!!", % 43
    "Somehow you have gotten into the complex drainage system of this entire cavern network!!", % 44
    "You are standing near an enormous waterfall which brings water down from the surface, from the river Gioll.", % 45
    "You are deep in a dark cavern.", % 46
    "You are standing before a stone staircase which leads southwards.", % 47
    "You are on a narrow and crumbling ledge. On the other side of the river you can see a magic castle. (Don't ask me why it's magic...I just know it is)", % 48
    "You are by the drawbridge which has just lowered itself....by magic!!", % 49
    "You are in the courtyard of the magic castle. WOW! This castle is really something! On the wall is inscribed 'hzb tzozi'. A secret escape tunnel leads south", % 50
    "You are in the powder magazine of this really super castle.", % 51
    "You are on the eastern side of the river. A small tunnel leads east into the cliff face.", % 52
    "You are deep in a dark cavern.", % 53
    "You are in a conduit draining into the river. The water comes up to your knees and is freezing cold. A narrow service path leads south." % 54
  };
end

function entities = get_entity_descriptions()
  entities = {
    "an evil wizard", "a fiery demon", "an axe wielding troll", "a fire breathing dragon", "a giant bat", "an old and gnarled dwarf", "a gold coin", "a useful looking compass", "a home made bomb", "a blood red ruby", "a sparkling diamond", "a moon-like pearl", "an interesting stone", "a diamond studded ring", "a magic pendant", "a most holy grail", "a mirror like shield", "a nondescript black box", "an old an rusty key", "a double bladed sword", "a small candle", "a thin and tatty rope", "a red house brick", "a rusty ventilation grill"
  };
end

function map = get_game_map()
  % Symbolic exits are represented by negative numbers:
  % H=-1, T=-2, E=-3, W=-4, G=-5, D=-6
  map_data = [
    2,0,0,0;0,0,3,4;2,5,5,0;2,5,0,9;0,6,3,4;5,0,7,8;0,0,128,6;0,0,6,0;0,10,4,0;9,-1,4,0;10,12,128,128;-1,13,13,0;12,12,14,12;15,16,0,13;0,14,0,0;14,18,0,17;0,16,0,16;0,23,0,0;0,20,0,21;23,0,-2,0;24,0,20,0;23,21,16,22;0,18,18,21;26,0,18,0;27,24,0,24;27,29,25,18;0,0,28,0;0,27,0,0;33,0,26,29;31,0,0,32;0,0,0,31;34,0,0,0;0,33,0,0;0,0,0,39;0,35,40,0;35,0,-3,-4;0,0,-5,0;36,38,0,45;48,36,128,46;43,54,42,46;43,41,43,46;38,42,44,47;47,0,47,0;40,0,128,47;0,47,47,0;45,46,0,40;128,0,-6,0;0,48,50,0;52,49,51,0;0,50,0,50;0,53,50,54;0,0,52,0;53,41,0,0
  ];
  % Fill up to 54 rows
  map = zeros(54, 4);
  map(1:size(map_data,1), :) = map_data;
end

% --- Core Game Logic Functions ---

function [state, canSee] = describe_location(state, descriptions)
  canSee = true;
  printf("\n----------------------------------------------------------\n");
  printf("[Health: %d/100]\n", state.health);

  % Candle dim/out messages
  if state.moves > 200 && state.candleLit
    printf("Your candle is growing dim.\n");
  end
  if state.moves >= 230 && state.candleLit
    printf("In fact...it went out!\n");
    state.candleLit = false;
  end

  % Darkness check (BASIC line 7)
  is_dark_room = state.room >= 18;
  candle_is_lit = state.candleLit;
  candle_is_nearby = (state.positions(21) == state.room || state.positions(21) == -1);

  if is_dark_room && (~candle_is_lit || ~candle_is_nearby)
    printf("It's very dark, too dark to see anything...I'm scared!\n");
    canSee = false;
    return;
  end

  if state.room > 0 && state.room <= length(descriptions)
    printf("%s\n", descriptions{state.room});
  else
    printf("You are lost in the void.\n");
  end

  % Special room messages (BASIC 56-58)
  if (state.room == 10 || state.room == 12) && state.H == 128
    printf("Two of the ropes have snapped under your weight. It's totally unfit to cross again.\n");
  end
  if state.room == 14 && state.positions(4) == 0
    printf("You can also see the bloody corpse of an enormous dragon.\n");
  end
  if state.room == 48 && state.D == 49
    printf(" A mighty golden drawbridge spans the waters.\n");
  end
end

function list_visible_entities(state, entities)
  % List items
  items_here = {};
  for i = 7:24
    if state.positions(i) == state.room
      items_here{end+1} = entities{i};
    end
  end
  if ~isempty(items_here)
    printf("You can also see...\n");
    for i = 1:length(items_here)
      printf("  %s\n", items_here{i});
    end
  end

  % List monsters
  monsters_here = {};
  for i = 1:6
    if state.positions(i) == state.room
      % Special encounter text (BASIC line 207)
      if i == 1 % Wizard
        printf("There, before you in a swirling mist stands an evil wizard with his hand held outwards...`Thou shall not pass' he cries.\n");
      elseif i == 4 % Dragon
        printf("Before the entrance of the cave lies an enormous, green, sleeping dragon. Realizing your presence, its eyes flicker open and it leaps up, breathing jets of fire at you.\n");
      elseif i == 6 % Dwarf
        printf("From around the corner trots an old and gnarled drawf carrying a lantern. `My job is to protect these stone steps!' he says and lunges at you with his dagger.\n");
      else
        printf("Nearby there lurks... %s\n", entities{i});
      end
    end
  end
end

function state = process_command(state, command, map, direction_words, entities)
  % Don't increment moves for help or look commands
  if ~strcmp(command, "help") && ~strcmp(command, "look")
    state.moves = state.moves + 1;
  end

  % Monster encounter - take damage if not fighting
  if state.monsterInRoom > 0
    parts = strsplit(command);
    verb = parts{1};
    if ~strcmp(verb, "attack") && ~strcmp(verb, "kill")
      if state.monsterInRoom == 5 % Giant Bat - special behavior
        printf("The giant bat picked you up and carried you to another place.\n");
        state.room = 33;
        state.positions(5) = state.positions(5) + 7; % Move the bat
        return;
      else
        % Take damage from monster
        damage = randi([8, 15]); % Random damage 8-15
        state.health = state.health - damage;
        printf("%s attacks you! You take %d damage. [Health: %d/100]\n", ...
               entities{state.monsterInRoom}, damage, state.health);

        if state.health <= 0
          printf("AUUUUUGH...you've been killed by %s!!\n", entities{state.monsterInRoom});
          state.alive = false;
          return;
        end
        return;
      end
    end
  end

  if strcmp(command, "quit")
    state.alive = false;
    return;
  end

  if strcmp(command, "help")
    printf("\n");
    printf("                      ╔════════════════════════════════╗\n");
    printf("                      ║      CAVERNS HELP TREE         ║\n");
    printf("                      ║    Health: 0-100 | Max Items:10║\n");
    printf("                      ╚════════════════════════════════╝\n");
    printf("                                   │\n");
    printf("              ┌────────────────────┼────────────────────┐\n");
    printf("              │                    │                    │\n");
    printf("        ┌─────▼──────┐      ┌──────▼─────┐      ┌──────▼─────┐\n");
    printf("        │  EXPLORE   │      │   FIGHT    │      │    GAME    │\n");
    printf("        └─────┬──────┘      └──────┬─────┘      └──────┬─────┘\n");
    printf("              │                    │                    │\n");
    printf("    ┌─────────┼─────────┐          │              ┌─────┴─────┐\n");
    printf("    │         │         │          │              │           │\n");
    printf("┌───▼───┐ ┌───▼───┐ ┌───▼────┐ ┌───▼────┐    ┌────▼────┐ ┌───▼───┐\n");
    printf("│ MOVE  │ │ LOOK  │ │ ITEMS  │ │ MAGIC  │    │  HELP   │ │ QUIT  │\n");
    printf("└───┬───┘ └───┬───┘ └───┬────┘ └───┬────┘    └────┬────┘ └───┬───┘\n");
    printf("    │         │         │          │              │          │\n");
    printf("┌───┴───┐     │    ┌────┴─────┐    │              h          q\n");
    printf("│n,s,e,w│     l    │get/take  │  ┌─┴──┐                      │\n");
    printf("│(need  │     │    │drop/put  │  │use │                   Exit game\n");
    printf("│compass│     │    │          │  └─┬──┘\n");
    printf("│or     │     │    └────┬─────┘    │\n");
    printf("│random)│     │         │      ┌───┴────┐\n");
    printf("└───────┘     │    ┌────▼────┐ │ galar  │ Teleport\n");
    printf("              │    │  key    │ │  ape   │ Open wall\n");
    printf("         ┌────▼──┐ │  bomb   │ │say magic│ Castle only\n");
    printf("         │  i    │ │  rope   │ └────────┘\n");
    printf("         │inventory │ candle  │\n");
    printf("         └───────┘ │  sword  │\n");
    printf("                   └─────────┘\n");
    printf("                        │\n");
    printf("                   ┌────▼─────┐\n");
    printf("                   │Max 10    │\n");
    printf("                   │items     │\n");
    printf("                   └──────────┘\n");
    printf("\n");
    printf("         ╔═══════════════════════════════════════════╗\n");
    printf("         ║ COMBAT: attack/kill (need sword!)        ║\n");
    printf("         ║ Damage: 3-25 per hit | Run by moving away║\n");
    printf("         ╚═══════════════════════════════════════════╝\n");
    printf("\n");
    return;
  end

  if strcmp(command, "look")
    % The loop will re-describe, so just pass
    return;
  end

  if strcmp(command, "list")
    printf("You are carrying:\n");
    carried_count = 0;
    for i = 7:24
      if state.positions(i) == -1
        printf("  %s\n", entities{i});
        carried_count = carried_count + 1;
      end
    end
    if carried_count == 0
      printf("  nothing.\n");
    end
    return;
  end

  % Movement
  for i = 1:length(direction_words)
    if strcmp(command, direction_words{i})
      dir = i;
      original_dir = dir;

      % Compass randomization: if compass not present, pick random direction (BASIC 115-116)
      has_compass = (state.positions(8) == -1 || state.positions(8) == state.room);
      if ~has_compass
        dir = randi(4);
      end

      dest = get_exit(state, map, dir);
      if dest == 0
        printf("You can't go that way.\n");
      elseif dest == 128
        printf("You stumble and fall into the chasm and smash yourself to a pulp on the rocks below.\n");
        state.alive = false;
      else
        % Show movement message with direction
        dir_names = {"north", "south", "west", "east"};
        printf("Moved %s.\n", dir_names{dir});
        state.room = dest;
      end
      return;
    end
  end

  % Magic Words
  if strcmp(command, "galar")
    printf("Suddenly a magic wind carried you to another place...\n");
    state.room = 16;
    return;
  end

  if strcmp(command, "ape")
    printf("Hey! the eastern wall of the crypt slid open...\n");
    state.E = 38;
    % BASIC doesn't reveal box with "ape", so removed that logic
    return;
  end

  % "say magic" from room 50
  if strcmp(command, "say magic")
    printf("A magical energy fills the room... and you are teleported!\n");
    state.room = randi(54);
    return;
  end

  % Get/Drop/Use commands with expanded verb support
  parts = strsplit(command);
  if length(parts) >= 1
    verb = parts{1};
    if strcmp(verb, "kill") || strcmp(verb, "attack")
      if state.monsterInRoom > 0
        state = handle_combat(state);
      else
        printf("But there's nothing to kill...\n");
      end
      return;
    end

    % Additional verb responses (BASIC 170-172)
    if strcmp(verb, "light") || strcmp(verb, "burn")
      printf("Nothing happens!\n");
      return;
    end
    if strcmp(verb, "cut") || strcmp(verb, "break") || strcmp(verb, "unlock") || strcmp(verb, "open")
      printf("Please tell me how.\n");
      return;
    end
    if strcmp(verb, "up") || strcmp(verb, "down") || strcmp(verb, "jump") || strcmp(verb, "swim")
      printf("I can't!\n");
      return;
    end
  end

  if length(parts) >= 2
    verb = parts{1};
    obj_name = strjoin(parts(2:end), ' ');

    obj_idx = -1;
    for i = 7:24
      if ~isempty(strfind(lower(entities{i}), lower(obj_name)))
        obj_idx = i;
        break;
      end
    end

    if obj_idx ~= -1
      if strcmp(verb, 'get') || strcmp(verb, 'take')
        if state.positions(obj_idx) == state.room
          % Simple capacity check
          carried_count = sum(state.positions(7:24) == -1);
          if carried_count >= 10
            printf("You are carrying too many objects.\n");
          else
            state.positions(obj_idx) = -1;
            printf("Taken.\n");
          end
        else
          printf("Where? I can't see it.\n");
        end
        return;
      elseif strcmp(verb, 'drop') || strcmp(verb, 'put')
        if state.positions(obj_idx) == -1
          state.positions(obj_idx) = state.room;
          printf("Dropped.\n");
        else
          printf("You're not carrying that.\n");
        end
        return;
      elseif strcmp(verb, 'use') || strcmp(verb, 'using') || strcmp(verb, 'with')
        % Check if player has the item or it's in the room
        if state.positions(obj_idx) ~= -1 && state.positions(obj_idx) ~= state.room
          printf("You don't have that item.\n");
          return;
        end
        % Key (19)
        if obj_idx == 19
          if state.room == 2 || state.room == 35
            printf("You opened the door.\n");
            state.positions(19) = state.room; % Drop the key
            if state.room == 2
              state.room = 1;
            else
              state.room = 37;
            end
          else
            printf("It won't open!\n");
          end
          return;
        end
        % Candle (21) for bomb (9)
        if obj_idx == 21
          bomb_present = state.positions(9) == -1 || state.positions(9) == state.room;
          if bomb_present
            if state.candleLit
              printf("The fuse burnt away and....BOOM!!....the explosion blew you out of the way (Lucky!)\n");
              state.positions(9) = 0; % bomb destroyed
              if state.room == 20
                state.T = 19;
              end
              if state.room > 1
                state.room = state.room - 1;
              end
            else
              printf("But the candle is out, stupid!!\n");
            end
          else
            printf("That won't burn, Dummy...In fact, the candle went out.\n");
            state.candleLit = false;
          end
          return;
        end
        % Rope (22)
        if obj_idx == 22
          if state.room == 28
            printf("You descend the rope, but it drops 10 feet short of the floor. You jump the rest of the way.\n");
            state.positions(22) = state.room; % Drop rope
            state.room = 35;
          else
            printf("It's too dangerous!!!\n");
          end
          return;
        end
        printf("How am I supposed to use it?\n");
        return;
      end
    end
  end

  printf("eh?\n");
end

function state = handle_combat(state)
    state.fightCount = state.fightCount + 1;

    % Check if player has the sword (item 20) - must be carried!
    if state.positions(20) ~= -1
        printf("How am I supposed to do that?\n");
        return;
    end

    % Higher chance of taking damage as you fight more
    if (rand() * 7 + 15) <= state.fightCount
        damage = randi([15, 25]); % Heavy damage from critical hit
        state.health = state.health - damage;
        printf("You swing with your sword but miss! The creature counter-attacks for %d damage. [Health: %d/100]\n", ...
               damage, state.health);

        if state.health <= 0
            printf("AUUUUUGH...you've been killed!\n");
            state.alive = false;
        end
        return;
    end

    % Chance to kill the monster
    if rand() < 0.38
        printf("The sword strikes home and your foe dies...\n");
        state.positions(20) = -1; % Return sword to inventory (BASIC 153)

        monster_id = state.monsterInRoom;

        % Troll or Bat are repositioned, not killed (BASIC 153)
        if monster_id == 3 || monster_id == 5 % Troll or Bat
            state.positions(monster_id) = state.positions(monster_id) + 10;
        else
            state.positions(monster_id) = 0; % Monster is killed
        end

        % Wizard destroys sword (BASIC 153)
        if monster_id == 1
            printf("Hey! Your sword has just crumbled into dust!!\n");
            state.positions(20) = 35; % Sword moved to room 35
        end

        % Dragon corpse stays (BASIC 154)
        if monster_id ~= 4
            printf("Suddenly a black cloud descends and the corpse vaporizes into nothing.\n");
        end

        state.monsterInRoom = 0;
    else
        % Missed attack - take some damage
        damage = randi([3, 10]); % Light damage from exchanging blows
        state.health = state.health - damage;

        lines = {
            sprintf("You attack but the creature moves aside and strikes back! -%d HP. [Health: %d/100]", damage, state.health),
            sprintf("The creature deflects your blow and counters! -%d HP. [Health: %d/100]", damage, state.health),
            sprintf("The foe is stunned but quickly retaliates! -%d HP. [Health: %d/100]", damage, state.health),
            sprintf("You missed and took a hit! -%d HP. [Health: %d/100]", damage, state.health)
        };
        printf("%s\n", lines{randi(length(lines))});

        if state.health <= 0
            printf("AUUUUUGH...you've been killed!\n");
            state.alive = false;
        end
    end
end

function dest = get_exit(state, map, dir)
    exit_val = map(state.room, dir);
    if exit_val < 0
        switch exit_val
            case -1 dest = state.H;
            case -2 dest = state.T;
            case -3 dest = state.E;
            case -4 dest = state.W;
            case -5 dest = state.G;
            case -6 dest = state.D;
            otherwise dest = 0;
        end
    else
        dest = exit_val;
    end
end

function dest = get_exit_from_room(state, map, room, dir)
    % Helper function to get exits from a specific room (used for monster movement)
    exit_val = map(room, dir);
    if exit_val < 0
        switch exit_val
            case -1 dest = state.H;
            case -2 dest = state.T;
            case -3 dest = state.E;
            case -4 dest = state.W;
            case -5 dest = state.G;
            case -6 dest = state.D;
            otherwise dest = 0;
        end
    else
        dest = exit_val;
    end
end

function restart = show_score(state)
  score = 0;
  for i = 7:17 % Treasures
    if state.positions(i) == -1 % Carried
      score = score + (i - 6);
    end
    if state.positions(i) == 1 % In starting room
      score = score + (i - 6) * 2;
    end
  end

  printf("\n----------------------------------------------------------\n");
  printf("You have a score of %d out of a possible 126 points in %d moves.\n", score, state.moves);
  printf("This gives you an adventurer's ranking of:\n");
  if score < 20
    printf("Hopeless beginner\n");
  elseif score < 50
    printf("Experienced loser\n");
  elseif score < 100
    printf("Average Viking\n");
  elseif score < 126
    printf("Excellent...but you've left something behind!\n");
  else
    printf("Perfectionist and genius!!\n");
  end
  printf("Thanks for playing!\n");

  while true
    replay = lower(strtrim(input("Another adventure? (Y/N) ", "s")));
    if strcmp(replay, "y")
      restart = true;
      return;
    elseif strcmp(replay, "n")
      restart = false;
      return;
    end
  end
end
