import {
  createFnWithProps,
  isFunction,
  isString,
  TypedFunction,
} from "inferred-types";
import inquirer from "inquirer";
import { isRequirementDescriptor } from "src/type-guards";
import {
  Ask,
  AskApi,
  Choice,
  FromRequirements,
  Prompt,
  Question,
  QuestionOption,
  QuestionParams,
  QuestionReturns,
  QuestionsWithChoices,
  QuestionType,
  RequirementDescriptor,
  Requirements,
} from "src/types/index";
import { normalizeChoices } from "src/utils";

const service =
  <
    TReq extends Requirements,
    TType extends QuestionType,
    TChoices extends TType extends QuestionsWithChoices
      ? readonly Choice[]
      : [],
  >(
    _req: TReq,
    type: TType,
    choices: TChoices,
  ) =>
  <
    TName extends string,
    TPrompt extends Prompt<TReq>,
    TOpt extends QuestionOption<
      TType,
      TReq,
      TChoices extends readonly Choice[] | [] ? TChoices : never
    >,
  >(
    name: TName,
    prompt: TPrompt,
    options?: TOpt,
  ) => {
    const fn = async <T extends QuestionParams<TReq>>(
      answers?: T | undefined,
    ) => {
      const message = isFunction(prompt) ? prompt(answers) : prompt;
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

      const question = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...question,
      } as unknown as QuestionReturns<TName, TType, TReq, TChoices>;
    };

    return createFnWithProps(fn, {
      kind: "question",
      prop: name,
      prompt: isFunction(prompt)
        ? prompt.toString()
        : isString(prompt)
          ? prompt
          : "no message provided",
      type,
    }) as unknown as Question<
      TName,
      TType,
      TPrompt extends TypedFunction ? string : TPrompt,
      typeof fn
    >;
  };

const askApi: Ask = <TReq extends Requirements>(req: TReq) =>
  ({
    input(name, prompt, opt) {
      return service(req, "input", [])(name, prompt, opt);
    },
    number(name, prompt, opt) {
      return service(req, "number", [])(name, prompt, opt);
    },
    password(name, prompt, opt) {
      return service(req, "password", [])(name, prompt, opt as any);
    },

    confirm(name, prompt, opt) {
      return service(req, "confirm", [])(name, prompt, opt);
    },
    select(name, prompt, choices, opt) {
      return service(req, "select", normalizeChoices(choices))(
        name,
        prompt,
        opt,
      );
    },
    checkbox(name, prompt, choices, opt) {
      return service(req, "checkbox", normalizeChoices(choices))(
        name,
        prompt,
        opt,
      );
    },

    rawlist(name, prompt, choices, opt) {
      return service(req, "rawlist", normalizeChoices(choices))(
        name,
        prompt,
        opt as any,
      );
    },
    expand(name, prompt, choices, opt) {
      return service(req, "expand", normalizeChoices(choices))(
        name,
        prompt,
        opt,
      );
    },

    editor(name, prompt, opt) {
      return service(req, "editor", [])(name, prompt, opt as any);
    },

    withRequirements: (isRequirementDescriptor(req)
      ? (req as Readonly<FromRequirements<TReq>>)
      : <T extends RequirementDescriptor>(req: T) =>
          askApi(req)) as TReq extends RequirementDescriptor
      ? Readonly<FromRequirements<TReq>>
      : <T extends RequirementDescriptor>(req: T) => AskApi<T>,
  }) as AskApi<TReq>;

/**
 * **ask** API surface
 *
 * Used to build/configure questions which can be asked later.
 *
 * Types include:
 *
 * - `input` - text input from user
 * - `number` - numeric input from user
 * - `password` - secret textual input from user (masked on screen)
 * - `editor` - textual input with user's editor
 * - `select` - choose 1 item from a set of "choices"
 * - `checkbox` - choose 0:M items from a set of "choices"
 * - `expand` - choose from a set of key bindings on action to take
 * - `confirm` - get a binary yes/no confirmation
 * - `search` - let user autocomplete from a set of terms
 */
export const ask = askApi("no-requirements");
