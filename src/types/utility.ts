import { 
  AfterFirst,  
  As, 
  AsString,  
  EmptyObject, 
  ExpandDictionary, 
  FilterProps, 
  First, 
  GetEach, 
  IsEqual, 
  IsScalar, 
  Keys, 
  RequiredProps,  
  SimpleType, 
  TypedFunction,
} from "inferred-types";
import {  
  Prompt, 
  RequirementDescriptor, 
  Requirements 
} from "./inquirer";
import { Question, QuestionFn } from "./Question";
import {  
  Choice,
  ChoiceArr, 
  ChoiceDict, 
  ChoiceDictProxy, 
  ChoiceDictTuple, 
  Choices, 
  IsChoiceDictProxy 
} from "./Choice";
import { QuestionType } from "./QuestionType";


export type FromRequirements<T extends Requirements> = T extends "no-requirements"
? EmptyObject
: IsEqual<T,EmptyObject> extends true
    ? EmptyObject    
: T extends RequirementDescriptor
  ? {
      [K in keyof T]: SimpleType<T[K]>
    }
    : never;

export type HasRequiredProps<T extends Requirements>  = T extends RequirementDescriptor
? Keys<RequiredProps<FromRequirements<T>>>["length"] extends 0
  ? false
  : IsEqual<Keys<RequiredProps<FromRequirements<T>>>["length"], number> extends true
  ? false
  : true
: false;



type _ObjToChoice<
  TObj extends ChoiceDict,
  TKeys extends readonly string[],
  TChoices extends readonly Choice<unknown>[] = []
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
            description: TObj[First<TKeys>][1] 
          } // was a ChoiceDictTuple
          : IsChoiceDictProxy<TObj[First<TKeys>]> extends true
          ? As<FilterProps<{ 
            type: "choice"; 
            name: First<TKeys>;
            value: As<TObj[First<TKeys>],ChoiceDictProxy>["value"];
            checked: As<TObj[First<TKeys>],ChoiceDictProxy>["checked"];
            disabled: As<TObj[First<TKeys>],ChoiceDictProxy>["disabled"];
            short: As<TObj[First<TKeys>],ChoiceDictProxy>["short"];
            key: As<TObj[First<TKeys>],ChoiceDictProxy>["key"];
            description: As<TObj[First<TKeys>],ChoiceDictProxy>["description"]
          }, unknown, "equals">, Choice>
          : { 
              type: "choice"; 
              name: First<TKeys>; 
              value: TObj[First<TKeys>] 
            } extends Choice<unknown>
          ? { 
              type: "choice"; 
              name: First<TKeys>; 
              value: TObj[First<TKeys>] 
            }
          : never
        : never
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
}

/**
 * converts all the _representations_ of choices into a tuple of
 * `Choice` objects.
 */
export type ToChoices<T extends Choices> = T extends ChoiceArr
? _ToChoicesArr<T>
: T extends ChoiceDict
  ? Keys<T> extends readonly string[]
    ? _ObjToChoice<T, Keys<T>>
    : never
  : never;

/**
 * Reduces a tuple of `Choice` objects to a union type of possible types 
 * that could result from a given question.
 */
export type ChoicesOutput<T extends readonly Choice[]> = {
  [K in keyof T]: T[K]["value"]
}[number]

export type Callback<
  TParams extends readonly unknown[],
  TReturn
> = <T extends TParams>(...params: T) => TReturn;

export type AsyncCallback<
  TParams extends readonly unknown[],
  TReturn
> = <T extends TParams>(...params: T) => Promise<TReturn>;


export type DescribeQuestion<
TReq extends Requirements
> = TReq extends EmptyObject
? `(answers?: Answers) => Answers `
: `(answers: Answers) => Answers`;

/**
 * returns the _type_ (typically a union type) of a set of choices
 * in a question.
 */
type ChoiceRecord<
  TName extends string, 
  TChoices extends Choices
> = Record<
  TName,
  ToChoices<TChoices> extends readonly Choice[]
    ? GetEach<ToChoices<TChoices>, "value"> extends readonly unknown[]
      ? GetEach<ToChoices<TChoices>, "value">[number]
      : never
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
  TChoices extends Choices = []
> = TType extends "input"
? ExpandDictionary< 
    Record<string, unknown> & FromRequirements<TRequire> & Record<TName,string> 
  >
: TType extends "editor"
? ExpandDictionary< 
    Record<string, unknown> & FromRequirements<TRequire> & Record<TName,string> 
  >
: TType extends "password"
  ? ExpandDictionary< 
      Record<string, unknown> & FromRequirements<TRequire> & Record<TName,string> 
    >
: TType extends "number"
  ? ExpandDictionary< 
      Record<string, unknown> & FromRequirements<TRequire> & Record<TName,number> 
    >
: TType extends "confirm"
  ? ExpandDictionary< 
      Record<string, unknown> & FromRequirements<TRequire> & Record<TName,boolean> 
    >
: TType extends "select"
  ? ExpandDictionary< 
      Record<string, unknown> & FromRequirements<TRequire> & ChoiceRecord<TName,TChoices> 
    >
: TType extends "rawlist"
  ? ExpandDictionary< 
      Record<string, unknown> & FromRequirements<TRequire> & ChoiceRecord<TName,TChoices> 
    >
: TType extends "checkbox"
  ? ExpandDictionary< 
      Record<string, unknown> & FromRequirements<TRequire> & ChoiceRecord<TName,TChoices>[]
    >
: never;


/**
 * type utility which determines what a Question's parameters 
 * should be.
 */
export type QuestionParams<
  TReq extends Requirements,
> = TReq extends RequirementDescriptor
? HasRequiredProps<TReq> extends true
  ? [answers: ExpandDictionary<
      FromRequirements<TReq> & 
      Record<string,  unknown>
    >]
  : [answers?: ExpandDictionary< 
      FromRequirements<TReq> &
      Record<string,  unknown>
    >]
: [ answers?: Record<string,  unknown> ] | [];


export type AsPrompt<
  TReq extends Requirements,
  TPrompt extends Prompt<TReq>
> = TPrompt extends TypedFunction
? ReturnType<TPrompt>
: TPrompt extends string
? TPrompt
: never;



export type AsQuestion<
  TName extends string,
  TType extends QuestionType,
  TRequire extends Requirements,
  TPrompt extends Prompt<TRequire>,
  TChoices extends Choices = [],
> = Question<
  TName,
  TType,
  AsPrompt<TRequire, TPrompt>,
  QuestionFn<
    TRequire, 
    QuestionReturns<TName, TType, TRequire, TChoices>
  >
>;
