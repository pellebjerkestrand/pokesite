import type { Context } from "@azure/functions";
import type { JsonValue } from "type-fest";

export type QueueHandlerFunction = (
  context: Context,
  message: JsonValue
) => void;
