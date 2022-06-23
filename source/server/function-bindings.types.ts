import type { HttpBindings } from "./http-bindings";
import type { QueueBindings } from "./queue-bindings";

export type Bindings = (HttpBindings[number] | QueueBindings[number])[];
