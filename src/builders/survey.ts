import { InferAnswers, SurveyStep, ConfiguredSurvey } from "src/types/Survey";
import { ExpandDictionary } from "inferred-types";

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
        InferAnswers<T> & (InitialState extends undefined ? {} : InitialState)
      >
    > {
      let answers: Record<string, unknown> = initialState || {};

      for (const step of steps) {
        answers = await step(answers);
      }

      return answers as ExpandDictionary<
        InferAnswers<T> & (InitialState extends undefined ? {} : InitialState)
      >;
    },
  };
}
