import type { EmptyObject, IsEqual, SimpleType } from "inferred-types";
import type { RequirementDescriptor, Requirements } from "./inquirer";

/**
 * Converts a `Requirements` value to a key/value
 * dictionary imposed by the requirements the question
 * has.
 */
export type FromRequirements<T extends Requirements> = T extends "no-requirements"
  ? EmptyObject
  : IsEqual<T, EmptyObject> extends true
    ? EmptyObject
    : T extends RequirementDescriptor
      ? {
          [K in keyof T]: SimpleType<T[K]>;
        }
      : never;
