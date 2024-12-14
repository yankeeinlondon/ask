import type { UnionFromProp } from "inferred-types/types";
import type {
  Choice,
} from "./Choice";
import type {
  QuestionsWithMultiSelect,
  QuestionType,
} from "./QuestionType";

/**
 * Reduces a tuple of `Choice` objects to a union type of possible types
 * that could result from a given question.
 */
export type ChoicesOutput<
  TChoices extends readonly Choice[],
  TType extends QuestionType,
> = TType extends QuestionsWithMultiSelect
  ? Array<UnionFromProp<TChoices, "value">>
  : UnionFromProp<TChoices, "value">;
