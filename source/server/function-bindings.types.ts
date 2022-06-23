import type { HttpInBinding, HttpOutBinding } from "./http-bindings";
import type { QueueInBinding, QueueOutBinding } from "./queue-bindings";

export type Bindings = (
  | HttpInBinding
  | HttpOutBinding
  | QueueInBinding
  | QueueOutBinding
)[];
