import {
  AfterFirst,
  As,
  AsString,
  EmptyObject,
  ExpandDictionary,
  FilterProps,
  First,
  IsEqual,
  IsScalar,
  IsUnionArray,
  Keys,
  RequiredProps,
  SimpleType,
  TypedFunction,
  UnionArrayToTuple,
} from "inferred-types";
import { Prompt, RequirementDescriptor, Requirements } from "./inquirer";
import {
  Choice,
  ChoiceArr,
  ChoiceDict,
  ChoiceDictProxy,
  ChoiceDictTuple,
  Choices,
  IsChoiceDictProxy,
} from "./Choice";
import {
  QuestionsWithChoices,
  QuestionsWithMultiSelect,
  QuestionType,
  QuestionTypeLookup,
} from "./QuestionType";

export type FromRequirements<T extends Requirements> =
  T extends "no-requirements"
    ? EmptyObject
    : IsEqual<T, EmptyObject> extends true
      ? EmptyObject
      : T extends RequirementDescriptor
        ? {
            [K in keyof T]: SimpleType<T[K]>;
          }
        : never;

export type HasRequiredProps<T extends Requirements> =
  T extends RequirementDescriptor
    ? Keys<RequiredProps<FromRequirements<T>>>["length"] extends 0
      ? false
      : IsEqual<
            Keys<RequiredProps<FromRequirements<T>>>["length"],
            number
          > extends true
        ? false
        : true
    : false;

type _ObjToChoice<
  TObj extends ChoiceDict,
  TKeys extends readonly string[],
  TChoices extends readonly Choice<unknown>[] = [],
> = [] extends TKeys
  ? TChoices
  : _ObjToChoice<
      TObj,
      AfterFirst<TKeys>,
      [
        ...TChoices,
        First<TKeys> extends keyof TObj
          ? TObj[First<TKeys>] extends ChoiceDictTuple
            ? {
                type: "choice";
                name: First<TKeys>;
                value: TObj[First<TKeys>][0];
                description: TObj[First<TKeys>][1];
              } // was a ChoiceDictTuple
            : IsChoiceDictProxy<TObj[First<TKeys>]> extends true
              ? As<
                  FilterProps<
                    {
                      type: "choice";
                      name: First<TKeys>;
                      value: As<TObj[First<TKeys>], ChoiceDictProxy>["value"];
                      checked: As<
                        TObj[First<TKeys>],
                        ChoiceDictProxy
                      >["checked"];
                      disabled: As<
                        TObj[First<TKeys>],
                        ChoiceDictProxy
                      >["disabled"];
                      short: As<TObj[First<TKeys>], ChoiceDictProxy>["short"];
                      key: As<TObj[First<TKeys>], ChoiceDictProxy>["key"];
                      description: As<
                        TObj[First<TKeys>],
                        ChoiceDictProxy
                      >["description"];
                    },
                    unknown,
                    "equals"
                  >,
                  Choice
                >
              : {
                    type: "choice";
                    name: First<TKeys>;
                    value: TObj[First<TKeys>];
                  } extends Choice<unknown>
                ? {
                    type: "choice";
                    name: First<TKeys>;
                    value: TObj[First<TKeys>];
                  }
                : never
          : never,
      ]
    >;

type _ToChoicesArr<T extends Choices> = {
  [K in keyof T]: IsScalar<T[K]> extends true
    ? { type: "choice"; name: `${AsString<T[K]>}`; value: T[K] }
    : T[K] extends Choice<unknown>
      ? T[K]
      : T[K] extends ChoiceDict
        ? _ObjToChoice<T[K], As<Keys<T[K]>, readonly string[]>>
        : never;
};

export type _ToChoices<T extends Choices> = T extends ChoiceArr
  ? IsUnionArray<_ToChoicesArr<T>> extends true
    ? UnionArrayToTuple<_ToChoicesArr<T>>
    : _ToChoicesArr<T>
  : T extends ChoiceDict
    ? Keys<T> extends readonly string[]
      ? _ObjToChoice<T, Keys<T>>
      : never
    : never;

/**
 * converts all the _representations_ of choices into a tuple of
 * `Choice` objects.
 */
