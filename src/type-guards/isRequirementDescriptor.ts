import { isObject, isSimpleToken } from "inferred-types"
import { RequirementDescriptor, Requirements } from "src/types"


export const isRequirementDescriptor = (val: Requirements): val is RequirementDescriptor => {
  return isObject(val) && Object.values(val).every(v => isSimpleToken(v))
}
