import { isObject, isSimpleToken } from "inferred-types";
import { RequirementDescriptor } from "src/types";

/**
 * _type guard_ which validates whether the value passed in is of the
 * type `RequirementDescriptor` (which indicates that a question 
 * _does_ have some requirements).
 * 
 * Note: this _does not_ test whether the requirements were expressed
 * as REQUIRED or OPTIONAL.
 */
export const hasRequirements = (val: unknown): val is RequirementDescriptor => {
  return (
    isObject(val) && 
    Object.keys(val).length > 0 && 
    isSimpleToken(val[Object.keys(val)[0]])
  );
}
