import { DoesExtend, If } from "inferred-types";
import { Choice, Choices } from "./Choice";
import {
  Answers,
  DynamicQuestionProp,
  RequirementDescriptor,
  Requirements,
  Separator,
} from "./inquirer";
import { QuestionType } from "./QuestionType";
import { ChoicesOutput } from "./utility";

export type BaseOptions<TBaseType, TRequire extends Requirements> = {
  /** the default value to start with */
  default?:
    | TBaseType
    | If<
        DoesExtend<TRequire, RequirementDescriptor>, //
        <T extends Answers<TRequire>>(answers: T) => TBaseType | undefined,
        never
      >;
  /** boolean flag indicating if a value is _required_ from this question */
  required?: boolean;

  /**
   * Force to prompt the question if the answer already exists.
   */
  askAnswered?: boolean;

  validate?: (
    value: TBaseType,
  ) => boolean | TBaseType | Promise<TBaseType | boolean>;

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
};

/** options for a text input question */
export type InputOptions<TRequire extends Requirements> = BaseOptions<
  string,
  TRequire
> & {
  /**
   * Transform/Format the raw value entered by the user. Once the prompt
   * is completed, isFinal will be true. This function is purely visual,
   * modify the answer in your code if needed.
   */
  transformer?(
    input: string,
    flags?: {
      isFinal?: boolean | undefined;
    },
  ): string;

  /**
   * On submit, validate the filtered answered content. When returning a string,
   * it'll be used as the error message displayed to the user. Note: returning
   * a rejected promise, we'll assume a code error happened and crash.
   */
  validate?(input: string): boolean | string | Promise<string | boolean>;

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
};

export type NumberOptions<TRequire extends Requirements> = BaseOptions<
  number,
  TRequire
> & {
  min?: number;
  max?: number;
  step?: number | "any";
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
};

export type ConfirmOptions<TRequire extends Requirements> = BaseOptions<
  boolean,
  TRequire
> & {
  /**
   * Transform the prompt printed message to a custom string
   */
  transformer?(val: boolean): string;

  /** Customize look of the prompt.  */
  theme?: {
    prefix: string;
    spinner: {
      interval: number;
      frames: string[];
    };
    style: {
      answer: (text: string) => string;
      message: (text: string) => string;
      defaultAnswer: (text: string) => string;
    };
  };
};

export type SearchOptions<TRequire extends Requirements> = BaseOptions<
  string,
  TRequire
> & {
  /**
   * A function which determines the _choices_ relevant to the search term.
   */
  source(term: string | void): Promise<Choice[]>;
  /**
   * By default, lists of choice longer than 7 will be paginated.
   * Use this option to control how many choices will appear on the screen
   * at once.
   */
  pageSize?: number;
  /**
   * On submit, validate the answer. When returning a string, it'll be used
   * as the error message displayed to the user. Note: returning a rejected
   * promise, we'll assume a code error happened and crash.
   */
  validate?(val: string): boolean | string | Promise<string | boolean>;

  /** Customize look of the prompt. */
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
      searchTerm: (text: string) => string;
    };
    icon: {
      cursor: string;
    };
    helpMode: "always" | "never" | "auto";
  };
};

export type SelectOptions<
  TRequire extends Requirements,
  TChoices extends readonly Choice[],
> = BaseOptions<ChoicesOutput<TChoices, "select">, TRequire> & {
  /**
   * By default, lists of choice longer than 7 will be paginated.
   * Use this option to control how many choices will appear on the
   * screen at once.
   */
  pageSize?: number;
  /**
   * Defaults to true. When set to false, the cursor will be constrained
   * to the top and bottom of the choice list without looping.
   */
  loop?: boolean;
  theme?: {
    prefix: string;
    spinner: {
      interval: number;
      frames: string[];
    };
    style?: {
      answer: (text: string) => string;
      message: (text: string) => string;
      error: (text: string) => string;
      help: (text: string) => string;
      highlight: (text: string) => string;
      description: (text: string) => string;
      disabled: (text: string) => string;
    };
    icon?: {
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
    helpMode?: "always" | "never" | "auto";
  };
};

export type PasswordOptions<TRequire extends Requirements> = BaseOptions<
  string,
  TRequire
> & {
  mask?: boolean | string;
  /**
   * On submit, validate the filtered answered content. When returning a string,
   * it'll be used as the error message displayed to the user. Note: returning
   * a rejected promise, we'll assume a code error happened and crash.
   */
  validate?: (password: string) => boolean | string | Promise<boolean | string>;

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
    };
  };
};

