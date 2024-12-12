import type { ChoiceDictTuple } from "src/types";
import { isArray } from "inferred-types";

/**
 * Type guard which validates whether `val` is a `ChoiceDictTuple`
 */
export function isChoiceDictTuple(val: unknown): val is ChoiceDictTuple {
  return isArray(val) && val.length === 2 && typeof val[1] === "string";
}
