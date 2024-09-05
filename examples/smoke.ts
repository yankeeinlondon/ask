import { ask } from "src/index";


const question = ask
  .withRequirements({age: "number"})
  .confirm(
  "smoke", 
  "Do you smoke?", 
  {default: false}
);

console.log(question.prompt, question.prop)

const answer = await question({age: 65});

console.log(answer);


