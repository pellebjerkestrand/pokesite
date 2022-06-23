import type { Bindings } from "../../server/function-bindings.types";
import { httpInBinding, httpOutBinding } from "../../server/http-bindings";
import { queueOutBinding } from "../../server/queue-bindings";
import { queueName } from "../../server/resource-list-helpers";

export const bindings: Bindings = [
  httpInBinding({ route: "/" }),
  httpOutBinding(),
  queueOutBinding(queueName),
];
