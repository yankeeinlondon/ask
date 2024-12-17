import type {  InferAnswers, Survey } from "src/types/Survey";
import { 
  type AsyncFunction,
  type EmptyObject, 
  type ExpandDictionary, 
  type SyncFunction,
  isBoolean, 
  isFunction, 
  isThenable,
} from "inferred-types";
import { Question } from "src/types/Question";


const resolve = async <
  T extends AsyncFunction<[A], boolean> | SyncFunction<[A], boolean>,
  A extends Record<string, any>
>(
  when: T,
  answers: A
): Promise<boolean> => {
  return isThenable(when)
    ? await when(answers)
    : when(answers)
}

export function survey<T extends readonly Question[]>(
  ...steps: T
): Survey<T> {
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
      /** answers dictionary */
      let answers: Record<string, unknown> = initialState || {};

      for (const step of steps) {
        const when = step?.when;
        if (isBoolean(when) && (isFunction(when) && await resolve(when, answers) === true)) {
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
