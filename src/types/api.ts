import { TypedFunction } from "inferred-types";
import {  Choices, Prompt, QuestionOption,  RequirementDescriptor, Requirements } from "./inquirer";
import { Question, QuestionFn } from "./Question";
import { AsQuestion, FromRequirements, QuestionReturns } from "./utility";


/**
 * **Ask**
 * 
 * 
 */
export type Ask = <
  TReq extends Requirements
>(req: TReq) => AskApi<TReq>;


/**
 * API surface for starting to ask a question where first choice
 * is what _type_ of question you're asking.
 */
export type AskApi<
  TReq extends Requirements
> = {
  /**
   * **requirements**
   * 
   * - if your question _requires_ that certain parameters be in the **Answers**
   * hash prior to your question you can express that here.
   * - if you have a parameter which you expect to be of a particular type
   * but don't actually "need" it to be in the hash you can express this with 
   * value which is in union with _undefined_.
   * 
   * ```ts
   * requirements: {
   *    needsProp: "string",
   *    wouldBeNice: "Opt<number>"
   * }
   * ```
   * 
   * - `needsProp` will not be allowed into any survey without providing the
   * this property
   * - both `needsProp` and `wouldBeNice` will be typed values when using a
   * callback for a prompt message or any other dynamic property.
   */
  requirements: TReq extends RequirementDescriptor
    ? Readonly<FromRequirements<TReq>>
    : <T extends RequirementDescriptor>(req: T) => AskApi<T>;


  input<
    TName extends string, 
    TPrompt extends Prompt<TReq>,
    TOpt extends QuestionOption<"input", TReq>
  >(
    name: TName,
    prompt: TPrompt, 
    opt?: TOpt
  ): Question<
    TName,
    "input",
    TPrompt extends TypedFunction
      ? ReturnType<TPrompt>
      : TPrompt,
    QuestionFn<TReq,QuestionReturns<TName, "input", TReq>>
  >;

  
  number<
    TName extends string, 
    TPrompt extends string,
    TOpt extends QuestionOption<"number", TReq>
  >(
    name: TName,
    prompt: TPrompt, 
    opt?: TOpt
   ): AsQuestion<TName,"number",TReq, TPrompt>;
  /**
   * **confirm**
   * 
   * Produces a _confirmation_ question which automatically post-fixes
   * the **(y/N)** or **(Y/n)** text to your prompt question.
   * 
   * By default, the "Y" answer if _preferred_ (aka, defaulted to) but you can
   * change `default` to false if you would like the reverse behavior.
   */
  confirm<
    TName extends string, 
    TPrompt extends string,
    TRequire extends Requirements,
    TOpt extends QuestionOption<"confirm", TRequire>
  >(
    name: TName,
    prompt: TPrompt, 
    opt?: TOpt
  ): AsQuestion<TName,"confirm",TReq, TPrompt>;
  list<
    TName extends string, 
    TPrompt extends string,
    TRequire extends Requirements,
    TChoices extends Choices,
    TOpt extends QuestionOption<"number", TRequire>
  >(
    name: TName,
    prompt: TPrompt, 
    choices: TChoices,
    opt?: TOpt
  ): AsQuestion<TName,"confirm",TReq, TPrompt, TChoices>;
  rawlist<
    TName extends string, 
    TPrompt extends string,
    TRequire extends Requirements,
    TChoices extends Choices,
    TOpt extends QuestionOption<"rawlist", TRequire>
  >(
    name: TName,
    prompt: string, 
    choices: Choices,
    opt?: TOpt
   ): AsQuestion<TName,"rawlist",TReq, TPrompt, TChoices>;
  expand<
    TName extends string, 
    TPrompt extends string,
    TRequire extends Requirements,
    TChoices extends Choices,
    TOpt extends QuestionOption<"expand", TRequire>
  >(
    name: TName,
    prompt: string, 
    opt:TOpt
  ): AsQuestion<TName,"expand",TReq, TPrompt, TChoices>;
  checkbox<
    TName extends string, 
    TPrompt extends string,
    TRequire extends Requirements,
    TChoices extends Choices,
    TOpt extends QuestionOption<"checkbox", TRequire>
  >(
    name: TName,
    prompt: string, 
    choices: Choices,
    opt?: TOpt
  ): AsQuestion<TName,"checkbox",TReq, TPrompt, TChoices>;
  password<
    TName extends string, 
    TPrompt extends string,
    TRequire extends Requirements,
    TChoices extends Choices,
    TOpt extends QuestionOption<"password", TRequire>
  >(
    name: TName,
    prompt: string, 
    opt?: TOpt
  ): AsQuestion<TName,"password",TReq, TPrompt, TChoices>;
  editor<
    TName extends string, 
    TPrompt extends string,
    TRequire extends Requirements,
    TChoices extends Choices,
    TOpt extends QuestionOption<"editor", TRequire>
  >(
    name: TName,
    prompt: string, 
    opt?: TOpt
  ): AsQuestion<TName,"editor",TReq, TPrompt, TChoices>;
}

