import { Expect } from "@type-challenges/utils";
import { HasSameValues } from "inferred-types";
import { ToChoiceValues } from "src/types";
import { describe, it } from "vitest";

describe("ToChoiceValues<T>", () => {
  it("happy path", () => {
    type Color = ToChoiceValues<["red", "green", "blue"]>;
    type C2 = ToChoiceValues<{
      Red: "red";
      Green: "green";
      Blue: "blue";
    }>;

    // @ts-ignore
    type cases = [
      Expect<HasSameValues<Color, ["red", "green", "blue"]>>, //
      Expect<HasSameValues<C2, ["red", "green", "blue"]>>, //
    ];
  });
});
