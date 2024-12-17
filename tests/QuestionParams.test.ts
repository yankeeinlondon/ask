import type { Equal, Expect, ExpectTrue } from "@type-challenges/utils";
import type { EmptyObject, HasRequiredProps } from "inferred-types";
import type { QuestionParams } from "src/types";
import { describe, it } from "vitest";

describe("questionParams<TReq>", () => {
  it("happy path", () => {
    type NoReq = QuestionParams<EmptyObject>;
    type OptReq = QuestionParams<{
      age?: number;
    }>;
    type Req = QuestionParams<{
      age: number;
    }>;
    type Has = HasRequiredProps<{
      age: number;
    }>;

    // @ts-ignore
    type cases = [
      Expect<
        Equal<NoReq, [answers?: Record<string, unknown> | undefined] >
      >,
      Expect<
        Equal<
          OptReq,
          [
            answers?:
              {
                [x: string]: unknown;
                age?: number | undefined;
              } | undefined,
          ]
        >
      >,
      ExpectTrue<Has>,

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
    type NoReq = QuestionParams<EmptyObject>;
    type OptReq = QuestionParams<{
      age?: number;
    }>;
    type Req = QuestionParams<{
      age: number;
    }>;

    // @ts-ignore
    type cases = [
      Expect<
        Equal<NoReq, [answers?: Record<string, unknown> | undefined] >
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
