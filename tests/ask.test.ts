import type { Equal, Expect, ExpectTrue } from "@type-challenges/utils";
import type { DoesExtend } from "inferred-types";
import type { Question } from "src/types";
import { ask } from "src";
import { describe, expect, it } from "vitest";

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

    type T = typeof name;
    type Param = Parameters<T>;
    type Return = Awaited<ReturnType<T>>;

    // @ts-ignore
    type cases = [
      ExpectTrue<DoesExtend<typeof name, Question>>,

      Expect<Equal<(typeof name)["kind"], "question">>,
      Expect<Equal<(typeof name)["prop"], "name">>,
      Expect<Equal<(typeof name)["type"], "input">>,
      Expect<Equal<(typeof name)["prompt"], "What is your name?">>,

      Expect<
        Equal<Param,  [answers?: Record<string, unknown> | undefined]>
      >,
      Expect<Equal<Return, { name: string; [key: string]: unknown }>>,
    ];
  });

  it("input question with requirements", () => {
    const name = ask
      .withRequirements({ title: "string(Mr.,Mrs.,Ms.)" })
      .input("name", "What is your name?");

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
    const _question = ask.select("color", "What is your favorite color?", [
      "red",
      "blue",
      "green",
    ]);

    type Param = Parameters<typeof _question>;
    type Return = Awaited<ReturnType<typeof _question>>;

    // @ts-ignore
    type cases = [
      ExpectTrue<DoesExtend<typeof _question, Question>>,

      Expect<Equal<(typeof _question)["kind"], "question">>,
      Expect<Equal<(typeof _question)["prop"], "color">>,
      Expect<Equal<(typeof _question)["type"], "select">>,
      Expect<
        Equal<(typeof _question)["prompt"], "What is your favorite color?">
      >,

      Expect<
        Equal<Param, [answers?: Record<string, unknown> | undefined]>
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
    const _question = ask.checkbox(
      "color",
      "What is your favorite color?",
      ["red", "blue", "green"],
      { default: ["blue", "red"] },
    );

    type Param = Parameters<typeof _question>;
    type Return = Awaited<ReturnType<typeof _question>>;

    // @ts-ignore
    type cases = [
      ExpectTrue<DoesExtend<typeof _question, Question>>,

      Expect<Equal<(typeof _question)["kind"], "question">>,
      Expect<Equal<(typeof _question)["prop"], "color">>,
      Expect<Equal<(typeof _question)["type"], "checkbox">>,
      Expect<
        Equal<(typeof _question)["prompt"], "What is your favorite color?">
      >,

      Expect<
        Equal<Param,  [answers?: Record<string, unknown> | undefined]>
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
