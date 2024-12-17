import type {
  Ask,
  AskApi,
  Question,
  RequirementDescriptor,
} from "../types";
import {
  type DefineObject,
  type FromDefineObject,
  fromDefineObject,
  isDefineObject,
} from "inferred-types";
import { isQuestion } from "src/type-guards";
import { normalizeChoices } from "src/utils";
import { service } from "src/utils/service";

function input<TReq extends RequirementDescriptor>(req: TReq): AskApi<TReq>["input"] {
  return (
    name,
    prompt,
    opt,
  ) => service(req, "input", null)(name, prompt, opt);
}

function numeric<TReq extends RequirementDescriptor>(req: TReq): AskApi<TReq>["number"] {
  return (
    name,
    prompt,
    opt,
  ) => service(req, "number", null)(name, prompt, opt);
}

function password<TReq extends RequirementDescriptor>(req: TReq): AskApi<TReq>["password"] {
  return (
    name,
    prompt,
    opt,
  ) => service(req, "password", null)(name, prompt, opt);
}

function confirm<TReq extends RequirementDescriptor>(req: TReq): AskApi<TReq>["confirm"] {
  return (
    name,
    prompt,
    opt,
  ) => service(req, "confirm", null)(name, prompt, opt);
}

function select<TReq extends RequirementDescriptor>(req: TReq): AskApi<TReq>["select"] {
  return (
    name,
    prompt,
    choices,
    opt,
  ) => service(req, "select", normalizeChoices(choices))(name, prompt, opt);
}

function checkbox<TReq extends RequirementDescriptor>(req: TReq): AskApi<TReq>["checkbox"] {
  return (
    name,
    prompt,
    choices,
    opt,
  ) => service(req, "checkbox", normalizeChoices(choices))(name, prompt, opt);
}

function rawlist<TReq extends RequirementDescriptor>(req: TReq): AskApi<TReq>["rawlist"] {
  return (
    name,
    prompt,
    choices,
    opt,
  ) => service(req, "rawlist", normalizeChoices(choices))(name, prompt, opt);
}

function expand<TReq extends RequirementDescriptor>(req: TReq): AskApi<TReq>["expand"] {
  return (
    name,
    prompt,
    choices,
    opt,
  ) => service(req, "expand", normalizeChoices(choices))(name, prompt, opt);
}

// function editor<TReq extends RequirementDescriptor>(req: TReq): AskApi<TReq>["editor"] {
//   return (
//     name,
//     prompt,
//     opt,
//   ) => service(req, "editor", null)(name, prompt, opt);
// }

const askApi: Ask = <TReq extends RequirementDescriptor>(req: TReq) =>
  ({
    input: input(req),
    number: numeric(req),
    password: password(req),
    confirm: confirm(req),
    select: select(req) as unknown,
    checkbox: checkbox(req) as unknown,
    rawlist: rawlist(req) as unknown,
    expand: expand(req) as unknown,
    // editor: editor(req),

    withRequirements: <T extends DefineObject | Question>(req: T) => {
      const defn = isDefineObject(req)
        ? fromDefineObject(req)
        : isQuestion(req) ? req.requirements : null as never;
      return askApi(defn) as unknown as T extends DefineObject
        ? AskApi<FromDefineObject<T>>
        : T extends Question
          ? AskApi<T["requirements"]>
          : never;
    },
  } as AskApi<TReq>);

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
export const ask = askApi({});
