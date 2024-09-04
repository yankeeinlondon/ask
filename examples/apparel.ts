import { ask } from "src/index";


const question = ask.checkbox(
  "apparel", 
  "What type of clothes are you interested in?", 
  {
    Shoes: "shoes",
    Shirts: "shirts",
    Sweaters: "sweaters",
    Hats: "hats"
  },
  {default: ["shoes","hats"]}
);


const answer = await question();

console.log(answer);