export type ToChoices<T extends Choices> =
  _ToChoices<T> extends readonly Choice[]
    ? IsEqual<_ToChoices<T>["length"], number> extends true
      ? _ToChoices<UnionArrayToTuple<T>>
      : _ToChoices<T>
    : never;

type _ToChoiceValues<T extends readonly Choice[]> = {
  [K in keyof T]: T[K] extends Choice ? T[K]["value"] : never;
};

/**
 * converts `Choices` into the _values_ which those `Choices`
 * represent.
 */
export type ToChoiceValues<T extends Choices> = _ToChoiceValues<ToChoices<T>>;

type _ChoicesOutput<T extends readonly Choice[]> = {
  [K in keyof T]: T[K]["value"];
}[number];

/**
 * Reduces a tuple of `Choice` objects to a union type of possible types
 * that could result from a given question.
 */
export type ChoicesOutput<
  T extends readonly Choice[],
  TType extends QuestionType,
> = TType extends QuestionsWithMultiSelect
  ? Array<_ChoicesOutput<T>>
  : _ChoicesOutput<T>;

export type Callback<TParams extends readonly unknown[], TReturn> = <
  T extends TParams,
>(
  ...params: T
) => TReturn;

export type AsyncCallback<TParams extends readonly unknown[], TReturn> = <
  T extends TParams,
>(
  ...params: T
) => Promise<TReturn>;

export type ChoicesByType<T extends QuestionType> =
  T extends QuestionsWithChoices ? readonly Choice[] : never;

export type DescribeQuestion<TReq extends Requirements> =
  TReq extends EmptyObject
    ? `(answers?: Answers) => Answers `
    : `(answers: Answers) => Answers`;

/**
 * returns the _type_ of a set of choices
 * in a question; typically a union type but for types
 * have the ability to select multiple choices it will
 * be an array of the union type.
 */
export type ChoiceReturns<
  //
  TName extends string,
  TType extends QuestionType,
  TChoices extends Choices,
> = Record<
  TName,
  ToChoices<TChoices> extends readonly Choice[]
    ? TType extends QuestionsWithMultiSelect
      ? {
          [K in keyof ToChoices<TChoices>]: ToChoices<TChoices>[K] extends Choice
            ? ToChoices<TChoices>[K]["value"]
            : never;
        }[number][]
      : {
          [K in keyof ToChoices<TChoices>]: ToChoices<TChoices>[K] extends Choice
            ? ToChoices<TChoices>[K]["value"]
            : never;
        }[number]
    : never
>;

/**
 * Takes the existing answers hash and combines with a question's
 * input; which represents:
 *
 * - the questions `name` will be added to `Answers` with an appropriate
 * type.
 * - if the question has "requirements" defined than these will be added
 * in as well
 */
export type QuestionReturns<
  TName extends string,
  TType extends QuestionType,
  TRequire extends Requirements,
  TChoices extends TType extends QuestionsWithChoices
    ? Choices
    : [] = TType extends QuestionsWithChoices ? Choices : [],
> = TType extends QuestionsWithChoices
  ? ExpandDictionary<
      Record<string, unknown> &
        FromRequirements<TRequire> &
        ChoiceReturns<TName, TType, TChoices>
    >
  : ExpandDictionary<
      Record<string, unknown> &
        FromRequirements<TRequire> &
        Record<TName, QuestionTypeLookup<TType>>
    >;

/**
 * type utility which determines what a Question's parameters
 * should be.
 */
export type QuestionParams<TReq extends Requirements> =
  TReq extends RequirementDescriptor
    ? HasRequiredProps<TReq> extends true
      ? [
          answers: ExpandDictionary<
            FromRequirements<TReq> & Record<string, unknown>
          >,
        ]
      : [
          answers?: ExpandDictionary<
            FromRequirements<TReq> & Record<string, unknown>
          >,
        ]
    : [answers?: Record<string, unknown>] | [];

export type AsPrompt<
  TReq extends Requirements,
  TPrompt extends Prompt<TReq>,
> = TPrompt extends TypedFunction
  ? ReturnType<TPrompt>
  : TPrompt extends string
    ? TPrompt
    : never;
