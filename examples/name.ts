import { ask } from "src/index";


const question = ask.input("name", "What is your name?", {default: "Bob"});

console.log(question.prompt)

const answer = await question();

console.log(answer);


