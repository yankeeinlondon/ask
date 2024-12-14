import type { Choice, ChoiceDict, ChoiceElement, Choices, Shazam } from "src/types";
import {
  isArray,
  isFunction,
  isNumber,
  isObject,
  isString,
  Never,
} from "inferred-types";
import { isChoiceDictProxy } from "src/type-guards/isChoiceDIctProxy";

function isChoice(val: unknown): val is Choice {
  return isObject(val) && "value" in val;
}

function isChoiceDict(val: unknown): val is ChoiceDict {
  return isObject(val);
}

function fromChoiceDict(v: ChoiceDict) {
  return Object.keys(v).map(key =>
    isChoiceDictProxy(v[key])
      ? {
          type: "choice",
          name: String(key),
          ...v[key],
        }
      : {
          type: "choice",
          name: String(key),
          value: v[key],
        },
  ) as Choice[];
}

/**
 * converts all the representations of choices
 * to an array of `Choice`'s. The defaults property
 * is also provided optionally for "checkbox" so that
 * the `default` property can be used to indicate which
 * choices are selected initially.
 */
export function normalizeChoices<
  TChoices extends Choices<K, N>,
  TChecked extends unknown[],
  K extends string,
  N extends ChoiceElement,
>(choices: TChoices, checked?: TChecked) {
  const result = (
    isArray(choices)
      ? choices.flatMap(i =>
          isString(i) || isNumber(i)
            ? ({ type: "choice", name: String(i), value: i } as Choice)
            : isChoice(i)
              ? i
              : isChoiceDict(i)
                ? fromChoiceDict(i)
                : isFunction(i) ? i : Never,
        )
      : isChoiceDict(choices)
        ? fromChoiceDict(choices)
        : Never
  ) as unknown as Choice[];

  return (
    checked
      ? result.map(i =>
          checked.includes(i?.value) ? { ...i, checked: true } : i,
        )
      : result
  ) as unknown as Shazam<TChoices>;
}
