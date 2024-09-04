import { Dictionary, Scalar } from "inferred-types";
import { Choice } from "./inquirer";

/**
 * An array of Choices represented in either it's full `Choice` form
 * or just the _value_ we want to represent. This type of array can be
 * converted into an array of `Choice` types by using the 
 * `ToChoices` type util.
 */
export type ChoiceArr = readonly (string | number | boolean | null | undefined | Choice<unknown>)[];

/**
 * when using the `ChoiceDict` structure of defining choices, the typical approach is
 * to have the "key" be the `name` and the "value" be the `value` property 
 */
export type ChoiceDictTuple = [value: unknown, desc: string];

export type IsChoiceDictTuple<T> = T extends [unknown, string]
  ? true
  : false;

/**
 * A `ChoiceDict` represents a set of `Choices` as a dictionary where
 * the keys are the "names" and the values are the actual values of the
 * the individual choices.
 */
export type ChoiceDict = Record<string, Scalar | Dictionary | ChoiceDictTuple>;

export type Choices = 
| ChoiceArr
| ChoiceDict;
