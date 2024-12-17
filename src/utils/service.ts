import type { TypedFunction } from "inferred-types";
import type {
  Choice,
  Question,
  QuestionFn,
  QuestionOption,
  QuestionParams,
  QuestionProps,
  QuestionType,
  RequirementDescriptor,
  When,
} from "src/types";
import { createFnWithPropsExplicit, isFunction, isUndefined } from "inferred-types";
import inquirer from "inquirer";
import { normalizeChoices } from "./normalizeChoices";

export function service<
  TReq extends RequirementDescriptor,
  TType extends QuestionType,
  TChoices extends readonly Choice[] | null,
>(requirements: TReq, type: TType, choices: TChoices) {
  return <
    TName extends string,
    TPrompt extends string,
    TOpt extends QuestionOption<TType, TReq, TChoices> | undefined, // Relaxed type
  >(
    name: TName,
    prompt: TPrompt,
    options?: TOpt,
  ) => {
    type Fn = QuestionFn<TName, TType, TReq, TChoices>;
    // @ts-ignore
    const opt: any = isUndefined(options) ? { opt: true } : options;

    const fn = async <T extends QuestionParams<TReq>>(...params: T) => {
      const answers = params[0] || {};

      const message = isFunction(prompt) ? (prompt as any)(answers) : prompt;

      const config = {
        type,
        name,
        message,
        ...(choices ? { choices: normalizeChoices(choices) } : {}),
        ...opt,
      };

      if ("when" in config)
        delete config.when;

      const question = await inquirer.prompt(config as any);
      return { ...answers, ...question };
    };

    const when = (opt?.when ?? true) as When<TReq>; // Explicitly cast

    type Props = QuestionProps<TName, TType, TPrompt, TReq, TChoices, When<TReq>>;

    const props: Props = {
      kind: "question",
      prop: name,
      requirements,
      prompt,
      type,
      choices,
      when,
      returns: null as unknown as Props["returns"],
      ask: fn as Fn,
    };

    type Rtn = Question<
      TName,
      TType,
      TPrompt,
      TReq,
      TChoices,
      When<TReq>
    >["returns"];

    const directFn = async <T extends QuestionParams<TReq>>(...params: T) => {
      const p: readonly unknown[] = params as unknown as readonly unknown[];
      const answers = (await (fn as TypedFunction)(...p)) as unknown as Rtn;

      return answers[name];
    };

    return createFnWithPropsExplicit<TypedFunction, Props>(directFn as TypedFunction, props) as unknown as Question<
      TName,
      TType,
      TPrompt,
      TReq,
      TChoices,
      When<TReq>
    >;
  };
}
