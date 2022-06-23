import type { Bindings } from "../../server/function-bindings.types";
import { queueName } from "../../server/resource-list-helpers";
import { queueInBinding } from "../../server/queue-bindings";

export const bindings: Bindings = [queueInBinding(queueName)];
