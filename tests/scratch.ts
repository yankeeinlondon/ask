import { ask, survey } from "src";

const remove = ask.select("remove", `What action would you like to take:`, [
  "keep all",
  "remove all",
  "remove selected",
]);

const which = ask.checkbox(
  "which",
  "Choose which to delete",
  ["foo", "bar", "baz"],
  {
    when: (v: any) => {
      return v.remove === "remove selected";
    },
  },
);

const results = await survey(remove, which).start();

console.log(results);
