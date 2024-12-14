import type { Choice, Choices } from "./Choice";
import type { ToChoices } from "./ChoicesOutput";
import type { QuestionsWithMultiSelect, QuestionType } from "./QuestionType";

type Process<T extends readonly Choice[]> = {
  [K in keyof T]: T[K]["value"];
}[number];

/**
 * **Produces**`<TType,TChoices>`
 *
 * the _type_ which a question will produce; uses the question's **type** and
 * any **choices** used to define it.
 */
export type Produces<
  TType extends QuestionType,
  TChoices extends Choices,
> = TChoices extends Choices
  ? TType extends QuestionsWithMultiSelect
    ? Process<ToChoices<TChoices>>
    : Process<ToChoices<TChoices>>
  : never;
