import { ask } from "src/index";


const question = ask.number("age", "How old are you?", {
  min: 1, 
  max: 150,
  default: 42,
  required: true
});

const answer = await question();

console.log(answer);
