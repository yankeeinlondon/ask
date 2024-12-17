import type {
  DefineObject,
  Dictionary,
  EmptyObject,
  ExpandDictionary,
  FromDefineObject,
  Intersect,
} from "inferred-types";
import type { Choice, ChoiceElement, Choices } from "./Choice";
import type { QuestionOption } from "./options";
import type { RequirementDescriptor } from "./Requirements";
import type { Question } from "./Question";
import type { ToChoices } from "./ToChoices";
import type {  When } from "./when";

export type Shazam<T extends Choices> = ToChoices<T> extends readonly Choice[]
  ? ToChoices<T> : never;

/**
 * **Ask**
 */
export type Ask = <TReq extends RequirementDescriptor>(req: TReq) => AskApi<TReq>;

/**
 * API surface for starting to ask a question where first choice
 * is what _type_ of question you're asking.
 */
export interface AskApi<TReq extends RequirementDescriptor> {
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
  withRequirements: TReq extends EmptyObject
    ? <T extends DefineObject | Question>(req: T) => T extends DefineObject
      ? AskApi<FromDefineObject<T>>
      : T extends Question
        ? T["requirements"] extends RequirementDescriptor
          ? AskApi<T["requirements"]>
          : never
        : never
    : Readonly<TReq>;

  /**
   * configure a question which receives a textual input from the user
   */
  input: <
    TName extends string,
    TPrompt extends string,
    TOpt extends QuestionOption<"input", TReq> | undefined,
  >(
    name: TName,
    prompt: TPrompt,
    opt?: TOpt,
  ) => Question<
    TName,
    "input",
    TPrompt,
    TReq,
    null,
    When<TReq>
  >;

  /**
   * configure a question which receives a numeric value from the user
   */
  number: <
    TName extends string,
    TPrompt extends string,
    TOpt extends QuestionOption<"number", TReq> | undefined,
  >(
    name: TName,
    prompt: TPrompt,
    opt?: TOpt,
  ) => Question<
    TName,
    "number",
    TPrompt,
    TReq,
    null,
    When<TReq>
  >;

  /**
   * input for a password or secret which will result in masked values when
   * typed on the screen.
   */
  password: <
    TName extends string,
    TPrompt extends string,
    TOpt extends QuestionOption<"password", TReq> | undefined,
  >(
    name: TName,
    prompt: TPrompt,
    opt?: TOpt,
  ) => Question<
    TName,
    "password",
    TPrompt,
    TReq,
    null,
    When<TReq>
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
  confirm: <
    TName extends string,
    TPrompt extends string,
    TOpt extends QuestionOption<"confirm", TReq> | undefined,
  >(
    name: TName,
    prompt: TPrompt,
    opt?: TOpt,
  ) => Question<
    TName,
    "confirm",
    TPrompt,
    TReq,
    null,
    When<TReq>
  >;

  /**
   * let the user choose one item from the "choices"
   */
  select: <
    TName extends string,
    TPrompt extends string,
    TChoices extends Choices<K, N>,
    K extends string,
    N extends ChoiceElement,
    TOpt extends QuestionOption<"select", TReq, Shazam<TChoices>> | undefined,
  >(
    name: TName,
    prompt: TPrompt,
    choices: TChoices,
    opt?: TOpt,
  ) => Question<
    TName,
    "select",
    TPrompt,
    TReq,
    ToChoices<TChoices> extends readonly Choice[]
      ? ToChoices<TChoices>
      : never,
    When<TReq>
  >;
  rawlist: <
    TName extends string,
    TPrompt extends string,
    TChoices extends Choices<K, N>,
    K extends string,
    N extends ChoiceElement,
    TOpt extends QuestionOption<"rawlist", TReq, Shazam<TChoices>> | undefined,
  >(
    name: TName,
    prompt: TPrompt,
    choices: TChoices,
    opt?: TOpt,
  ) => Question<
    TName,
    "rawlist",
    TPrompt,
    TReq,
    Shazam<TChoices>,
    When<TReq>
  >;

  /**
   * Let user respond with shortcut keys on how they'd like to take action.
   */
  expand: <
    TName extends string,
    TPrompt extends string,
    TChoices extends Choices<K, N>,
    K extends string,
    N extends ChoiceElement,
    TOpt extends QuestionOption<"expand", TReq, Shazam<TChoices>> | undefined,
  >(
    name: TName,
    prompt: TPrompt,
    choices: TChoices,
    opt?: TOpt,
  ) => Question<
    TName,
    "expand",
    TPrompt,
    TReq,
    Shazam<TChoices>,
    When<TReq>
  >;

  /**
   * **checkbox**`(name, prompt, choices, [opt])`
   *
   * Let the user choose as many "choices" as they would like.
   */
  checkbox: <
    TName extends string,
    TPrompt extends string,
    TChoices extends Choices<K, N>,
    K extends string,
    N extends ChoiceElement,
    TOpt extends QuestionOption<"checkbox", TReq, Shazam<TChoices>> | undefined,
  >(
    name: TName,
    prompt: TPrompt,
    choices: TChoices,
    opt?: TOpt,
  ) => Question<
    TName,
    "checkbox",
    TPrompt,
    TReq,
    Shazam<TChoices>,
    When<TReq>
  >;

  /**
   * ask a question which will be answered in the user's editor of choice
   */
  editor: <
    TName extends string,
    TPrompt extends string,
    TReq extends RequirementDescriptor,
    TOpt extends QuestionOption<"editor", TReq> | undefined,
  >(
    name: TName,
    prompt: TPrompt,
    opt?: TOpt,
  ) => Question<
    TName,
    "editor",
    TPrompt,
    TReq,
    null,
    When<TReq>
  >;
}

export type SurveyCallback = <
  TProp extends string,
  TAnswers extends Dictionary,
>(
  prop: TProp,
  answers: TAnswers,
) => Promise<ExpandDictionary<TAnswers & Record<TProp, unknown>>>;

export type SurveyStep = Question | SurveyCallback;

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
