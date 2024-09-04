import { isArray } from "inferred-types";
import { ChoiceDictTuple } from "src/types";

/**
 * Type guard which validates whether `val` is a `ChoiceDictTuple`
 */
export const isChoiceDictTuple = (val: unknown): val is ChoiceDictTuple => {
  return isArray(val) && val.length === 2 && typeof val[1] === "string";
}


