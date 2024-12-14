import type { ExpandDictionary } from "inferred-types";
import type { Choice } from "./Choice";
import type { ChoiceReturns } from "./ChoiceReturns";
import type { FromRequirements } from "./FromRequirements";
import type { Requirements } from "./inquirer";
import type { QuestionType } from "./QuestionType";

/**
 * Takes the existing answers hash and combines with a question's
 * input; which represents:
 *
 * - the questions `name` will be added to `Answers` with an appropriate
 * type.
 * - if the question has "requirements" defined than these will be added
 * in as well
 */
export type QuestionReturns<
  TName extends string,
  TType extends QuestionType,
  TRequire extends Requirements,
  TChoices extends (readonly Choice[]) | null,
> = ExpandDictionary<
  Record<string, unknown> & // index allows other props to co-exist
  FromRequirements<TRequire> & // all key/values which this question depends on
  ChoiceReturns<TName, TType, TChoices> // the specific key/value this question provides
>;
