import { ask } from "src/index";


const question = ask.input("name", "What is your name?", {
  default: "Bob",
  required: true
});


console.log(question.prompt, question.prop)

const answer = await question();

console.log(answer);


