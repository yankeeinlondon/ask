import type { Equal, Expect } from "@type-challenges/utils";
import type { Question } from "src";
import { normalizeChoices, service } from "src/utils";

import { describe, it } from "vitest";

describe("service()", () => {
  it("confirm", () => {
    const _confirm = service("no-requirements", "confirm", null)("confirm", "Continue?");

    type Confirm = typeof _confirm;

    // @ts-ignore
    type cases = [
      Expect<Equal<
        Confirm,
        Question<"confirm", "confirm", "Continue?", "no-requirements", null, true>
      >>,
    ];
  });

  it("select", () => {
    const _select = service(
      "no-requirements",
      "select",
      normalizeChoices(["one", "two", "three"]),
    )("quantity", "How many?");
    type Select = typeof _select;
    type Returns = Awaited<ReturnType<Select>>;

    // @ts-ignore
    type cases = [
      Expect<Equal<
        Select,
        Question<"quantity", "select", "How many?", "no-requirements", Select["choices"], true>
      >>,
      Expect<Equal<
        Returns,
        {
          [key: string]: unknown;
          quantity: "one" | "two" | "three";
        }
      >>,
    ];
  });
});
