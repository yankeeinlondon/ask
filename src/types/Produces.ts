import { QuestionsWithMultiSelect, QuestionType } from "./QuestionType";
import { Choice, Choices } from "./Choice";
import { ToChoices } from "./utility";

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
> = TType extends QuestionsWithMultiSelect
  ? Array<Process<ToChoices<TChoices>>>
  : Process<ToChoices<TChoices>>;
