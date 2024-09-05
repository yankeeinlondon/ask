import { 
  createFnWithProps,
  isFunction,
  isString,
  Never
} from "inferred-types";
import inquirer from "inquirer";
import { isRequirementDescriptor } from "src/type-guards";
import {  
  Ask, 
  AskApi, 
  Choices, 
  ChoicesByType, 
  FromRequirements, 
  Prompt, 
  QuestionOption, 
  QuestionType, 
  RequirementDescriptor, 
  Requirements,
} from "src/types/index";
import { normalizeChoices } from "src/utils";



const service = <
  TReq extends Requirements,
  TType extends QuestionType,
  TChoices extends Choices | undefined
>(_req: TReq, type: TType, choices?: TChoices) => <
  TName extends string,
  TPrompt extends Prompt<TReq>,
  TOpt extends QuestionOption<TType, TReq, TChoices> | undefined
>(
  name: TName,
  prompt: TPrompt,
  options?: TOpt,
) => {
  const fn = async <T extends FromRequirements<TReq>>(answers?: T | undefined) => {
    const message = isFunction(prompt) ? prompt(answers) : prompt;
    const config = {
      ...(options || {}),
      type,
      name,
      message,
      ...(
        choices
          ? {choices: normalizeChoices(choices, type === "checkbox" ? options?.default as string[] : undefined)}
          : {}
      )
    };

    const question = await inquirer.prompt(config as any);

    return {
      ...answers,
      ...question
    };
  };

  return createFnWithProps(fn, {
    kind: "question",
    prop: name,
    prompt: isFunction(prompt) ? prompt.toString() : isString(prompt) ? prompt : "no message provided",
    type,
    choices: (
      choices
        ? normalizeChoices(choices)
        : Never
    ) as ChoicesByType<TType> & TChoices
  })
}

const askApi: Ask = <TReq extends Requirements>(req: TReq) => ({
  input(name, prompt, opt) {
    return service(req, "input")(name,prompt,opt);
  },
  number(name, prompt, opt) {
    return service(req, "number")(name,prompt,opt);
  },
  password(name, prompt, opt) {
    return service(req, "password")(name,prompt, opt as any);
  },

  confirm(name, prompt, opt) {
    return service(req, "confirm")(name, prompt,opt);
  },
  select(name, prompt, choices, opt) {
    return service(req, "select", choices)(name, prompt, opt);
  },
  checkbox(name, prompt, choices, opt) {
    return service(req, "checkbox", choices)(name, prompt, opt);
  },

  rawlist(name, prompt, choices, opt) {
    return service(req, "rawlist", choices)(name, prompt, opt);
  },
  expand(name, prompt, choices, opt) {
    return service(req, "expand", choices)(name, prompt, opt);
  },


  editor(name, prompt, opt) {
    return service(req, "editor")(name, prompt, opt);
  },

  withRequirements: (
    isRequirementDescriptor(req) 
      ? req as Readonly<FromRequirements<TReq>>
      : <T extends RequirementDescriptor>(req: T) => askApi(req)
  ) as TReq extends RequirementDescriptor
  ? Readonly<FromRequirements<TReq>>
  : <T extends RequirementDescriptor>(req: T) => AskApi<T>,


} as AskApi<TReq>)

export const ask = askApi("no-requirements");
