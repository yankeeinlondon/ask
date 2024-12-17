import type { Question } from "src/types/Question";
import type { InferFinalState, Survey } from "src/types/Survey";
import {
  type AsyncFunction,
  isFunction,
  isThenable,
  type SyncFunction,
} from "inferred-types";

async function resolve<
  T extends AsyncFunction<[A], boolean> | SyncFunction<[A], boolean>,
  A extends Record<string, any>,
>(when: T, answers: A): Promise<boolean> {
  return isThenable(when)
    ? await when(answers)
    : when(answers);
}

export function survey<T extends readonly Question[]>(
  ...steps: T
): Survey<T> {
  const finalState = null as unknown as InferFinalState<T>;
  const questions = steps;
  const start = async <
    InitialState extends Record<string, unknown> | undefined = undefined,
  >(
    initialState?: InitialState,
  ) => {
    let answers: Record<string, unknown> = initialState || {};

    for (const step of steps) {
      const when = step?.when;

      if (typeof when === "boolean") {
        if (when === true) {
          const stepAnswer = (await step(answers)) as object;
          answers = { ...answers, ...stepAnswer };
        }
      }
      else if (isFunction(when)) {
        const shouldAsk = await resolve(when, answers);
        if (shouldAsk) {
          const stepAnswer = await step(answers);
          answers = { ...answers, ...(stepAnswer as object) };
        }
      }
    }

    return answers;
  };

  return {
    start,
    finalState,
    questions,
  } as Survey<T>;
}
