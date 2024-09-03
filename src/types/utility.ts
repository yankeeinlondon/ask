import { 
  AfterFirst,  
  As, 
  AsString,  
  Dictionary,  
  DoesExtend, 
  EmptyObject, 
  ExpandDictionary, 
  First, 
  GetEach, 
  If, 
  IsEqual, 
  IsScalar, 
  Keys, 
  Or, 
  RequiredProps, 
  SimpleType, 
  TypedFunction 
} from "inferred-types";
import {  
  Choice, 
  ChoiceArr, 
  ChoiceDict, 
  Choices, 
  Prompt, 
  QuestionType, 
  RequirementDescriptor, 
  Requirements 
} from "./inquirer";
import { Question, QuestionFn } from "./Question";


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
        ? { type: "choice"; name: First<TKeys>; value: TObj[First<TKeys>] } extends Choice<unknown>
          ? { type: "choice"; name: First<TKeys>; value: TObj[First<TKeys>] }
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
: T extends Record<string, unknown>
  ? _ObjToChoice<T, As<Keys<T>, readonly string[]>>
  : never;

/**
 * Reduces a tuple of `Choice` objects to a union type of possible types 
 * that could result from a given question.
 */
export type ChoicesOutput<T extends readonly Choice[]> = GetEach<T,"value"> extends readonly unknown[]
  ? GetEach<T, "value">[number]
  : never;

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
> = If<
  Or<[
    DoesExtend<"input", TType>,
    DoesExtend<"editor", TType>,
    DoesExtend<"password", TType>,
  ]>,
  ExpandDictionary< 
    Dictionary & FromRequirements<TRequire> & Record<TName,string> 
  >,
  TType extends "number"
    ? ExpandDictionary< 
        Dictionary & FromRequirements<TRequire> & Record<TName,number> 
      >
  : If<
      Or<[ 
        DoesExtend<"list", TType>, 
        DoesExtend<"rawlist", TType>,
        DoesExtend<"checkbox", TType>,
      ]>,
      ExpandDictionary< 
        Dictionary &
        FromRequirements<TRequire> & 
        Record<
          TName,
          ChoicesOutput<ToChoices<TChoices>>
        > 
      >,
      TType extends "confirm"
        ? ExpandDictionary<
            Dictionary & FromRequirements<TRequire> & Record<TName,boolean>
          >
        : never
    >
>;



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
  QuestionFn<TRequire, TPrompt, QuestionReturns<TName, TType, TRequire,TChoices>>
>;
