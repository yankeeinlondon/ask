import type { Equal, Expect, ExpectTrue } from "@type-challenges/utils";
import type { HasRequiredReqs, QuestionParams } from "src/types";
import { describe, it } from "vitest";

describe("questionParams<TReq>", () => {
  it("happy path", () => {
    type NoReq = QuestionParams<"no-requirements">;
    type OptReq = QuestionParams<{
      age?: "number";
    }>;
    type Req = QuestionParams<{
      age: "number";
    }>;
    type Has = HasRequiredReqs<{
      age: "number";
    }>;

    // @ts-ignore
    type cases = [
      Expect<
        Equal<NoReq, [answers?: Record<string, unknown> | undefined] | []>
      >,
      Expect<
        Equal<
          OptReq,
          [
            answers?:
              | {
                [x: string]: unknown;
                age?: number | undefined;
              }
              | undefined,
          ]
        >
      >,
      ExpectTrue<HasRequiredReqs<Has>>,

      Expect<
        Equal<
          Req,
          [
            answers: {
              [x: string]: unknown;
              age: number;
            },
          ]
        >
      >,
    ];
  });
});

describe("asQuestion<TName,TType,TRequire,TPrompt,[TChoices]>", () => {
  it("input question", () => {
    type NoReq = QuestionParams<"no-requirements">;
    type OptReq = QuestionParams<{
      age?: "number";
    }>;
    type Req = QuestionParams<{
      age: "number";
    }>;

    // @ts-ignore
    type cases = [
      Expect<
        Equal<NoReq, [answers?: Record<string, unknown> | undefined] | []>
      >,
      Expect<
        Equal<
          OptReq,
          [
            answers?:
              | {
                [x: string]: unknown;
                age?: number | undefined;
              }
              | undefined,
          ]
        >
      >,
      Expect<
        Equal<
          Req,
          [
            answers: {
              [x: string]: unknown;
              age: number;
            },
          ]
        >
      >,
    ];
  });
});
