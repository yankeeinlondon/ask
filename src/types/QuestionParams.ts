import type { ExpandDictionary, HasRequiredProps } from "inferred-types";
import type { RequirementDescriptor } from "./Requirements";

/**
 * type utility which determines what a Question's parameters
 * should be.
 */
export type QuestionParams<TReq extends RequirementDescriptor> = HasRequiredProps<TReq> extends true
  ? [ answers: ExpandDictionary<TReq & Record<string, unknown>> ]
  : [ answers?: ExpandDictionary<TReq & Record<string, unknown>>];
