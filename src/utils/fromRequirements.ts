import type { FromRequirements, Requirements } from "src/types";
import { defineObject } from "inferred-types";

export function fromRequirements<T extends Requirements>(req: T) {
  return (
    req === "no-requirements"
      ? {}
      : defineObject(req)
  ) as unknown as FromRequirements<T>;
}
