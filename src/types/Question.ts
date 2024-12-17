import type { AsyncFunction } from "inferred-types";
import type { Choice } from "./Choice";
import type { RequirementDescriptor } from "./inquirer";
import type { QuestionParams } from "./QuestionParams";
import type { QuestionReturns } from "./QuestionReturns";
import type { QuestionType } from "./QuestionType";
import type { When } from "./when";

/**
 * type utility which ensures a `Questions` function is correctly typed
 */
export type QuestionFn<
  TProp extends string,
  TType extends QuestionType,
  TReq extends RequirementDescriptor,
  TChoices extends readonly Choice[] | null,
> = AsyncFunction<
  QuestionParams<TReq>,
  QuestionReturns<TProp, TType, TReq, TChoices>
>;

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
  TReq extends RequirementDescriptor = RequirementDescriptor,
  TChoices extends readonly Choice[] | null = readonly Choice[] | null,
  TWhen extends When<TReq> = When<TReq>,
> = {
  kind: "question";
  prop: TProp;
  requirements: TReq;
  prompt: TPrompt;
  type: TType;
  choices: TChoices;
  when: TWhen;
  returns: Awaited<QuestionReturns<TProp, TType, TReq, TChoices>>;
} & AsyncFunction<
  QuestionParams<TReq>,
  QuestionReturns<TProp, TType, TReq, TChoices>
>;

export interface QuestionProps<
  TProp extends string = string,
  TType extends QuestionType = QuestionType,
  TPrompt extends string = string,
  TReq extends RequirementDescriptor = RequirementDescriptor,
  TChoices extends readonly Choice[] | null = readonly Choice[] | null,
  TWhen extends When<TReq> = When<TReq>,
> {
  kind: "question";
  prop: TProp;
  requirements: TReq;
  prompt: TPrompt;
  type: TType;
  choices: TChoices;
  when: TWhen;
  returns: Awaited<QuestionReturns<TProp, TType, TReq, TChoices>>;
}
