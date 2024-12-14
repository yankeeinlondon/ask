import type {
  Ask,
  AskApi,
  FromRequirements,
  RequirementDescriptor,
  Requirements,
} from "src/types";
import { isRequirementDescriptor } from "src/type-guards";
import { normalizeChoices } from "src/utils";
import { service } from "src/utils/service";


const input = <TReq extends Requirements>(
  req: TReq
): AskApi<TReq>["input"] => (name, prompt, opt) => service(req, "input", null)(name,prompt,opt);

const numeric = <TReq extends Requirements>(
  req: TReq
): AskApi<TReq>["number"] => (name, prompt, opt) => service(req, "number", null)(name,prompt,opt);

const password = <TReq extends Requirements>(
  req: TReq
): AskApi<TReq>["password"] => (
  name, prompt, opt
) => service(req, "password", null)(name, prompt, opt);

const confirm = <TReq extends Requirements>(
  req: TReq
): AskApi<TReq>["confirm"] => (
  name, prompt, opt
) => service(req, "confirm", null)(name, prompt, opt);

const select = <TReq extends Requirements>(
  req: TReq
): AskApi<TReq>["select"] => (
  name, prompt, choices, opt
) => service(req, "select", normalizeChoices(choices))(name, prompt, opt);

const checkbox = <TReq extends Requirements>(
  req: TReq
): AskApi<TReq>["checkbox"] => (
  name, prompt, choices, opt
) => service(req, "checkbox", normalizeChoices(choices))(name, prompt, opt);

const rawlist = <TReq extends Requirements>(
  req: TReq
): AskApi<TReq>["rawlist"] => (
  name, prompt, choices, opt
) => service(req, "rawlist", normalizeChoices(choices))(name, prompt, opt);

const expand = <TReq extends Requirements>(
  req: TReq
): AskApi<TReq>["expand"] => (
  name, prompt, choices, opt
) => service(req, "expand", normalizeChoices(choices))(name, prompt, opt);

const editor = <TReq extends Requirements>(
  req: TReq
): AskApi<TReq>["editor"] => (
  name, prompt, opt
) => service(req, "editor", null)(name, prompt, opt);

const askApi: Ask = <TReq extends Requirements>(req: TReq) =>
  ({
    input: input(req),
    number: numeric(req),
    password: password(req),
    confirm: confirm(req),
    select: select(req),
    checkbox: checkbox(req),
    rawlist: rawlist(req),    
    expand: expand(req),
    editor: editor(req),


    withRequirements: (isRequirementDescriptor(req)
      ? (req as Readonly<FromRequirements<TReq>>)
      : <T extends RequirementDescriptor>(req: T) =>
          askApi(req)) as TReq extends RequirementDescriptor
      ? Readonly<FromRequirements<TReq>>
      : <T extends RequirementDescriptor>(req: T) => AskApi<T>,
  });

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
