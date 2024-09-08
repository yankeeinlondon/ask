import { Equal, Expect } from "@type-challenges/utils";
import { describe, it } from "vitest";

import { ChoicesOutput, ToChoices } from "src/types";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to
// gain validation that no new type vulnerabilities have cropped up.

describe("ChoiceOutput<T>", () => {
  it("select test", () => {
    type C1 = ToChoices<["red", "blue", "green"]>;
    type O1 = ChoicesOutput<C1, "select">;
    type C2 = ToChoices<{
      Red: "red";
      Blue: "blue";
      Green: "green";
    }>;
    type O2 = ChoicesOutput<C2, "select">;

    type C3 = ToChoices<{
      One: 1;
      Two: 2;
      Three: 3;
    }>;
    type O3 = ChoicesOutput<C3, "select">;

    type C4 = ToChoices<{
      One: [1, "just a single one"];
      Two: [2, "a duo of two"];
      Three: [3, "a trifecta of three"];
    }>;

    type O4 = ChoicesOutput<C4, "select">;
    // @ts-ignore
    type cases = [
      Expect<Equal<O1, "red" | "blue" | "green">>,
      Expect<Equal<O2, "red" | "blue" | "green">>,
      Expect<Equal<O3, 1 | 2 | 3>>,
      Expect<Equal<O4, 1 | 2 | 3>>,
    ];
  });

  it("checkbox test", () => {
    type C1 = ToChoices<["red", "blue", "green"]>;
    type O1 = ChoicesOutput<C1, "checkbox">;
    type C2 = ToChoices<{
      Red: "red";
      Blue: "blue";
      Green: "green";
    }>;
    type O2 = ChoicesOutput<C2, "checkbox">;

    type C3 = ToChoices<{
      One: 1;
      Two: 2;
      Three: 3;
    }>;
    type O3 = ChoicesOutput<C3, "checkbox">;

    type C4 = ToChoices<{
      One: [1, "just a single one"];
      Two: [2, "a duo of two"];
      Three: [3, "a trifecta of three"];
    }>;

    type O4 = ChoicesOutput<C4, "checkbox">;
    // @ts-ignore
    type cases = [
      Expect<Equal<O1, ("red" | "blue" | "green")[]>>,
      Expect<Equal<O2, ("red" | "blue" | "green")[]>>,
      Expect<Equal<O3, (1 | 2 | 3)[]>>,
      Expect<Equal<O4, (1 | 2 | 3)[]>>,
    ];
  });
});
