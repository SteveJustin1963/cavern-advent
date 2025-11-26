# Caverns 1983 (MicroWorld BASIC) — Literate Walkthrough

This is a stitched, readable walkthrough of `docs/caverns-1983.txt` with the original BASIC source embedded in blocks and commentary alongside. Use it as the reference for aligning the modern TypeScript implementation to the original behavior.

## 1–4: Startup and Intro

```basic
1  REM REMOVED -- POKE ...: ON  ERROR  GOTO 209
2  CLS :H=11:D=128:W=0:G=0:T=0:E=0: DIM I(3):J=0: RESTORE 188: DIM P(24):
   FOR X=1 TO 24: READ P(X): NEXT X:R=0:A=1:C0=1
3  CURS 1,4: SPEED 255: PRINT "  DREAMCARDS presents...  ": SPEED 0
4  CURS 20,6: PRINT "C A V E R N S    by John Hardy (c) 1983"\\SPC(19)
   "Released under GNU Public License in 2019": CURS 0: PLAY 0,40: CLS :F=0:U=0
5  CURS 1,7: PRINT [A63 45]
```

- Line 2 seeds dynamic exits (`H=11` bridge rope target, `D=128` drawbridge exit initially death, `W=0` waterfall ledge exit, `G=0` grate exit, `T=0` bomb door exit, `E=0` crypt wall exit), loads `P(1..24)` (monster/object positions) from DATA 188, sets room `A=1`, candle lit `C0=1`.
- J=0 latches hut state; `R` redraw flag; `U` move counter.
- Lines 3–5 handle intro text/graphics.

## 5–77: Location Descriptions, Light, Visibility

```basic
5  IF Z>0 AND Z<>5 AND M<>20 THEN 111
7  IF A<18 OR C0=1 AND (P(21)=A OR P(21)=-1) THEN 10
8  PRINT "It's very dark, too dark to see anything...I'm scared!"
9  GOTO 72
10 IF A=1 THEN  PRINT "You are standing in a darkened room. There is a door to the north."
...
57 IF A=48 AND D=49 THEN  PRINT  " A mighty golden drawbridge spans the waters."
59 IF U>200 THEN  PRINT "Your candle is growing dim."
61 C0=0: PRINT "In fact...it went out!"
63 V=0
64 FOR L=7 TO 24
65 IF P(L)=A THEN  LET V=V+1
...
75 FOR L=1 TO 6: IF P(L)=A THEN  GOSUB 165
77 PRINT :R=1: PRMT ( )
```

- Darkness gate: if room ≥18 and (candle not lit or candle not nearby), show dark message and skip details.
- Room-specific descriptions (lines 10–57), including dynamic bridge/drawbridge messages.
- Candle timer messages at U>200 and U≥230 (lines 59–62).
- Visibility: list objects P(7..24) in room → “You can also see…”, monsters P(1..6) → “Nearby there lurks…”.
- Prompts for input after setting `R=1`.

## 79–101: Input Normalization, List/Quit

```basic
79 INPUT A0$: IF A0$="" THEN 79 ELSE  LET A0$=" "+A0$+" ":U=U+1
80 FOR X=1 TO  LEN (A0$):Y= ASC (A0$(;X)):
   IF Y>64 AND Y<91 THEN  LET A1$=A0$(;1,X-1)+ CHR (Y+32)+A0$(;X+1):A0$=A1$
81 NEXT X: CLS
82 RESTORE 184
83 FOR M=7 TO 24: READ N0$,N1$
84 IF  SEARCH (A0$,N1$)>0 THEN  NEXT *M 86
85 NEXT M:N0$="":N1$="":M=0
86 IF A=11 THEN  LET H=128
87 IF A=2 THEN  LET J=1
88 IF A=45 THEN  LET W=43
89 IF A=35 THEN  LET W=0
90 IF P(24)<>38 THEN  LET G=39
91 IF A=49 THEN  LET D=49
92 IF  SEARCH (A0$," look ")>0 THEN  LET R=0: GOTO 5
93 IF  SEARCH (A0$," list ")=0 THEN 101
...
```

- Pads input with spaces and lowercases A–Z via ASCII math.
- Attempts to match an object name (N1$) from DATA 184; sets M to the matching object index (7–24).
- Dynamic exit updates on entry to specific rooms (bridge collapse, latch, W open/close, grate open, drawbridge open).
- `look` restarts description; `list` prints carried items.
- `quit` (lines 101–106) prints score/rank (lines 102–198) and asks to replay.

## 107–123: Monster Checks and Movement

```basic
107 FOR Z=1 TO 6: IF P(Z)=A THEN  NEXT *Z 109
...
111 RESTORE 182: FOR N=1 TO Z: READ K0$,K1$: NEXT N
112 PRINT "AUUUUUGH...you've just been killed by a";K0$;K1$;"!!": GOTO 102
113 RESTORE 189: FOR Q=0 TO 3: READ M0$: IF  SEARCH (A0$,M0$)>0 THEN  NEXT *Q 115
...
117 RESTORE 174: FOR N=1 TO A
118 FOR O=0 TO 3: READ I(O): NEXT O: NEXT N
119 B=I(Q)
120 IF B=0 THEN  PRINT "You can't go that way"
121 IF B=128 THEN  PRINT "You stumble and fall into the chasm..."
122 IF B>0 THEN  LET A=B
123 R=0: GOTO 5
```

- If a monster is in the room (P(1..6)=A), sets Z and branches to encounter: bat special (line 109) or death message from DATA 182.
- Movement: parse direction from DATA 189 (north/south/west/east), re-read map DATA 174–181 up to room A, pick exit I(Q); 0=blocked, 128=death, else move to room A=B.

