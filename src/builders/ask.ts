import { 
  createFnWithProps,
  isFunction,
  isObject,
  keysOf,
  TypedFunction, 
} from "inferred-types";
import inquirer from "inquirer";
import {  
  Ask, 
  Choices, 
  FromRequirements, 
  Prompt, 
  Question, 
  QuestionFn, 
  QuestionOption, 
  QuestionParams, 
  QuestionReturns, 
  Requirements,
} from "src/types/index";
import { normalizeChoices } from "src/utils";


const askApi: Ask = <TReq extends Requirements>(_req: TReq) => ({
  input<
  TName extends string, 
  TPrompt extends Prompt<TReq>,
  TOpt extends QuestionOption<"input", TReq>
>(name: TName, prompt: TPrompt, opt: TOpt) {
    let fn: TypedFunction & { [key: string]: unknown } = (async <T extends QuestionParams<TReq>>(...args: T) => {
      let answers = isObject(args[0])
        ? args[0]
        : {};
      
        const message = isFunction(prompt) ? prompt(answers) : prompt;
        const config = {
          ...opt,
          type: "input",
          name,
          message
        };
        const answer = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...answer
      };
    }) as unknown as QuestionFn<TReq, QuestionReturns<TName,"input",TReq>>;


    fn.kind = "question";
    fn.question = name;
    fn.prompt = isFunction(prompt) ? prompt.toString() : prompt;
    fn.type = "input";


    return fn;
  },
  number(name, prompt, opt) {
    return async <T extends FromRequirements<TReq>>(answers?: T | undefined) => {
      const message = isFunction(prompt) ? prompt(answers) : prompt;
      const config = {
        ...opt,
        type: "number",
        name,
        message
      };

      const answer = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...answer
      };
    }
  },
  list(name, prompt, choices, opt) {
    return async <T extends FromRequirements<TReq>>(answers?: T | undefined) => {
      const message = isFunction(prompt) ? prompt(answers) : prompt;
      const config = {
        ...opt,
        type: "list",
        name,
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
        name,
        message,
        choices: normalizeChoices(choices, opt?.default)
      };

      const answer = await inquirer.prompt(config as any);

      return {
        ...answers,
        ...answer
      };
    }
  }

})

export const ask = askApi("no-requirements");
