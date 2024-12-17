import type {
  AfterFirst,
  AnyObject,
  EmptyObject,
  ExpandDictionary,
  First,
} from "inferred-types";
import type { Question } from "./Question";

export type InferAnswers<
  T extends readonly Question[],
  R extends AnyObject = EmptyObject,
> =
[] extends T
  ? ExpandDictionary<R>
  : InferAnswers<
    AfterFirst<T>,
    R & First<T>["returns"]
  >;

export interface Survey<T extends readonly Question[]> {
  start: <InitialState extends Record<string, unknown> | undefined = undefined>(
    initialState?: InitialState,
  ) => Promise<
    ExpandDictionary<
        InferAnswers<T> & (InitialState extends undefined ? EmptyObject : InitialState)
    >
  >;
  questions: T;
  finalState: InferAnswers<T>;
}
