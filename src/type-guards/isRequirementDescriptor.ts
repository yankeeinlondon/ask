import type { RequirementDescriptor } from "src/types";
import { isObject, isSimpleToken } from "inferred-types";

export function isRequirementDescriptor(val: RequirementDescriptor): val is RequirementDescriptor {
  return isObject(val) && Object.values(val).every(v => isSimpleToken(v));
}
