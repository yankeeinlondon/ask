import { EmptyObject, isFunction } from "inferred-types";
import inquirer from "inquirer";
import {  Ask } from "src/types/index";


// const hasRequirements = <T>(val: T) => {
//   // 
// }


const askApi: Ask = (req) => ({
  input: async (name, prompt, opt) => {
    const config = {
      message: prompt,
      type: "input",
      ...opt
    } as any;

    const answer = await inquirer.prompt({name, ...config});



    // if (hasRequirements(config) || isFunction(prompt)) {
    //   return <T extends 
    // }

    return answer;
  }

})

export const ask = askApi("no-requirements");