## 124–128: Magic Words

```basic
124 IF  SEARCH (A0$," galar ")>0 THEN  LET R=0: PRINT "Suddenly a magic wind carried you to another place...":A=16: GOTO 5
126 IF  SEARCH (A0$," ape ")>0 THEN  PRINT "Hey! the eastern wall of the crypt slid open...":E=38: GOTO 5
```

- “galar” teleports to room 16; “ape” sets E=38 (opens crypt wall).

## 128–164: Object Handling and Special Uses

```basic
128 IF M<1 THEN  PRINT "eh?": GOTO 5
129 IF P(M)=-1 OR P(M)=A THEN 130 ELSE  PRINT "Where? I can't see it.": GOTO 5
130 IF  SEARCH (A0$," get ")=0 THEN 137
...
135 IF Q>10 THEN  PRINT "You are carrying too many objects.": GOTO 5
136 P(M)=-1: GOTO 5
137 IF  SEARCH (A0$," drop ")=0 THEN 139
138 LET P(M)=A: GOTO 5
139 ON M-18 GOTO 141,143,157,163
140 PRINT "How am I supposed to use it?": GOTO 5
```

- Requires object M to be carried or in room; get/drop with capacity check (max 10).
- ON M-18 dispatches special logic for key, sword, bomb, rope; otherwise “How am I supposed to use it?”.

### Key (M=19, lines 141–142)
```basic
141 IF A<>2 AND A<>35 THEN  PRINT "It won't open!": GOTO 5
142 PRINT "You opened the door.":P(19)=A:R=0: IF A=2 THEN  LET A=1: GOTO 5 ELSE  LET A=37: GOTO 5
```

### Sword (M=20) Combat (143–156)
```basic
143 IF Z=0 THEN  PRINT "But there's nothing to kill...": GOTO 5
144 F=F+1: IF  RND *7+15> FLT (F) THEN 146
145 PRINT  "You swing with your sword but miss and the creature smashes your skull.": GOTO 102
146 IF  RND <.38 THEN 153
...
153 PRINT "The sword strikes home and your foe dies...":P(M)=-1:
    IF Z=3  OR  Z=5 THEN  LET P(Z)=P(Z)+10 ELSE  LET P(Z)=0:
    IF Z=1 THEN  PRINT "Hey! Your sword has just crumbled into dust!!":P(20)=35
154 IF Z<>4 THEN  PRINT \"Suddenly a black cloud descends and the corpse vaporizes into   nothing."
155 Z=0
156 GOTO 5
```

### Bomb (M=21) (157–162)
```basic
157 IF P(9)=-1 OR P(9)=A THEN 159
158 PRINT "That won't burn, Dummy...In fact, the candle went out.":C0=0: GOTO 5
159 IF C0=1 THEN 161
160 PRINT "But the candle is out, stupid!!": GOTO 5
161 PRINT "The fuse burnt away and....BOOM!!....the explosion blew you out of the way (Lucky!)":R=0: IF A>1 THEN  LET A=A-1: IF A=20 THEN  LET T=19
162 P(9)=0: GOTO 5
```

### Rope (M=22) (163–164)
```basic
163 IF A=28 THEN 164 ELSE  PRINT "It's too dangerous!!!": GOTO 5
164 PRINT "You descend the rope, but it drops 10 feet short of the floor.  You jump the rest of the way.":R=0:P(M)=A:A=35: GOTO 5
```

## 165–173: Helper and Verb Dispatch

```basic
165 RESTORE 182: FOR K=1 TO L: READ H0$,H1$: NEXT K: PRINT "a";H0$;H1$;", ";: RETURN
166 RESTORE 190: FOR O=1 TO 16: READ P0$: IF  SEARCH (A0$,P0$)>0 THEN  NEXT *O 169
...
169 ON O GOTO 131,138,139,139
170 IF O<7 THEN  PRINT "Nothing happens!"
171 IF O>6 AND O<13 THEN  PRINT "Please tell me how."
172 IF O>12 THEN  PRINT "I can't!"
173 PRINT : GOTO 79
```

- GOSUB 165 prints entity description from DATA 182.
- Verb lookup covers take/put/using/with/cut/break/unlock/open/kill/attack/light/burn/up/down/jump/swim with default responses.

## 174–181: DATA Tables

```basic
174–181  DATA ... H,T,E,W,G,D ...
182–183  DATA monster descriptions
184–187  DATA object descriptions
188      DATA initial P positions
189      DATA direction words
190–191  DATA verbs
```

- Map exits use dynamic tokens H/T/E/W/G/D that resolve to current state each movement.

## 192–198: Scoring/Ranking

```basic
192 PRINT "This gives you an adventurer's ranking of:"
193 IF S<20 THEN  PRINT "Hopeless beginner"
... up to 197 IF S=126 THEN  PRINT "Perfectionist and genius!!"
```

## 200–207: Encounter Texts

```basic
200 PRINT "There, before you in a swirling mist stands an evil wizard..."
202 PRINT "Before the entrance of the cave lies an enormous, green, sleeping dragon..."
205 PRINT "From around the corner trots an old and gnarled drawf..."
207 IF L=1 THEN 200 ELSE  IF L=4 THEN 202 ELSE  IF L=6 THEN 205 ELSE  RETURN
```

- GOSUB 207 prints these when monsters are nearby (lines 72–76).

## 208–209: Removed Machine Code Hooks

```basic
208 REM REMOVED -- DATA ...
209 REM REMOVED -- USR (62976)
```

- Original machine code hooks omitted.***
