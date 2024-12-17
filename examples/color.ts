import { ask } from "src/index";

const question = ask.select(
  "color",
  "What is your favorite color?",
  ["red", "blue", "green"],
);

const answer = await question();
console.log(answer);

console.log (`Now we'll ask with .ask() variant`);
const askAnswer = await question.ask();

console.log(askAnswer);

