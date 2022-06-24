import type { Bindings } from "../../azure-functions/function-bindings.types";
import { queueInBinding } from "../../azure-functions/queue-bindings";
import { homeQueueName } from "./home-keys";

export const bindings: Bindings = [queueInBinding(homeQueueName)];
