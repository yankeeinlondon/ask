import { ask } from "src/index";


const question = ask.checkbox(
  "apparel", 
  "What type of clothes are you interested in?", 
  {
    Hats: "hats",
    Shoes: "shoes",
    Slinkeys: { value: "slinkeys", disabled: "none in stock" },
    Shirts: "shirts",
    Sweaters: "sweaters",
  },
  {default: ["shoes","hats"]}
);


const answer = await question();

console.log(answer);


