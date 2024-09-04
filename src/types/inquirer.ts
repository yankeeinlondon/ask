import { 
  Dictionary,
  EmptyObject, 
  Scalar, 
  SimpleToken,
} from "inferred-types";
import { 
  AsyncCallback, 
  Callback, 
  FromRequirements, 
} from "./utility";
import { Question } from "./Question";


/**
 * a union of acceptable values for the `type` of a Question
 */
export type QuestionType = 
| "input"
| "number"
| "confirm"
| "list"
| "rawlist"
| "expand"
| "checkbox"
| "password"
| "editor";


/**
 * An array of Choices represented in either it's full `Choice` form
 * or just the _value_ we want to represent. This type of array can be
 * converted into an array of `Choice` types by using the 
 * `ToChoices` type util.
 */
export type ChoiceArr = readonly (string | number | boolean | null | undefined | Choice<unknown>)[];

/**
 * when using the `ChoiceDict` structure of defining choices, the typical approach is
 * to have the "key" be the `name` and the "value" be the `value` property 
 */
export type ChoiceDictTuple = [value: unknown, desc: string];

export type IsChoiceDictTuple<T> = T extends [unknown, string]
  ? true
  : false;

/**
 * A `ChoiceDict` represents a set of `Choices` as a dictionary where
 * the keys are the "names" and the values are the actual values of the
 * the individual choices.
 */
export type ChoiceDict = Record<string, Scalar | Dictionary | ChoiceDictTuple>;

export type Choices = 
| ChoiceArr
| ChoiceDict;


/**
 * A fully qualified definition of a choice
 */
export type Choice<T = unknown> = {
  type: "choice";
  /** 
   * the actual _value_ which the question will be set to if this choice is selected */
  value: T;
  name: string;
  description?: string;
  /**
   * Used in the `checkbox` type to indicate the initial state
   */
  checked?: boolean;
  /**
   * Once the prompt is done (press enter), we'll use `short` if defined to 
   * render next to the question. By default we'll use `name`.
   */
  short?: string;
  /**
   * Disallow the option from being selected. If disabled is a string, it'll 
   * be used as a help tip explaining why the choice isn't available.
   */
  disabled?: boolean | "true" | "false";
}

type BaseQuestionOptions<
  TBaseType,
  TRequire extends Requirements
> = {

  /** the default value to start with */
  default?: TBaseType;
  /** boolean flag indicating if a value is _required_ from this question */
  required?: boolean;
  /** no idea */
  theme?: {
    prefix: string;
    spinner: {
      interval: number;
      frames: string[];
    };
    style: {
      answer: (text: string) => string;
      message: (text: string) => string;
      error: (text: string) => string;
      defaultAnswer: (text: string) => string;
      help: (text: string) => string;
      highlight: (text: string) => string;
      key: (text: string) => string;
      disabledChoice: (text: string) => string;
      description: (text: string) => string;
      renderSelectedChoices: <T>(
        selectedChoices: ReadonlyArray<Choice<T>>,
        allChoices: ReadonlyArray<Choice<T> | Separator>,
      ) => string;
    };
    icon: {
      checked: string;
      unchecked: string;
      cursor: string;
    };
    /** 
     * Modes:
     * 
     * - `auto` (default): Hide the help tips after an interaction occurs. The 
     * scroll tip will hide after any interactions, the selection tip will hide 
     * as soon as a first selection is done.
     * - `always`: The help tips will always show and never hide.
     * - `never`: The help tips will never show.
     */
    helpMode: 'always' | 'never' | 'auto';
  };

  /**
   * **requirements**
   * 
   * Allows for a question to express which properties in 
   * `Answers` it _requires_ to complete it's task.
   * 
   * For example:
   * ```ts
   * {
   *    requirements: {
   *      foo: "number",
   *      bar: "string",
   *      baz: "Opt<number(42,99,0)>"
   *    }
   * }
   * ```
   * 
   * - this means that `foo` and `bar` MUST be defined prior to asking this question
   * - the property `baz` is _optional_ so it's not a requirement but all three 
   * properties will be typed for all appropriate callbacks defined on this question
   */
  requirements?: TRequire;

  /**
   * Force to prompt the question if the answer already exists.
   */
  askAnswered?: boolean;

  validate?: (value: TBaseType) => boolean | TBaseType | Promise<TBaseType | boolean>;

  /**
   * Post-processes the answer.
   *
   * @param input
   * The answer provided by the user.
   *
   * @param answers
   * The answers provided by the user.
   */
  filter?(input: TBaseType, answers: Answers<TRequire>): TBaseType;

  /**
   * A callback which determines if the question should be asked.
   */
  when?: DynamicQuestionProp<boolean, Answers<TRequire>>;

  /**
   * Transforms the value to display to the user.
   *
   * @param input
   * The input provided by the user.
   *
   * @param answers
   * The answers provided by the users.
   *
   * @param flags
   * Additional information about the value.
   *
   * @returns
   * The value to display to the user.
  */
  transformer?(
    input: TBaseType, 
    answers: Answers<TRequire>, 
    flags: { 
      isFinal?: boolean | undefined 
    }
  ): string | Promise<TBaseType>;
}

