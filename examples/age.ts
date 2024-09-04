import { ask } from "src/index";


const question = ask.number("age", "How old are you?", {min: 1, max: 150});

console.log(question)

const answer = await question({});

console.log(answer);


