import { isArray, isNumber, isObject, isString, Never } from "inferred-types";
import { Choice, ChoiceDict, Choices, ToChoices } from "src/types";

const isChoice = (val: unknown): val is Choice => {
  return isObject(val) && "value" in val;
}

const isChoiceDict = (val: unknown): val is ChoiceDict => {
  return isObject(val)
}

const fromChoiceDict = (v: ChoiceDict) => {
  return Object.keys(v).map(key => ({
    type: "choice",
    name: String(key),
    value: v[key]
  })) as Choice[]
}

/**
 * converts all the representations of choices
 * to an array of `Choice`'s. The defaults property
 * is also provided optionally for "checkbox" so that
 * the `default` property can be used to indicate which
 * choices are selected initially.
 */
export const normalizeChoices = <
  TChoice extends Choices,
  TChecked extends unknown[]
>(
  choices: TChoice,
  checked?: TChecked
) => {
  const result = (
    isArray(choices) 
    ? choices.flatMap(i => isString(i) || isNumber(i)
      ? { type: "choice", name: String(i), value: i } as Choice
      : isChoice(i) ? i
      : isChoiceDict(i) ? fromChoiceDict(i)
      : Never
    )
    : isChoiceDict(choices) ? fromChoiceDict(choices)
    : Never
  ) as unknown as any[];

  return (
    checked 
    ? result.map(i => checked.includes(i.value) ? {...i, checked: true} : i)
    : result
  ) as ToChoices<TChoice>
}
