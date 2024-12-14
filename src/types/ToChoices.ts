import type {
  AfterFirst,
  As,
  AsString,
  ChoiceCallback,
  FilterProps,
  First,
  IsOptionalScalar,
  IsWideContainer,
  Keys,
} from "inferred-types";
import type {
  Choice,
  ChoiceDict,
  ChoiceDictProxy,
  ChoiceDictTuple,
  ChoiceElement,
  Choices,
  ChoicesCallback,
  IsChoiceDictProxy,
} from "./Choice";

type FromDictToChoices<
  TObj extends ChoiceDict,
  TKeys extends readonly string[],
  TChoices extends readonly Choice[] = [],
> = [] extends TKeys
  ? TChoices
  : FromDictToChoices<
    TObj,
    AfterFirst<TKeys>,
    [
      ...TChoices,
      First<TKeys> extends keyof TObj
        ? TObj[First<TKeys>] extends ChoiceDictTuple
          ? {
              type: "choice";
              name: First<TKeys>;
              value: TObj[First<TKeys>][0];
              description: TObj[First<TKeys>][1];
            } // was a ChoiceDictTuple
          : IsChoiceDictProxy<TObj[First<TKeys>]> extends true
            ? As<
              FilterProps<
                {
                  type: "choice";
                  name: First<TKeys>;
                  value: As<TObj[First<TKeys>], ChoiceDictProxy>["value"];
                  checked: As<
                    TObj[First<TKeys>],
                    ChoiceDictProxy
                  >["checked"];
                  disabled: As<
                    TObj[First<TKeys>],
                    ChoiceDictProxy
                  >["disabled"];
                  short: As<TObj[First<TKeys>], ChoiceDictProxy>["short"];
                  key: As<TObj[First<TKeys>], ChoiceDictProxy>["key"];
                  description: As<
                    TObj[First<TKeys>],
                    ChoiceDictProxy
                  >["description"];
                },
                unknown,
                "equals"
              >,
              Choice
            >
            : {
                type: "choice";
                name: First<TKeys>;
                value: TObj[First<TKeys>];
              } extends Choice
                ? {
                    type: "choice";
                    name: First<TKeys>;
                    value: TObj[First<TKeys>];
                  }
                : never
        : never,
    ]
  >;

type FromChoicesArr<T extends Choices> = {
  [K in keyof T]: IsOptionalScalar<T[K]> extends true
    ? { type: "choice"; name: `${AsString<T[K]>}`; value: T[K] }
    : T[K] extends Choice
      ? T[K]
      : T[K] extends ChoiceDict
        ? FromDictToChoices<T[K], As<Keys<T[K]>, readonly string[]>>
        : T[K] extends ChoiceCallback
          ? ReturnType<T[K]>
          : never;
};

/**
 * Converts all the possible representations of _choices_ into a tuple of
 * `Choice` objects
 */
export type ToChoices<T extends Choices | null> = T extends null
  ? null
  : T extends ChoicesCallback
    ? ReturnType<T>
    : IsWideContainer<T> extends true
      ? Choice[]
      : T extends readonly ChoiceElement[]
        ? FromChoicesArr<T>
        : T extends ChoiceDict<string, ChoiceElement>
          ? FromDictToChoices<T, As<Keys<T>, readonly string[]> >
          : never;
