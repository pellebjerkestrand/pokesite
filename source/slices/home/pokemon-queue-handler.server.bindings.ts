import type { Bindings } from "../../server/function-bindings";
import { queueName } from "../../server/pokemon-queue-helper";
import { queueInBinding } from "../../server/queue-bindings";

export const bindings: Bindings = [queueInBinding(queueName)];
