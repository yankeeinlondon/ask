import { isObject } from "inferred-types";
import { ChoiceDictProxy } from "src/types";

const CHOICE_KEYS = ["value","description","checked","short","disabled","key"];

/**
 * type guard which validates that the value passed in represents 
 * a `ChoiceDictProxy`.
 */
export const isChoiceDictProxy = (v: unknown): v is ChoiceDictProxy => {
  return isObject(v) && "value" in v && (
    ("kind" in v && v.kind==="choice") ||
    !("kind" in v)
  ) && Object.keys(v).every(k => CHOICE_KEYS.includes(k))
}
