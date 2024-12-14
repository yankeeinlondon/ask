import type { Equal, Expect, ExpectTrue } from "@type-challenges/utils";
import type { HasSameValues } from "inferred-types";
import type { DoesExtend } from "inferred-types/types";
import type {
  Choice,
  ChoiceArr,
  ChoiceDict,
  ChoiceElement,
  Choices,
  ChoicesCallback,
  ToChoices,
} from "src/types";
import { describe, it } from "vitest";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to
// gain validation that no new type vulnerabilities have cropped up.

describe("toChoices<T>", () => {
  it("edge cases", () => {
    type Opt1 = (readonly ChoiceElement[]) | ChoiceDict;

    type All = ToChoices<Choices>;
    type NotNull = ToChoices<ChoiceDict | ChoiceArr>;
    type Callback = ToChoices<ChoicesCallback>;
    type Wide = ToChoices<Opt1>;
    type Null = ToChoices<null>;

    type Narrow<
      TChoices extends Choices<K, N>,
      K extends string,
      N extends ChoiceElement,
    > = ToChoices<TChoices>;

    type N1 = Narrow<[1, 2, 3], "1" | "2" | "3", 1 | 2 | 3>;

    // @ts-ignore
    type cases = [
      Expect<Equal<All, Choice[]>>,
      Expect<Equal<NotNull, Choice[]>>,
      Expect<Equal<Callback, Choice[]>>,
      Expect<Equal<Wide, Choice[]>>,
      Expect<Equal<Null, null>>,

      Expect<DoesExtend<N1, Choice[]>>,
    ];
  });

  it("array of scalars", () => {
    type FooBar = ToChoices<["foo", "bar"]>;

    // @ts-ignore
    type cases = [
      ExpectTrue<
        HasSameValues<
          FooBar,
          [
            { type: "choice"; name: "foo"; value: "foo" },
            { type: "choice"; name: "bar"; value: "bar" },
          ]
        >
      >,
    ];
  });

  it("mixed array of scalars and choices", () => {
    type FooBar = ToChoices<
      [
        "foo",
        { type: "choice"; name: "Bar"; value: "bar" }, // actual Choice
      ]
    >;

    // @ts-ignore
    type cases = [
      Expect<
        HasSameValues<
          FooBar,
          [
            { type: "choice"; name: "foo"; value: "foo" },
            { type: "choice"; name: "Bar"; value: "bar" },
          ]
        >
      >,
    ];
  });

  it("choices from a ChoiceDict", () => {
    type FooBarBaz = ToChoices<{
      Foo: "foo";
      Bar: "bar";
      Baz: { value: "baz"; undefined: "never mind" };
    }>;

    // @ts-ignore
    type cases = [
      Expect<
        HasSameValues<
          FooBarBaz,
          [
            { type: "choice"; name: "Foo"; value: "foo" },
            { type: "choice"; name: "Bar"; value: "bar" },
            {
              type: "choice";
              name: "Baz";
              value: "baz";
              disabled: "never mind";
            },
          ]
        >
      >,
    ];
  });

  it("configuring choices with a DictProxy object", () => {
    type FileAction = ToChoices<{
      Abort: { key: "a"; value: "abort" };
      Overwrite: { key: "o"; value: "overwrite" };
      Skip: { key: "s"; value: "skip" };
    }>;

    // @ts-ignore
    type cases = [
      Expect<
        HasSameValues<
          FileAction,
          [
            { type: "choice"; name: "Abort"; value: "abort"; key: "a" },
            { type: "choice"; name: "Overwrite"; value: "overwrite"; key: "o" },
            { type: "choice"; name: "Skip"; value: "skip"; key: "s" },
          ]
        >
      >,
    ];
  });
});
