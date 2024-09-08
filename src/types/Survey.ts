import { Question } from "./Question";
import { ExpandDictionary } from "inferred-types";

export type SurveyStep = Question<string, any, string, any>;

type StepAnswers<T extends readonly SurveyStep[]> = {
  [K in keyof T]: T[K] extends Question<infer Name, any, any, infer Fn>
    ? Fn extends (...args: any[]) => Promise<infer R>
      ? {
          [P in Name]: R extends { [key: string]: unknown }
            ? R[P & keyof R]
            : unknown;
        }
      : never
    : never;
};

type StepRequirements<T extends readonly SurveyStep[]> = {
  [K in keyof T]: T[K] extends Question<any, any, any, infer Fn>
    ? Fn extends (answers: infer R) => any
      ? R
      : never
    : never;
};

export type InferAnswers<T extends readonly SurveyStep[]> = ExpandDictionary<
  UnionToIntersection<StepAnswers<T>[number]>
>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type ValidateRequirementsImpl<
  TAnswers extends any[],
  TRequirements extends any[],
  TAcc extends any[] = [],
> = TAnswers extends [infer FirstAnswer, ...infer RestAnswers]
  ? TRequirements extends [infer FirstReq, ...infer RestReq]
    ? FirstReq extends keyof FirstAnswer
      ? ValidateRequirementsImpl<RestAnswers, RestReq, [...TAcc, FirstAnswer]>
      : ["Error: Unmet requirements", FirstReq]
    : TAcc
  : TAcc;

export type ValidateRequirements<T extends readonly SurveyStep[]> =
  ValidateRequirementsImpl<StepAnswers<T>[], StepRequirements<T>[]>;

export type ConfiguredSurvey<T extends readonly SurveyStep[]> = {
  start: <InitialState extends Record<string, unknown> | undefined = undefined>(
    initialState?: InitialState,
  ) => Promise<
    ExpandDictionary<
      InferAnswers<T> & (InitialState extends undefined ? {} : InitialState)
    >
  >;
};
