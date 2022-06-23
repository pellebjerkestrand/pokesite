import type { Bindings } from "../../server/function-bindings.types";
import { queueName } from "../../server/resource-list-queue-name";
import { queueInBinding } from "../../server/queue-bindings";

export const bindings: Bindings = [queueInBinding(queueName)];
