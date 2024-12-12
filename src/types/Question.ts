import type { AsyncFunction } from "inferred-types";
import type { Requirements } from "./inquirer";
import type { QuestionType } from "./QuestionType";
import type { QuestionParams } from "./utility";

/**
 * type utility which ensures a `Questions` function is correctly typed
 */
export type QuestionFn<
  TReq extends Requirements,
  TRtn,
> = AsyncFunction<QuestionParams<TReq>, TRtn>;

export interface QuestionProps<
  TName extends string,
  TType extends QuestionType,
  TPrompt extends string,
> {
  kind: "question";
  question: TName;
  prompt: TPrompt;
  type: TType;
}

/**
 * **Question**
 *
 * a _question_ defines all the parameters of an _askable_ question
 * and can be called directly like so:
 *
 * ```ts
 * // Question<...>
 * const name = ask.input("name", "What's your name?");
 * // { name: string; age: 44 }
 * const answers = await name({age: 44});
 * // nothing required to call a question with _no_ requirements
 * // { name: string }
 * const noParams = await name();
 * ```
 */
export type Question<
  TProp extends string = string,
  TType extends QuestionType = QuestionType,
  TPrompt extends string = string,
  TWhen extends (answers: QuestionParams<any>) => boolean = (
    answers: QuestionParams<any>,
  ) => boolean,
  TFn extends AsyncFunction<[Record<string, any>] | []> = AsyncFunction<
    [Record<string, any>] | []
  >,
> = {
  kind: "question";
  prop: TProp;
  prompt: TPrompt;
  type: TType;
  when: TWhen;
} & TFn;
