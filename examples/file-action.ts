import { ask } from "src";

const fileAction = ask.expand("action", "Conflict on foobar.txt", {
  Overwrite: { key: "y", value: "overwrite"},
  "Overwrite(this and next": { key: "a", value: "overwrite_all" },
  "Show Diff": { key: "d", value: "diff" },
  Abort: { key: "x", value: "abort"}
});

const action = await fileAction();


console.log(action);
