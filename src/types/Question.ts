import type { AsyncFunction } from "inferred-types";
import type { Choice } from "./Choice";
import type { QuestionParams } from "./QuestionParams";
import type { QuestionReturns } from "./QuestionReturns";
import type { QuestionType } from "./QuestionType";
import type { RequirementDescriptor } from "./Requirements";
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
  /** 
   * the key/value pairs this question expects to already have in place 
   * prior to the question being asked.
   */
  requirements: TReq;
  /** the prompt which will be used to ask the question */
  prompt: TPrompt;
  /** the _type_ of question which will be asked */
  type: TType;
  /**
   * The _choices_ which this question allows for
   */
  choices: TChoices;
  /** 
   * The conditional qualifiication this question operates on. Will be
   * a boolean value or a callback which returns one.
   */
  when: TWhen;
  /** 
   * the return value -- as key/value pairs -- this question returns once 
   * the promise is resolved.
   */
  returns: Awaited<QuestionReturns<TProp, TType, TReq, TChoices>>;
  /**
   * Ask the configured question and provides the answer as part
   * of the Answers key/value context.
   * 
   * **Note:** this is in contrast to directly calling the function
   * where the "answer" is just the answer to the individual 
   * question.
   */
  ask: AsyncFunction<
    QuestionParams<TReq>,
    QuestionReturns<TProp, TType, TReq, TChoices>
  >
} & AsyncFunction<
  QuestionParams<TReq>,
  QuestionReturns<TProp, TType, TReq, TChoices, true>
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
  /**
   * Ask the configured question and provides the answer as part
   * of the 
   */
  ask: AsyncFunction<
    QuestionParams<TReq>,
    QuestionReturns<TProp, TType, TReq, TChoices>
  >
}
