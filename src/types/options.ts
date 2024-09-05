import { Choice } from "./Choice";
import { Answers, DynamicQuestionProp, Requirements, Separator } from "./inquirer";
import { QuestionType } from "./QuestionType";

type BaseQuestionOptions<
  TBaseType,
  TRequire extends Requirements
> = {

  /** the default value to start with */
  default?: TBaseType;
  /** boolean flag indicating if a value is _required_ from this question */
  required?: boolean;

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


export type InputQuestionOptions<
  TRequire extends Requirements
> = BaseQuestionOptions<string, TRequire>;


export type NumberQuestionOptions<
  TRequire extends Requirements
> = BaseQuestionOptions<number, TRequire> & {
  min?: number;
  max?: number;
  step?: number | 'any';
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
    };
  };
}

export type ConfirmQuestionOptions<
  TRequire extends Requirements
> = BaseQuestionOptions<string, TRequire>;


export type SelectQuestionOptions<
  TRequire extends Requirements
> = BaseQuestionOptions<string, TRequire> & {
  /**
   * By default, lists of choice longer than 7 will be paginated. 
   * Use this option to control how many choices will appear on the 
   * screen at once.
   */
  pageSize?: number,
  /**
   * Defaults to true. When set to false, the cursor will be constrained 
   * to the top and bottom of the choice list without looping.
   */
  loop?: boolean,
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
      help: (text: string) => string;
      highlight: (text: string) => string;
      description: (text: string) => string;
      disabled: (text: string) => string;
    };
    icon: {
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
  }
};


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

export type  ExpandQuestionOptions<T extends Requirements> = BaseQuestionOptions<string, T> & {
  /** Expand the choices by default */
  expanded?: boolean;

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
      highlight: (text: string) => string;
    };
  }
};

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

  /**
   * When set to true, ensures at least one choice must be selected.
   */
  required?: boolean;

  /**
   * On submit, validate the choices. When returning a string, it'll be 
   * used as the error message displayed to the user. Note: returning a 
   * rejected promise, we'll assume a code error happened and crash.
   */
  validate?: (choices: Choice[]) =>  Promise<boolean | string>;

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
  }
};



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
    : TKind extends "select"
    ? SelectQuestionOptions<TRequirements>
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


