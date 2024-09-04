import { Equal, Expect } from "@type-challenges/utils";
import {  QuestionParams } from "src/types";
import { describe, it } from "vitest";

describe("AsQuestion<TName,TType,TRequire,TPrompt,[TChoices]>", () => {

  it("input question", () => {
    type NoReq =  QuestionParams<"no-requirements">;
    type OptReq = QuestionParams<{
      age?: "number";
    }>;
    type Req = QuestionParams<{
      age: "number";
    }>;

    // @ts-ignore
    type cases = [
      Expect<Equal<NoReq, [answers?: Record<string, unknown> | undefined] | []>>,
      Expect<Equal<OptReq, [
        answers?: {
          [x: string]: unknown;
          age?: number | undefined;
        } | undefined]
      >>,
      Expect<Equal<Req, [
        answers: {
          [x: string]: unknown;
          age: number;
        }]
      >>,
      
    ];


  });



});
