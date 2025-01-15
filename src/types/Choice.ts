import type { AlphaNumericChar, SpecialChar } from "inferred-types";
import type { Answers } from "inquirer";

/**
 * A fully qualified definition of a choice
 */
export interface Choice {
  type: "choice";
  /**
   * the actual _value_ which the question will be set to if this choice is selected
   */
  value: any;
  name: string;
  description?: string;
  /**
   * Used in the `checkbox` type to indicate the initial state
   */
  checked?: boolean;
  /**
   * Once the prompt is done (press enter), we'll use `short` if defined to
   * render next to the question. By default we'll use `name`.
   */
  short?: string;
  /**
   * Disallow the option from being selected. If disabled is a string, it'll
   * be used as a help tip explaining why the choice isn't available.
   */
  disabled?: boolean | string;

  /**
   * used in the `expand` command to map a key value which maps to a given
   * choice / action.
   */
  key?: `${AlphaNumericChar | SpecialChar}`;
}

/**
 * An individual _choice_ can defer it's definition until the incoming
 * answers array is made available.
 */
export type ChoiceCallback = (cb: Answers) => Exclude<ChoiceElement, ChoiceCallback>;

/**
 * All choices can be deferred until the `Answers` dictionary is
 * provided for context. Note: this probably only makes sense for
 * questions which have expressed a requirement/dependency.
 */
export type ChoicesCallback = (cb: Answers) => Choice[];

/**
 * Represents the possible values for a given "choice"
 * in a question which has choices.
 */
export type ChoiceElement =
  | string
  | number
  | boolean
  | null
  | undefined
  | ChoiceTuple
  | ChoiceDictProxy
  | ChoiceCallback
  | Choice;

/**
 * An array of Choices represented in either it's full `Choice` form
 * or just the _value_ we want to represent. This type of array can be
 * converted into an array of `Choice` types by using the
 * `ToChoices` type util.
 */
export type ChoiceArr = readonly ChoiceElement[];

/**
 * when using the `ChoiceDict` structure of defining choices, the typical
 * approach is to have the "key" be the `name` and the "value" be the
 * `value` property
 */
export type ChoiceTuple = [value: unknown, desc: string];

/**
 * Type util which returns `true`/`false` indicating whether `T`
 * is a `ChoiceDictTuple`
 */
export type IsChoiceTuple<T> = T extends [unknown, string] ? true : false;

export type IsChoiceDictProxy<T> = T extends {
  value: unknown;
  [key: string]: unknown;
}
  ? "name" extends keyof T
    ? false
    : true
  : false;

/**
 * A `ChoiceDict` represents a set of `Choices` as a dictionary where
 * the keys are the "names" and the values are the actual values of the
 * the individual choices.
 */
export type ChoiceDict<
  K extends string = string,
  E extends ChoiceElement = ChoiceElement,
> = Record<K, E>;

/**
 * When parsing a `ChoiceDict` key/value passed in, if the value looks
 * like a `Choice` -- but doesn't need the static "type", and doesn't
 * have the `name` property (which is represented by the _key_ of a ChoiceDict)
 * -- then it's definition will be preserved and the missing `type` and `name`
 * properties added so it's a full fledged `Choice`
 */
export type ChoiceDictProxy = Omit<Choice, "type" | "name">;

/**
 * All accepted values for a raw choices property
 */
export type Choices<
  K extends string = string,
  N extends ChoiceElement = ChoiceElement,
> = ChoicesCallback | readonly N[] | ChoiceDict<K, N>;
