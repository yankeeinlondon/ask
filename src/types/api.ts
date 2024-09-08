import { Dictionary, ExpandDictionary, Intersect } from "inferred-types";
import { ChoiceElement, Choices } from "./Choice";
import { RequirementDescriptor, Requirements } from "./inquirer";
import { QuestionOption } from "./options";
import { Question, QuestionFn } from "./Question";
import { FromRequirements, QuestionReturns } from "./utility";

/**
 * **Ask**
 *
 *
 */
export type Ask = <TReq extends Requirements>(req: TReq) => AskApi<TReq>;

/**
 * API surface for starting to ask a question where first choice
 * is what _type_ of question you're asking.
 */
export type AskApi<TReq extends Requirements> = {
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
    TOpt extends QuestionOption<"input", TReq>,
  >(
    name: TName,
    prompt: TPrompt,
    opt?: TOpt,
  ): Question<
    TName,
    "input",
    TPrompt,
    QuestionFn<TReq, QuestionReturns<TName, "input", TReq>>
  >;

  /**
   * configure a question which receives a numeric value from the user
   */
  number<
    TName extends string,
    TPrompt extends string,
    TOpt extends QuestionOption<"number", TReq>,
  >(
    name: TName,
    prompt: TPrompt,
    opt?: TOpt,
  ): Question<
    TName,
    "number",
    TPrompt,
    QuestionFn<TReq, QuestionReturns<TName, "number", TReq>>
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
    TOpt extends QuestionOption<"confirm", TReq>,
  >(
    name: TName,
    prompt: TPrompt,
    opt?: TOpt,
  ): Question<
    TName,
    "confirm",
    TPrompt,
    QuestionFn<TReq, QuestionReturns<TName, "confirm", TReq>>
  >;

  /**
   * let the user choose one item from the "choices"
   */
  select<
    TName extends string,
    TPrompt extends string,
    TChoices extends readonly N[] | Record<K, N>,
    K extends string,
    N extends ChoiceElement,
    TOpt extends QuestionOption<"select", TReq>,
  >(
    name: TName,
    prompt: TPrompt,
    choices: TChoices,
    opt?: TOpt,
  ): Question<
    TName,
    "select",
    TPrompt,
    QuestionFn<TReq, QuestionReturns<TName, "select", TReq, TChoices>>
  >;
  rawlist<
    TName extends string,
    TPrompt extends string,
    TChoices extends readonly N[] | Record<K, N>,
    K extends string,
    N extends ChoiceElement,
    TOpt extends QuestionOption<"rawlist", TReq>,
  >(
    name: TName,
    prompt: string,
    choices: Choices,
    opt?: TOpt,
  ): Question<
    TName,
    "rawlist",
    TPrompt,
    QuestionFn<TReq, QuestionReturns<TName, "rawlist", TReq, TChoices>>
  >;

  /**
   * Let user respond with shortcut keys on how they'd like to take action.
   */
  expand<
    TName extends string,
    TPrompt extends string,
    TChoices extends readonly N[] | Record<K, N>,
    K extends string,
    N extends ChoiceElement,
    TOpt extends QuestionOption<"expand", TReq>,
  >(
    name: TName,
    prompt: string,
    choices: TChoices,
    opt?: TOpt,
  ): Question<
    TName,
    "expand",
    TPrompt,
    QuestionFn<TReq, QuestionReturns<TName, "expand", TReq, TChoices>>
  >;

  /**
   * Let the user choose as many "choices" as they would like.
   */
  checkbox<
    TName extends string,
    TPrompt extends string,
    TChoices extends readonly N[] | Record<K, N>,
    K extends string,
    N extends ChoiceElement,
    TOpt extends QuestionOption<"checkbox", TReq>,
  >(
    name: TName,
    prompt: TPrompt,
    choices: TChoices,
    opt?: TOpt,
  ): Question<
    TName,
    "checkbox",
    TPrompt,
    QuestionFn<TReq, QuestionReturns<TName, "checkbox", TReq, TChoices>>
  >;
  /**
   * as for a password or secret which will result in masked values when
   * typed on the screen.
   */
  password<
    TName extends string,
    TPrompt extends string,
    TOpt extends QuestionOption<"password", TReq>,
  >(
    name: TName,
    prompt: string,
    opt?: TOpt,
  ): Question<
    TName,
    "password",
    TPrompt,
    QuestionFn<TReq, QuestionReturns<TName, "password", TReq>>
  >;

  /**
   * ask a question which will be answered in the user's editor of choice
   */
  editor<
    TName extends string,
    TPrompt extends string,
    TRequire extends Requirements,
    TOpt extends QuestionOption<"editor", TRequire>,
  >(
    name: TName,
    prompt: string,
    opt?: TOpt,
  ): Question<
    TName,
    "editor",
    TPrompt,
    QuestionFn<TReq, QuestionReturns<TName, "editor", TReq>>
  >;
};

export type SurveyCallback = <
  TProp extends string,
  TAnswers extends Dictionary,
>(
  prop: TProp,
  answers: TAnswers,
) => Promise<ExpandDictionary<TAnswers & Record<TProp, unknown>>>;

export type SurveyStep = Question<any, any, any, any> | SurveyCallback;

// export type Survey = {
//   kind: "Survey";
//   /** the sequence of steps (aka, questions and callbacks) to run when executed */
//   sequence: {
//     [K in keyof T]: T[K]["prop"]
//   },

//   /**
//    * the actual steps/functions needed to complete the survey
//    */
//   steps: readonly SurveyStep[];

//   /**
//    * The state of the "answers" dictionary on completion of the survey.
//    */
//   answers: RemoveIndexKeys<ExpandDictionary<Intersect<{
//     [K in keyof T]: Awaited<ReturnType<T[K]>>
//   }>>>

//   start<A extends Dictionary>(answers?: A): Promise<

//       ExpandDictionary<
//         Intersect<{
//           [K in keyof T]: Awaited<ReturnType<T[K]>>
//         }> & Iff<A, EmptyObject>
//       >
//   >
// }

export type SurveyBuilder = <Q extends readonly Question<any, any, any, any>[]>(
  ...question: Q
) => {
  kind: "Survey";
  sequence: {
    [K in keyof Q]: Q[K]["prop"];
  };
  start: <I extends Dictionary>(initialState?: I) => any;
  answers: ExpandDictionary<
    Intersect<{
      [K in keyof Q]: Awaited<ReturnType<Q[K]>>;
    }>
  >;
};
