import { Equal, Expect } from "@type-challenges/utils";
import { EmptyObject } from "inferred-types";
import { FromRequirements } from "src/types";
import { describe, it } from "vitest";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to 
// gain validation that no new type vulnerabilities have cropped up.

describe("FromRequirements<T>", () => {

  it("happy path", () => {
    type None = FromRequirements<"no-requirements">;
    type Empty = FromRequirements<EmptyObject>;
    type Wide = FromRequirements<{ foo: "string"; bar: "number" }>;
    
    type cases = [
      Expect<Equal<None, EmptyObject>>,
      Expect<Equal<Empty, EmptyObject>>,
      Expect<Equal<Wide, { foo: string; bar: number }>>
    ];
    const cases: cases = [
      true, true, true
    ];
  });

});
