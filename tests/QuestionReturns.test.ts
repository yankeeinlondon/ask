import type { Equal, Expect } from "@type-challenges/utils";
import type { QuestionReturns } from "src/types";
import { ask } from "src";
import { describe, it } from "vitest";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to
// gain validation that no new type vulnerabilities have cropped up.

describe("questionReturns<Name,Type,Require,[Choices]>", () => {
  it("using text input", () => {
    type Name = QuestionReturns<"name", "input", "no-requirements">;
    type NameWithTitle = QuestionReturns<
      "name",
      "input",
      {
        title: "string(Mr,Mrs,Ms)";
      }
    >;

    // @ts-ignore
    type cases = [
      Expect<Equal<Name, { name: string; [key: string]: unknown }>>,
      Expect<Equal<
        NameWithTitle,
        { name: string; title: "Mr" | "Mrs" | "Ms"; [key: string]: unknown }
      >>,
    ];
  });

  it("using select question", () => {
    type Color = QuestionReturns<
      "color",
      "select",
      "no-requirements",
      ["red", "blue", "green"]
    >;
    type Color2 = QuestionReturns<
      "color",
      "select",
      "no-requirements",
      {
        Red: "red";
        Green: "green";
        Blue: "blue";
      }
    >;

    const _color = ask.select("color", "What's your favorite color?", [
      "red",
      "blue",
      "green",
    ]);

    type C1 = Awaited<ReturnType<typeof _color>>;

    const _color2 = ask.select("color", "What's your favorite color?", {
      Red: "red",
      Blue: "blue",
      Green: "green",
    });

    type C2 = Awaited<ReturnType<typeof _color2>>;

    // @ts-ignore
    type cases = [
      Expect<
        Equal<
          Color,
          {
            [x: string]: unknown;
            color: "red" | "blue" | "green";
          }
        >
      >,
      Expect<
        Equal<
          Color2,
          {
            [x: string]: unknown;
            color: "red" | "blue" | "green";
          }
        >
      >,

      Expect<
        Equal<
          C1,
          {
            [x: string]: unknown;
            color: "red" | "blue" | "green";
          }
        >
      >,
      Expect<
        Equal<
          C2,
          {
            [x: string]: unknown;
            color: "red" | "blue" | "green";
          }
        >
      >,
    ];
  });

  it("using checkbox question", () => {
    type Color = QuestionReturns<
      "color",
      "checkbox",
      "no-requirements",
      ["red", "blue", "green"]
    >;

    // @ts-ignore
    type cases = [
      Expect<Equal<
        Color, //
        { color: ("red" | "blue" | "green")[]; [key: string]: unknown }
      >>,
    ];
  });
});
