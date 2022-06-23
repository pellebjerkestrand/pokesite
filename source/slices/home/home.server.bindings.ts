import type { Bindings } from "../../server/function-bindings.types";
import { httpInBinding, httpOutBinding } from "../../server/http-bindings";
import { queueOutBinding } from "../../server/queue-bindings";
import { queueName as resourceListQueueName } from "../../server/resource-list-queue-name";
import { homeQueueName } from "./home-keys";

export const bindings: Bindings = [
  httpInBinding({ route: "/" }),
  httpOutBinding(),
  queueOutBinding(resourceListQueueName),
  queueOutBinding(homeQueueName),
];
