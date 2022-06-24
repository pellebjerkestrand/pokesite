import type { Bindings } from "../../azure-functions/function-bindings.types";
import {
  httpInBinding,
  httpOutBinding,
} from "../../azure-functions/http-bindings";
import { queueOutBinding } from "../../azure-functions/queue-bindings";
import { queueName as resourceListQueueName } from "../../server/resource-list-queue-name";
import { homeQueueName } from "./home-keys";

export const bindings: Bindings = [
  httpInBinding({ route: "/" }),
  httpOutBinding(),
  queueOutBinding(resourceListQueueName),
  queueOutBinding(homeQueueName),
];
