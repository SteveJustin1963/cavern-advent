import readline from "readline";
import { createEngine, handleInput, look } from "./state";

const state = createEngine();

console.log(look(state).join("\n"));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function loop(): void {
  rl.question("> ", (answer) => {
    const { output, state: current } = handleInput(state, answer);
    output.forEach((line) => console.log(line));
    if (!current.alive) {
      rl.close();
      return;
    }
    loop();
  });
}

loop();
