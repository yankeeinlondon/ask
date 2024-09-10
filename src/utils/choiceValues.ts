import { Choices, ToChoiceValues } from "src/types";
import { normalizeChoices } from "./normalizeChoices";

/**
 * Reduces any representation of `Choices` to a tuple representing the
 * possible values which a _chosen_ choice might be.
 */
export const choiceValues = <T extends Choices | undefined>(
  choices: T,
): ToChoiceValues<T> => {
  return (choices
    ? normalizeChoices(choices).map((c) => c.value)
    : undefined) as unknown as ToChoiceValues<T>;
};
