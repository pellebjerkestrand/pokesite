import type { Bindings } from "../../server/function-bindings";
import { httpInBinding, httpOutBinding } from "../../server/http-bindings";
import { queueName } from "../../server/pokemon-queue-helper";
import { queueOutBinding } from "../../server/queue-bindings";

export const bindings: Bindings = [
  httpInBinding({ route: "/" }),
  httpOutBinding(),
  queueOutBinding(queueName),
];
