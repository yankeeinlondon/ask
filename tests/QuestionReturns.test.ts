import type { Equal, Expect } from "@type-challenges/utils";
import type { EmptyObject } from "inferred-types";
import type { QuestionReturns, ToChoices } from "src/types";
import { ask } from "src";
import { describe, it } from "vitest";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to
// gain validation that no new type vulnerabilities have cropped up.

describe("questionReturns<Name,Type,Require,[Choices]>", () => {
  it("using text input", () => {
    type Name = QuestionReturns<
      "name",
      "input",
      EmptyObject,
      null
    >;

    type NameWithTitle = QuestionReturns<
      "name",
      "input",
      {
        title: "Mr" | "Mrs" | "Ms";
      },
      null
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
      EmptyObject,
      ToChoices<["red", "blue", "green"]>
    >;
    type Color2 = QuestionReturns<
      "color",
      "select",
      EmptyObject,
      ToChoices<{
        Red: "red";
        Green: "green";
        Blue: "blue";
      }>
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
    type Choices = ToChoices<["red", "blue", "green"]>;
    type Color = QuestionReturns<
      "color",
      "checkbox",
      EmptyObject,
      Choices
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
