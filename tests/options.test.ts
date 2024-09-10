import { Equal, Expect } from "@type-challenges/utils";
import { QuestionOption } from "src/types/options";
import { ToChoices } from "src/types/utility";
import { describe, it } from "vitest";

describe("Question Options", () => {
  it("select options", () => {
    type O = QuestionOption<
      "select",
      "no-requirements",
      ToChoices<["red", "blue", "green"]>
    >;
    type ODefault = O["default"];

    // @ts-ignore
    type cases = [
      Expect<Equal<ODefault, "red" | "blue" | "green" | undefined>>, //
    ];
  });

  it("select options with requirements", () => {
    type O = QuestionOption<
      "select",
      { prior: "string(red,blue,green)" },
      ToChoices<["red", "blue", "green"]>
    >;
    type ODefault = O["default"];

    // @ts-ignore
    type cases = [
      Expect<
        Equal<
          ODefault, //
          | "red"
          | "blue"
          | "green"
          | (<T extends { prior: "red" | "blue" | "green" }>(
              answers: T,
            ) => "red" | "blue" | "green" | undefined)
          | undefined
        >
      >, //
    ];
  });

  it("checkbox options", () => {
    type O = QuestionOption<
      "checkbox",
      "no-requirements",
      ToChoices<["red", "blue", "green"]>
    >;
    type ODefault = O["default"];

    // @ts-ignore
    type cases = [
      Expect<Equal<ODefault, ("red" | "blue" | "green")[] | undefined>>, //
    ];
  });

  it("checkbox options with requirements", () => {
    type O = QuestionOption<
      "checkbox",
      { prior: "string(red,green,blue)" },
      ToChoices<["red", "blue", "green"]>
    >;
    type ODefault = O["default"];

    // @ts-ignore
    type cases = [
      Expect<
        Equal<
          ODefault, //
          | ("red" | "blue" | "green")[]
          | (<
              T extends {
                prior: "red" | "blue" | "green";
              },
            >(
              answers: T,
            ) => ("red" | "blue" | "green")[] | undefined)
          | undefined
        >
      >, //
    ];
  });
});
