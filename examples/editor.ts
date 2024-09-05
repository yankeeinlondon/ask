import { ask } from "src";

const edit = ask.editor("edit", "Tell me how you're feeling");

const feeling = await edit();

console.log(feeling);
