import type { Bindings } from "../../server/function-bindings.types";
import { queueInBinding } from "../../server/queue-bindings";
import { homeQueueName } from "./home-keys";

export const bindings: Bindings = [queueInBinding(homeQueueName)];
