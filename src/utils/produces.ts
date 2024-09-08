import { TYPES_WITH_CHOICE } from "src/constants";
import { Choice, QuestionType } from "src/types";
import { Produces } from "src/types/Produces";

export const produces = <
  TType extends QuestionType,
  TChoices extends readonly Choice[],
>(
  type: TType,
  choices: TChoices,
): Produces<TType, TChoices> => {
  return (TYPES_WITH_CHOICE.includes(type as any)
    ? choices.map((i) => i.value)
    : choices) as unknown as Produces<TType, TChoices>;
};
