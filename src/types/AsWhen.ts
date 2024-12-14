import type { Choice } from "./Choice";
import type { Requirements } from "./inquirer";
import type { QuestionOption } from "./options";
import type { QuestionType } from "./QuestionType";

type Opt<
  TType extends QuestionType,
  TReq extends Requirements,
  TChoices,
> = TChoices extends null
  ? QuestionOption<TType, TReq>
  : TChoices extends readonly Choice[]
    ? QuestionOption<TType, TReq, TChoices>
    : never;

/**
 * type utility which ensures a `Questions` functionvert Requirements and Options into
 * a valid "when" value.
 */
export type AsWhen<
  TType extends QuestionType,
  TReq extends Requirements,
  TChoices = null,
> = Opt<TType, TReq, TChoices>["when"] extends undefined
  ? true
  : Opt<TType, TReq, TChoices>["when"];
