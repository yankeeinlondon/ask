import { ask } from "src/index";


const question = ask.select(
  "color", 
  "What is your favorite color?", 
  ["red","blue","green"]
);

const answer = await question();

console.log(answer);
