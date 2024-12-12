import type { RequirementDescriptor, Requirements } from "src/types";
import { isObject, isSimpleToken } from "inferred-types";

export function isRequirementDescriptor(val: Requirements): val is RequirementDescriptor {
  return isObject(val) && Object.values(val).every(v => isSimpleToken(v));
}
