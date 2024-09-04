import { Equal, Expect } from "@type-challenges/utils";
import { Keys } from "inferred-types";
import { AsQuestion } from "src/types";
import { describe, it } from "vitest";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to 
// gain validation that no new type vulnerabilities have cropped up.

describe("AsQuestion<TName,TType,TRequire,TPrompt,[TChoices]>", () => {

  it("input question", () => {
    type Name = AsQuestion<
      "name", 
      "input", 
      "no-requirements",
      "What's your name?"
    >;
    type NoParam = Parameters<Name>;
    

    type NameWithTitle = AsQuestion<
      "name",
      "input",
      { title: "string(Mr,Mrs,Ms)" },
      "What's your name?"
    >;
    type ReqParam = Parameters<NameWithTitle>;

    type NameWithOptTitle = AsQuestion<
      "name",
      "input",
      { title?: "string(Mr,Mrs,Ms)" },
      "What's your name?"
    >;
    type OptParam = Parameters<NameWithOptTitle>;
    
    // @ts-ignore
    type cases = [
      Expect<Equal<Name["prompt"], "What's your name?">>,
      Expect<Equal<NameWithTitle["prompt"], "What's your name?">>,

      Expect<Equal<Keys<Awaited<ReturnType<Name>>>, ["name"]>>,
      Expect<Equal<Keys<Awaited<ReturnType<NameWithTitle>>>, ["title", "name"]>>,

      Expect<Equal<Awaited<ReturnType<Name>>["name"], string>>,
      Expect<Equal<Awaited<ReturnType<NameWithTitle>>["name"], string>>,
      Expect<Equal<Awaited<ReturnType<NameWithTitle>>["title"], "Mr" | "Mrs" | "Ms">>,

      Expect<Equal<NoParam, [] | [answers?: Record<string, unknown> | undefined]>>,
      Expect<Equal<ReqParam, [ answers: {
        [key: string]: unknown;
        title: "Mr" | "Mrs" | "Ms"
      } ]>>,
      Expect<Equal<OptParam, [ 
        answers?: {
          title?: "Mr" | "Mrs" | "Ms"  | undefined,
          [key: string]: unknown
        } | undefined ]>>,
    ];
  });

  
  it("number question", () => {
    type Age  = AsQuestion<
      "age",
      "number",
      "no-requirements",
      "How old are you?"
    >;

    // @ts-ignore    
    type cases = [
      Expect<Equal<Awaited<ReturnType<Age>>["age"], number>>,
    ];
    
  });

  
  it("list question, using array to define choices", () => {
    type Color = AsQuestion<
      "color",
      "list",
      "no-requirements",
      "What is your favorite color?",
      [
        "red","blue","green"
      ]
    >;

    // @ts-ignore
    type cases = [
      Expect<Equal<Awaited<ReturnType<Color>>["color"], "red" | "blue" | "green">>,
    ];

    
  });

  it("list question, using dictionary to define choices", () => {
    type Color = AsQuestion<
      "color",
      "list",
      "no-requirements",
      "What is your favorite color?",
      {
        Red: "red",
        Blue: "blue",
        Green: "green"
      }
    >;
    
    // @ts-ignore
    type cases = [
      Expect<Equal<Awaited<ReturnType<Color>>["color"], "red" | "blue" | "green">>,
    ];

    
  });
  
  

});
