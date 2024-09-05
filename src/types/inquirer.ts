import { 
  EmptyObject, 
  SimpleToken,
} from "inferred-types";
import { 
  AsyncCallback, 
  Callback, 
  FromRequirements, 
} from "./utility";
import { Question } from "./Question";


export type Separator = {
  type: "separator";
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

