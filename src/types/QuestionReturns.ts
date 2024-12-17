import type { ExpandDictionary } from "inferred-types";
import type { Choice } from "./Choice";
import type { ChoiceReturns } from "./ChoiceReturns";
import type { QuestionType } from "./QuestionType";
import type { RequirementDescriptor } from "./Requirements";

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
  TRequire extends RequirementDescriptor,
  TChoices extends (readonly Choice[]) | null,
  TDirect extends boolean = false,
> = TDirect extends true
  ? ChoiceReturns<TName, TType, TChoices>[TName]

  : ExpandDictionary<
    Record<string, unknown> & // index allows other props to co-exist
    TRequire & // all key/values which this question depends on
    ChoiceReturns<TName, TType, TChoices> // the specific key/value this question provides
  >;
