import type { Bindings } from "../../server/function-bindings.types";
import { queueName } from "./response-cache-queue-helpers";
import { queueInBinding } from "../../server/queue-bindings";

export const bindings: Bindings = [queueInBinding(queueName)];
