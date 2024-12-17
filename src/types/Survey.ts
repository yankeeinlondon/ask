import type {
  AfterFirst,
  AnyObject,
  EmptyObject,
  ExpandDictionary,
  First,
  HasRequiredProps,
} from "inferred-types";
import type { Question } from "./Question";

/**
 * determines what the final state of the Answers hash will be
 * when the survey is complete
 */
export type InferFinalState<
  T extends readonly Question[],
  R extends AnyObject = EmptyObject,
> = [] extends T
  ? ExpandDictionary<R>
  : InferFinalState<
    AfterFirst<T>,
    R & First<T>["returns"]
  >;

/**
 * Determines the key/value pairs that are "required" but not provided
 * by the questions in the survey. This makes the a requirement for the
 * survey to provide them as it's initial state.
 */
export type InferMissingState<
  T extends readonly Question[],
  R extends AnyObject = EmptyObject,
  H extends AnyObject = EmptyObject,
> = [] extends T
  ? ExpandDictionary<R>
  : InferMissingState<
    AfterFirst<T>,
    HasRequiredProps<First<T>["requirements"]> extends true
      ? H extends First<T>["requirements"]
        ? R
        : R & First<T>["requirements"]
      : R,
    HasRequiredProps<First<T>["requirements"]> extends true
      ? H & First<T>["requirements"]
      : H
  >;

/**
 * Determines the parameters for the `start` function of a Survey
 */
export type StartParams<T extends readonly Question[]> = HasRequiredProps<
  InferMissingState<T>
> extends true
  ? [initialState: InferMissingState<T> & Record<string, unknown>]
  : [initialState?: InferMissingState<T> & Record<string, unknown> | undefined];

export interface Survey<T extends readonly Question[]> {
  start: <InitialState extends StartParams<T>>(
    ...args: InitialState
  ) => Promise<
    ExpandDictionary<
        InferFinalState<T> & (InitialState extends undefined ? EmptyObject : InitialState)
    >
  >;
  questions: T;
  finalState: InferFinalState<T>;
}
