import type { Question } from "src/types";
import { isObject } from "inferred-types";

export function isQuestion(val: unknown): val is Question {
  return isObject(val) && "requirements" in val && "choices" in val;
}