type InputQuestionOptions<
  TRequire extends Requirements
> = BaseQuestionOptions<string, TRequire> & {


}

export type NumberQuestionOptions<
  TRequire extends Requirements
> = BaseQuestionOptions<number, TRequire> & {
  min?: number;
  max?: number;
  step?: number | 'any';
}

export type ConfirmQuestionOptions<
  TRequire extends Requirements
> = BaseQuestionOptions<string, TRequire>;

export type ListQuestionOptions<
  TRequire extends Requirements
> = BaseQuestionOptions<string, TRequire>;


export type PasswordQuestionOptions<
  TRequire extends Requirements
> = BaseQuestionOptions<string, TRequire> & {
  mask?: boolean | string;
}

export type RawlistQuestionOptions<
  TRequire extends Requirements
> = BaseQuestionOptions<unknown, TRequire> & {
  /** the _prompt_ message */
  message?: string;
  choices?: readonly (string | Choice<unknown>)[];
}

export type EditorQuestionOptions<T extends Requirements> = BaseQuestionOptions<string, T> & {}

export type  ExpandQuestionOptions<T extends Requirements> = BaseQuestionOptions<string, T>;

export type  CheckboxQuestionOptions<T extends Requirements> = BaseQuestionOptions<unknown[], T> & {
  /** 
   * Defaults to `true`. When set to `false`, the cursor will be constrained 
   * to the top and bottom of the choice list without looping.
   */
  loop?: boolean;
  /**
   * By default, lists of choice longer than 7 will be paginated. Use this 
   * option to control how many choices will appear on the screen at once.
   */
  pageSize?: number;
};


export type ListChoiceOptions = {
  /**
   * A value indicating whether the choice is disabled.
   */
  disabled?: DynamicQuestionProp<boolean | string, Answers> | undefined;
}



/**
 * **DynamicQuestionProp**`<TValue, TAnswers>`
 * 
 * Either a static value of type `TValue`, a callback or an async callback
 * where the callback is provided `TAnswers` representing the answer to 
 * those questions which have preceded the active question.
 */
export type DynamicQuestionProp<
  TValue,
  TAnswers extends Answers = EmptyObject
> = TValue | Callback<[TAnswers], TValue> | AsyncCallback<[TAnswers],TValue>;


export interface ChoiceOptions {

  type: "choice";

  /**
   * The name of the choice to show to the user.
   */
  name: string;

  /**
   * The value of the choice.
   */
  value?: any;

  /**
   * The short form of the name of the choice.
   */
  short?: string | undefined;

  /**
   * The extra properties of the choice.
   */
  extra?: any;
}

export type RequirementDescriptor = Record<string, SimpleToken>;

/**
 * The _requirements_ for a question be be answered:
 * 
 * - if `undefined` then there are **no** requirements
 * - if a `RequirementDescriptor` is used then the `FromRequirements` will 
 * translate that into a typed key/value of types.
 */
export type Requirements = RequirementDescriptor | "no-requirements" | EmptyObject;

/**
 * **Prompt**`<TReq>`
 * 
 * the prompt message in a question can be a string but it can also be a 
 * callback function which receives the "answers" so far. Most of these
 * answers aren't yet _typed_ but any stated "requirements" for a question
 * are assumed to be met for the callback.
 */
export type Prompt<
  TRequire extends Requirements = Requirements
> = string | ((answers: FromRequirements<TRequire>) => string);

/**
 * **Answers**`<T>`
 * 
 * A dictionary of answers where the keys are the values
 * a user chooses between and then the value is what is returned
 * as that value when chosen.
 * 
 * **Note:** the original type didn't not have a generic but thought
 * it might be useful to constrain certain domains of answers. 
 */
export type Answers<
  T extends Requirements = "no-requirements"
> = FromRequirements<T>;


export type Survey = {
  questions: Question[];

}


export type QuestionOption<
  TKind extends QuestionType,
  TRequirements extends Requirements
> = 
    TKind extends "input"
    ? InputQuestionOptions<TRequirements>
    : TKind extends "number"
    ? NumberQuestionOptions<TRequirements>
    : TKind extends "confirm"
    ? ConfirmQuestionOptions<TRequirements>
    : TKind extends "list"
    ? ListQuestionOptions<TRequirements>
    : TKind extends "rawlist"
    ? RawlistQuestionOptions<TRequirements>
    : TKind extends "expand"
    ? ExpandQuestionOptions<TRequirements>
    : TKind extends "checkbox"
    ? CheckboxQuestionOptions<TRequirements>
    : TKind extends "password"
    ? PasswordQuestionOptions<TRequirements>
    : TKind extends "editor"
    ? EditorQuestionOptions<TRequirements>
    : TKind extends "branch"
    ? {}
    : {};


