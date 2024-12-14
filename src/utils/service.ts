import type { Dictionary } from "inferred-types";
import type {
  Choice,
  DynamicQuestionProp,
  FromRequirements,
  QuestionFn,
  QuestionOption,
  QuestionParams,
  QuestionProps,
  QuestionReturns,
  QuestionType,
  Requirements,
} from "src/types";
import { createFnWithPropsExplicit, isFunction } from "inferred-types";
import inquirer from "inquirer";
import { fromRequirements } from "./fromRequirements";
import { normalizeChoices } from "./normalizeChoices";

/**
 * A higher order function which first takes:
 *
 * - requirements, question type, and choices
 *
 * The next call adds in:
 *
 * - the property name for the question
 * - the prompt
 * - options
 *
 * The output is a fully formed `Question`
 */
export function service<
  TReq extends Requirements,
  TType extends QuestionType,
  TChoices extends readonly Choice[] | null,
>(requirements: TReq, type: TType, choices: TChoices) {
  return <
    TName extends string,
    TPrompt extends string,
    TOpt extends QuestionOption<
      TType,
      TReq,
      TChoices
    >,
  >(
    name: TName,
    prompt: TPrompt,
    options?: TOpt,
  ) => {
    type Fn = QuestionFn<TName, TType, TReq, TChoices>;

    const fn: Fn = async <T extends QuestionParams<TReq>>(
      ...params: T
    ) => {
      const answers = params[0]
        ? params[0] as Dictionary
        : {};

      const message = (
        isFunction(prompt) ? (prompt as any)(answers) : prompt
      );

      const config = {
        ...(options || {}),
        type,
        name,
        message,
        ...(choices
          ? {
              choices: normalizeChoices(
                choices, //
                type === "checkbox"
                  ? (options?.default as unknown[])
                  : undefined,
              ),
            }
          : {}),
      };
      // when clause checked at survey level
      delete config.when;

      const question = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...question,
      } as unknown as QuestionReturns<TName, TType, TReq, TChoices>;
    }; // end of fn

    const when: DynamicQuestionProp<boolean, FromRequirements<TReq>> | boolean = options?.when
      ? options.when
      : true;

    type Props = QuestionProps<
      TName,
      TType,
      TPrompt,
      TReq,
      TChoices
    >;

    const props: Props = {
      kind: "question",
      prop: name,
      requirements: fromRequirements(requirements),
      prompt,
      type,
      choices,
      when,
    };

    return createFnWithPropsExplicit<Fn, Props>(fn, props);
  };
}
