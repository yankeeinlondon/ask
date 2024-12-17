import type {
  AsyncFunction,
  SyncFunction,
} from "inferred-types";
import type { RequirementDescriptor } from "./Requirements";

/**
 * Represents the When conditional as either a static boolean or
 * function returning a boolean.
 */
export type When<TReq extends RequirementDescriptor> =
  | boolean
  | AsyncFunction<[TReq], boolean>
  | SyncFunction<[TReq], boolean>;
