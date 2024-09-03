import {  Expect, ExpectTrue } from "@type-challenges/utils";
import { HasSameValues } from "inferred-types";
import { ToChoices } from "src/types";
import { describe, it } from "vitest";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to 
// gain validation that no new type vulnerabilities have cropped up.

describe("ToChoices<T>", () => {

  it("array of scalars", () => {
    type FooBar = ToChoices<["foo", "bar"]>;
    
    // @ts-ignore
    type cases = [
      ExpectTrue<
        HasSameValues<FooBar, [
          {type: "choice", name: "foo", value: "foo"},
          {type: "choice", name: "bar", value: "bar"},
        ]>
      >
    ];
    
  });

  it("mixed array of scalars and choices", () => {
    type FooBar = ToChoices<["foo", { type: "choice"; name: "Bar"; value: "bar"}]>;
    
    // @ts-ignore
    type cases = [
      Expect<
        HasSameValues<FooBar, [
          {type: "choice", name: "foo", value: "foo"},
          {type: "choice", name: "Bar", value: "bar"},
        ]>
      >
    ];
  });

  it("choices from a ChoiceDict", () => {
    type FooBar = ToChoices<{
      Foo: "foo";
      Bar: "bar";
    }>;
    
    // @ts-ignore
    type cases = [
      Expect<
        HasSameValues<FooBar, [
          {type: "choice", name: "Foo", value: "foo"},
          {type: "choice", name: "Bar", value: "bar"},
        ]>
      >
    ];
    
  });
  

});
