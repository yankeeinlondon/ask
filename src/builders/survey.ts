import type { EmptyObject, ExpandDictionary } from "inferred-types";
import type { ConfiguredSurvey, InferAnswers, SurveyStep } from "src/types/Survey";

export function survey<T extends readonly SurveyStep[]>(
  ...steps: T
): ConfiguredSurvey<T> {
  return {
    async start<
      InitialState extends Record<string, unknown> | undefined = undefined,
    >(
      initialState?: InitialState,
    ): Promise<
        ExpandDictionary<
        InferAnswers<T> & (InitialState extends undefined ? EmptyObject : InitialState)
        >
      > {
      let answers: Record<string, unknown> = initialState || {};

      for (const step of steps) {
        if (step.when(answers) === true) {
          const stepAnswer = await step(answers);
          answers = { ...answers, ...stepAnswer };
        }
      }

      return answers as ExpandDictionary<
        InferAnswers<T> & (InitialState extends undefined ? EmptyObject : InitialState)
      >;
    },
  };
}
