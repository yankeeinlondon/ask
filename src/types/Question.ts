import { AnyFunction, HasRequiredProps, Or } from "inferred-types";
import { Answers, Prompt, QuestionType, RequirementDescriptor, Requirements } from "./inquirer";
import { FromRequirements } from "./utility";


export type QuestionFn<
  TReq extends Requirements,
  TPrompt extends Prompt<TReq>,
  TRtn extends Answers
> = TReq extends RequirementDescriptor
? Or<[HasRequiredProps<TReq>, TPrompt extends AnyFunction? true : false]> extends true
  ? <T extends FromRequirements<TReq>>(answers: T) => Promise<TRtn>
  : <T extends FromRequirements<TReq>>(answers?: T) => Promise<TRtn>
: <T extends Answers>(answers?: T) => Promise<TRtn>;


export type QuestionProps<
  TName extends string,
  TType extends QuestionType,
  TPrompt extends string,
> = {
  kind: "question",
  name: TName,
  prompt: TPrompt,
  type: TType
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
  TName extends string = string,
  TType extends QuestionType = QuestionType,
  TPrompt extends string = string,
  TFn extends QuestionFn<Requirements,Prompt, Answers> = QuestionFn<Requirements, Prompt, Answers>
> = {
  kind: "question";
  name: TName;
  prompt: TPrompt;
  type: TType;
} & TFn;
