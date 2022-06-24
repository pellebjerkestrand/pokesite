import type { Bindings } from "../../azure-functions/function-bindings.types";
import { queueName } from "../../server/resource-list-queue-name";
import { queueInBinding } from "../../azure-functions/queue-bindings";

export const bindings: Bindings = [queueInBinding(queueName)];
