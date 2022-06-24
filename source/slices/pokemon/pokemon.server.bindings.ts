import type { Bindings } from "../../azure-functions/function-bindings.types";
import {
  httpInBinding,
  httpOutBinding,
} from "../../azure-functions/http-bindings";
import { queueOutBinding } from "../../azure-functions/queue-bindings";
import {
  pokemonPropsQueueName,
  pokemonResourceQueueName,
} from "./pokemon-keys";

export const bindings: Bindings = [
  httpInBinding({ route: "/{name}" }),
  httpOutBinding(),
  queueOutBinding(pokemonPropsQueueName),
  queueOutBinding(pokemonResourceQueueName),
];
