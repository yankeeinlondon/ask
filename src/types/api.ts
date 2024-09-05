
import { ChoiceElement, Choices } from "./Choice";
import {  
  RequirementDescriptor, 
  Requirements 
} from "./inquirer";
import { QuestionOption } from "./options";
import { 
  Question, 
  QuestionFn 
} from "./Question";
import {  
  FromRequirements, 
  QuestionReturns 
} from "./utility";




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
   * **withRequirements**
   * 
   * - if your question _requires_ that certain parameters be in the **Answers**
   * hash prior to your question you can express that here.
   * - if you have a parameter which you expect to be of a particular type
   * but don't actually "need" it to be in the hash you can express this with 
   * value which is in union with _undefined_.
   * 
   * ```ts
   * withRequirements: {
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
  withRequirements: TReq extends RequirementDescriptor
    ? Readonly<FromRequirements<TReq>>
    : <T extends RequirementDescriptor>(req: T) => AskApi<T>;


  /**
   * configure a question which receives a textual input from the user
   */
  input<
    TName extends string, 
    TPrompt extends string,
    TOpt extends QuestionOption<"input", TReq>
  >(
    name: TName,
    prompt: TPrompt, 
    opt?: TOpt
   ): Question<
        TName,
        "input", 
        TPrompt, 
        QuestionFn<TReq, QuestionReturns<TName,"input",TReq>>
      >;

  /**
   * configure a question which receives a numeric value from the user
   */  
  number<
    TName extends string, 
    TPrompt extends string,
    TOpt extends QuestionOption<"number", TReq>
  >(
    name: TName,
    prompt: TPrompt, 
    opt?: TOpt
   ): Question<
        TName,
        "number", 
        TPrompt, 
        QuestionFn<TReq, QuestionReturns<TName,"number",TReq>>
      >;
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
    TOpt extends QuestionOption<"confirm", TReq>
  >(
    name: TName,
    prompt: TPrompt, 
    opt?: TOpt
  ): Question<
      TName,
      "confirm", 
      TPrompt, 
      QuestionFn<TReq, QuestionReturns<TName,"confirm",TReq>>
    >;
  select<
    TName extends string, 
    TPrompt extends string,
    TChoices extends (readonly N[] | Record<K,N>),
    K extends string,
    N extends ChoiceElement,
    TOpt extends QuestionOption<"select", TReq>
  >(
    name: TName,
    prompt: TPrompt, 
    choices: TChoices,
    opt?: TOpt
  ): Question<
      TName,
      "select", 
      TPrompt, 
      QuestionFn<TReq, QuestionReturns<TName,"select",TReq,TChoices>>
    >;
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
   ): Question<
      TName,
      "rawlist", 
      TPrompt, 
      QuestionFn<TReq, QuestionReturns<TName,"rawlist",TReq,TChoices>>
    >;
  expand<
    TName extends string, 
    TPrompt extends string,
    TRequire extends Requirements,
    TChoices extends Choices,
    TOpt extends QuestionOption<"expand", TRequire>
  >(
    name: TName,
    prompt: string, 
    choices: TChoices,
    opt?: TOpt
  ): Question<
      TName,
      "expand", 
      TPrompt, 
      QuestionFn<TReq, QuestionReturns<TName,"expand",TReq,TChoices>>
    >;

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
  ): Question<
      TName,
      "checkbox", 
      TPrompt, 
      QuestionFn<TReq, QuestionReturns<TName,"checkbox",TReq,TChoices>>
    >;
  password<
    TName extends string, 
    TPrompt extends string,
    TRequire extends Requirements,
    TOpt extends QuestionOption<"password", TRequire>
  >(
    name: TName,
    prompt: string, 
    opt?: TOpt
  ): Question<
      TName,
      "password", 
      TPrompt, 
      QuestionFn<TReq, QuestionReturns<TName,"password",TReq>>
    >;
  editor<
    TName extends string, 
    TPrompt extends string,
    TRequire extends Requirements,
    TOpt extends QuestionOption<"editor", TRequire>
  >(
    name: TName,
    prompt: string, 
    opt?: TOpt
  ): Question<
      TName,
      "editor", 
      TPrompt, 
      QuestionFn<TReq, QuestionReturns<TName,"editor",TReq>>
    >;

}

