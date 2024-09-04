import { Equal, Expect, ExpectTrue } from "@type-challenges/utils";
import { describe, expect, it } from "vitest";
import { ask } from "src";
import { DoesExtend } from "inferred-types";
import { Question } from "src/types";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to 
// gain validation that no new type vulnerabilities have cropped up.

describe("ask API", () => {

  it("simple input, no requirements", () => {
    const name = ask.input("name", "What is your name?");

    expect(typeof name).toBe("function");
    expect(name.name).toBe("name");
    expect(name.type).toBe("input");
    expect(name.prompt).toBe("What is your name?");

    type Param = Parameters<typeof name>;
    type Return = Awaited<ReturnType<typeof name>>;
    
    // @ts-ignore
    type cases = [
      ExpectTrue<DoesExtend<typeof name, Question>>,

      Expect<Equal<typeof name["kind"], "question">>,
      Expect<Equal<typeof name["name"], "name">>,
      Expect<Equal<typeof name["type"], "input">>,
      Expect<Equal<typeof name["prompt"], "What is your name?">>,

      Expect<Equal<Param, [] | [answers?: Record<string, unknown> | undefined]>>,
      Expect<Equal<Return, { name: string; [key: string|symbol]: unknown }>>,
    ];
  });

});