export type RawlistOptions<
  TRequire extends Requirements,
  TChoices extends readonly Choice[],
> = BaseOptions<ChoicesOutput<TChoices, "rawlist">, TRequire> & {
  /**
   * Customize look of the prompt:
   */
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
      highlight: (text: string) => string;
    };
  };
};

export type EditorOptions<TReq extends Requirements> = BaseOptions<
  string,
  TReq
> & {
  /**
   * On submit, validate the content. When returning a string, it'll be used
   * as the error message displayed to the user. Note: returning a rejected
   * promise, we'll assume a code error happened and crash.
   */
  validate?(val: string): boolean | string | Promise<string | boolean>;
  /**
   * The file extension of the file being edited. Adding this will add color
   * highlighting to the file content in most editors.
   *
   * This property is _not_ required but will default to `.txt` if not
   * specified.
   */
  postfix?: string;
  /**
   * Open the editor automatically without waiting for the user to press enter.
   * Note that this mean the user will not see the question! So make sure you have
   * a default value that provide guidance if it's unclear what input is expected.
   */
  waitForUseInput?: boolean;
  theme?: {
    prefix: string;
    spinner: {
      interval: number;
      frames: string[];
    };
    style: {
      message: (text: string) => string;
      error: (text: string) => string;
      help: (text: string) => string;
      key: (text: string) => string;
    };
  };
};

export type ExpandOptions<
  TReq extends Requirements,
  TChoices extends readonly Choice[],
> = BaseOptions<ChoicesOutput<TChoices, "expand">, TReq> & {
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
  };
};

export type CheckboxOptions<
  TReq extends Requirements,
  TChoices extends readonly Choice[],
> = Omit<BaseOptions<unknown[], TReq>, "default"> & {
  default: ChoicesOutput<TChoices, "checkbox">;
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
  validate?(choices: Choice[]): Promise<boolean | string>;

  theme?: {
    prefix: string;
    spinner?: {
      interval: number;
      frames: string[];
    };
    style?: {
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
      icon?: {
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
      helpMode?: "always" | "never" | "auto";
    };
  };
};

/**
 * lookup utility which matches the appropriate _options_
 * for a given command.
 */
export type QuestionOption<
  TKind extends QuestionType,
  TRequirements extends Requirements,
  TChoices extends readonly Choice[] | [] = [],
> = TKind extends "input"
  ? InputOptions<TRequirements>
  : TKind extends "number"
    ? NumberOptions<TRequirements>
    : TKind extends "confirm"
      ? ConfirmOptions<TRequirements>
      : TKind extends "select"
        ? TChoices extends Choices
          ? SelectOptions<TRequirements, TChoices>
          : never
        : TKind extends "rawlist"
          ? TChoices extends Choices
            ? RawlistOptions<TRequirements, TChoices>
            : never
          : TKind extends "expand"
            ? TChoices extends Choices
              ? ExpandOptions<TRequirements, TChoices>
              : never
            : TKind extends "checkbox"
              ? TChoices extends Choices
                ? CheckboxOptions<TRequirements, TChoices>
                : never
              : TKind extends "password"
                ? PasswordOptions<TRequirements>
                : TKind extends "editor"
                  ? EditorOptions<TRequirements>
                  : TKind extends "search"
                    ? SearchOptions<TRequirements>
                    : never;
