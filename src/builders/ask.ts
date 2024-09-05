import { 
  isFunction
} from "inferred-types";
import inquirer from "inquirer";
import { isRequirementDescriptor } from "src/type-guards";
import {  
  Ask, 
  AskApi, 
  FromRequirements, 
  Prompt, 
  QuestionType, 
  RequirementDescriptor, 
  Requirements,
} from "src/types/index";
import { normalizeChoices } from "src/utils";

const service = <
  TType extends QuestionType,
  TReq extends Requirements
>(type: TType, req: TReq) => 
  <TProp extends string>(
    prop: TProp, 
    prompt: Prompt<TReq>, 
    opt
) => {

}


const askApi: Ask = <TReq extends Requirements>(req: TReq) => ({
  input(name, prompt, opt) {
    return async <T extends FromRequirements<TReq>>(answers?: T | undefined) => {
      const message = isFunction(prompt) ? prompt(answers) : prompt;
      const config = {
        ...opt,
        type: "input",
        prop:name,
        message
      };

      const answer = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...answer
      };
    }
  },
  number(name, prompt, opt) {
    return async <T extends FromRequirements<TReq>>(answers?: T | undefined) => {
      const message = isFunction(prompt) ? prompt(answers) : prompt;
      const config = {
        ...opt,
        type: "number",
        prop:name,
        message
      };

      const answer = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...answer
      };
    }
  },
  confirm(name, prompt, opt) {
    return async <T extends FromRequirements<TReq>>(answers?: T | undefined) => {
      const message = isFunction(prompt) ? prompt(answers) : prompt;
      const config = {
        ...opt,
        type: "confirm",
        prop:name,
        message
      };

      const answer = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...answer
      };
    }
  },
  select(name, prompt, choices, opt) {
    return async <T extends FromRequirements<TReq>>(answers?: T | undefined) => {
      const message = isFunction(prompt) ? prompt(answers) : prompt;
      const config = {
        ...opt,
        type: "select",
        prop:name,
        message,
        choices: normalizeChoices(choices)
      };

      const answer = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...answer
      };
    }
  },
  checkbox(name, prompt, choices, opt) {
    return async <T extends FromRequirements<TReq>>(answers?: T | undefined) => {
      const message = isFunction(prompt) ? prompt(answers) : prompt;
      const config = {
        ...opt,
        type: "checkbox",
        prop:name,
        message,
        choices: normalizeChoices(choices, opt?.default)
      };

      const answer = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...answer
      };
    }
  },

  rawlist(name, prompt, choices, opt) {
    return async <T extends FromRequirements<TReq>>(answers?: T | undefined) => {
      const message = isFunction(prompt) ? prompt(answers) : prompt;
      const config = {
        ...opt,
        type: "rawlist",
        prop:name,
        message,
        choices: normalizeChoices(choices)
      };

      const answer = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...answer
      };
    }
  },
  expand(name, prompt, opt) {
    return async <T extends FromRequirements<TReq>>(answers?: T | undefined) => {
      const message = isFunction(prompt) ? prompt(answers) : prompt;
      const config = {
        ...opt,
        type: "expand",
        prop:name,
        message
      };

      const answer = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...answer
      };
    }
  },

  password(name, prompt, opt) {
    return async <T extends FromRequirements<TReq>>(answers?: T | undefined) => {
      const message = isFunction(prompt) ? prompt(answers) : prompt;
      const config = {
        ...opt,
        type: "password",
        prop:name,
        message
      };

      const answer = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...answer
      };
    }
  },

  editor(name, prompt, opt) {
    return async <T extends FromRequirements<TReq>>(answers?: T | undefined) => {
      const message = isFunction(prompt) ? prompt(answers) : prompt;
      const config = {
        ...opt,
        type: "editor",
        prop:name,
        message
      };

      const answer = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...answer
      };
    }
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
