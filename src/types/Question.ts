import { Answers, Requirements } from "./inquirer";
import { QuestionType } from "./QuestionType";
import { ChoicesByType, QuestionParams } from "./utility";

export type QuestionFn<TReq extends Requirements, TRtn extends Answers> = <
  T extends QuestionParams<TReq>,
>(
  ...args: T
) => Promise<TRtn>;

export type QuestionProps<
  TName extends string,
  TType extends QuestionType,
  TPrompt extends string,
> = {
  kind: "question";
  question: TName;
  prompt: TPrompt;
  type: TType;
};

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
  TFn extends QuestionFn<Requirements, Answers> = QuestionFn<
    Requirements,
    Answers
  >,
> = {
  kind: "question";
  prop: TProp;
  prompt: TPrompt;
  type: TType;
  choices: ChoicesByType<TType>;
} & TFn;
