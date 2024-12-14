import type { UnionFromProp } from "inferred-types";
import type { Choice } from "./Choice";
import type { QuestionsWithMultiSelect, QuestionType, QuestionTypeLookup } from "./QuestionType";

/**
 * ChoiceReturns
 *
 * Returns the _type_ of the key/value pair associated with the
 * question being answered.
 *
 * - where the question is "choice" based it will be derived from
 * the union of the choice's values.
 * - in non-choice based questions, the `QuestionTypeLookup<T>` will
 * be used to find the wide type to associate
 */
export type ChoiceReturns<
  TName extends string,
  TType extends QuestionType,
  TChoices extends readonly Choice[] | null,
> = TChoices extends readonly Choice[]
  ? TChoices extends readonly Record<string, unknown>[]
    ? TType extends QuestionsWithMultiSelect
      ? (Record<TName, UnionFromProp<TChoices, "value">>)[]
      : Record<TName, UnionFromProp<TChoices, "value">>
    : never
  : Record<TName, QuestionTypeLookup<TType>>;
