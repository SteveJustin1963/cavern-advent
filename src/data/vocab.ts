export const directionWords = [" north ", " south ", " west ", " east "];

// Primary action words (lines 190)
export const verbWordsPrimary = [
  " take ",
  " put ",
  " using ",
  " with ",
  " cut ",
  " break ",
  " unlock ",
  " open ",
  " kill ",
  " attack ",
];

// Secondary verbs (lines 191)
export const verbWordsSecondary = [
  " light ",
  " burn ",
  " up ",
  " down ",
  " jump ",
  " swim ",
];

// One-based combined verb list to match BASIC offsets
export const verbWords = [null, ...verbWordsPrimary, ...verbWordsSecondary];
