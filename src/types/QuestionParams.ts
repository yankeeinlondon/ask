import type { ExpandDictionary, HasRequiredProps } from "inferred-types";
import type { FromRequirements } from "./FromRequirements";
import type { RequirementDescriptor, Requirements } from "./inquirer";

/**
 * Boolean utility to test if question has any required properties
 */
export type HasRequiredReqs<T extends Requirements> =
  T extends "no-requirements"
    ? false
    : T extends RequirementDescriptor
      ? HasRequiredProps<T>
      : never;

/**
 * type utility which determines what a Question's parameters
 * should be.
 */
export type QuestionParams<TReq extends Requirements> = TReq extends RequirementDescriptor
  ? HasRequiredReqs<TReq> extends true
    ? [
        answers: ExpandDictionary<
          FromRequirements<TReq> & Record<string, unknown>
        >,
      ]
    : [
        answers?: ExpandDictionary<
          FromRequirements<TReq> & Record<string, unknown>
        >,
      ]
  : [answers?: Record<string, unknown>] | [];
