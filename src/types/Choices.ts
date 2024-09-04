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
 * when using the `ChoiceDict` structure of defining choices, the typical 
 * approach is to have the "key" be the `name` and the "value" be the 
 * `value` property 
 */
export type ChoiceDictTuple = [value: unknown, desc: string];

/**
 * Type util which returns `true`/`false` indicating whether `T`
 * is a `ChoiceDictTuple`
 */
export type IsChoiceDictTuple<T> = T extends [unknown, string]
  ? true
  : false;

export type IsChoiceDictProxy<T> = T extends { value: unknown; [key: string]: unknown }
? "name" extends keyof T
  ? false
  : true
: false;

/**
 * A `ChoiceDict` represents a set of `Choices` as a dictionary where
 * the keys are the "names" and the values are the actual values of the
 * the individual choices.
 */
export type ChoiceDict = Record<string, Scalar | Dictionary | ChoiceDictTuple>;


/**
 * When parsing a `ChoiceDict` key/value passed in, if the value looks
 * like a `Choice` -- but doesn't need the static "type", and doesn't
 * have the `name` property (which is represented by the _key_ of a ChoiceDict)
 * -- then it's definition will be preserved and the missing `type` and `name`
 * properties added so it's a full fledged `Choice`
 */
export type ChoiceDictProxy = Omit<Choice, "type" | "name">;


/**
 * A set of choices defined by either a `ChoiceArr` or `ChoiceDict`
 */
export type Choices = 
| ChoiceArr
| ChoiceDict;
