import { Equal, Expect } from "@type-challenges/utils";
import { QuestionReturns } from "src/types";
import { describe, it } from "vitest";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to 
// gain validation that no new type vulnerabilities have cropped up.

describe("QuestionReturns<Name,Type,Require,[Choices]>", () => {

  it("first test", () => {
    type Name = QuestionReturns<
      "name", "input", "no-requirements"
    >;
    type NameWithTitle = QuestionReturns<"name", "input", {
      title: "string(Mr,Mrs,Ms)"
    }>;
    
    type cases = [
      Expect<Equal<Name, { name: string; [key: string ]: unknown }>>,
      Expect<Equal<NameWithTitle, { name: string; title: "Mr" | "Mrs" | "Ms"; [key: string ]: unknown }>>,
    ];
    const cases: cases = [
      true, true
    ];
  });

});
