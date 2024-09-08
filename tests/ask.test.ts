import { Equal, Expect, ExpectTrue } from "@type-challenges/utils";
import { describe, expect, it } from "vitest";
import { ask, survey } from "src";
import { DoesExtend } from "inferred-types";
import { Question } from "src/types";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to
// gain validation that no new type vulnerabilities have cropped up.

describe("ask API", () => {
  it("simple input, no requirements", () => {
    const name = ask.input("name", "What is your name?");

    expect(typeof name).toBe("function");
    expect(name.prop).toBe("name");
    expect(name.type).toBe("input");
    expect(name.prompt).toBe("What is your name?");

    type Param = Parameters<typeof name>;
    type Return = Awaited<ReturnType<typeof name>>;

    // @ts-ignore
    type cases = [
      ExpectTrue<DoesExtend<typeof name, Question>>,

      Expect<Equal<(typeof name)["kind"], "question">>,
      Expect<Equal<(typeof name)["prop"], "name">>,
      Expect<Equal<(typeof name)["type"], "input">>,
      Expect<Equal<(typeof name)["prompt"], "What is your name?">>,

      Expect<
        Equal<Param, [] | [answers?: Record<string, unknown> | undefined]>
      >,
      Expect<Equal<Return, { name: string; [key: string]: unknown }>>,
    ];
  });

  it("input question with requirements", () => {
    const name = ask
      .withRequirements({ title: "string(Mr.,Mrs.,Ms.)" })
      .input("name", "What is your name?");
    survey;

    expect(typeof name).toBe("function");
    expect(name.prop).toBe("name");
    expect(name.type).toBe("input");
    expect(name.prompt).toBe("What is your name?");

    type Param = Parameters<typeof name>;
    type Return = Awaited<ReturnType<typeof name>>;
    // @ts-ignore
    type cases = [
      Expect<
        Equal<
          Param, //
          [answers: { [key: string]: unknown; title: "Mr." | "Mrs." | "Ms." }]
        >
      >,
      Expect<
        Equal<
          Return,
          {
            name: string;
            [key: string]: unknown;
            title: "Mr." | "Mrs." | "Ms.";
          }
        >
      >,
    ];
  });

  it("select question, no requirements", () => {
    const question = ask.select("color", "What is your favorite color?", [
      "red",
      "blue",
      "green",
    ]);

    type Param = Parameters<typeof question>;
    type Return = Awaited<ReturnType<typeof question>>;

    // @ts-ignore
    type cases = [
      ExpectTrue<DoesExtend<typeof question, Question>>,

      Expect<Equal<(typeof question)["kind"], "question">>,
      Expect<Equal<(typeof question)["prop"], "color">>,
      Expect<Equal<(typeof question)["type"], "select">>,
      Expect<
        Equal<(typeof question)["prompt"], "What is your favorite color?">
      >,

      Expect<
        Equal<Param, [] | [answers?: Record<string, unknown> | undefined]>
      >,
      Expect<
        Equal<
          Return,
          { color: "red" | "green" | "blue"; [key: string]: unknown }
        >
      >,
    ];
  });

  it("checkbox question, no requirements", () => {
    const question = ask.checkbox("color", "What is your favorite color?", [
      "red",
      "blue",
      "green",
    ]);

    type Param = Parameters<typeof question>;
    type Return = Awaited<ReturnType<typeof question>>;

    // @ts-ignore
    type cases = [
      ExpectTrue<DoesExtend<typeof question, Question>>,

      Expect<Equal<(typeof question)["kind"], "question">>,
      Expect<Equal<(typeof question)["prop"], "color">>,
      Expect<Equal<(typeof question)["type"], "checkbox">>,
      Expect<
        Equal<(typeof question)["prompt"], "What is your favorite color?">
      >,

      Expect<
        Equal<Param, [] | [answers?: Record<string, unknown> | undefined]>
      >,
      Expect<
        Equal<
          Return,
          { color: ("red" | "green" | "blue")[]; [key: string]: unknown }
        >
      >,
    ];
  });
});
