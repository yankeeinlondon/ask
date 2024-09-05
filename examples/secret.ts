import { ask } from "src/index";


const question = ask.password("secret", "Ssh; what's your secret?", {
  default: "i-have-no-secrets",
  mask: true,
  required: true
});
const answer = await question();

console.log(answer);
