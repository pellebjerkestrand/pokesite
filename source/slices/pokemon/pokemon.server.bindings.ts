import type { Bindings } from "../../server/function-bindings.types";
import { httpInBinding, httpOutBinding } from "../../server/http-bindings";
import { queueOutBinding } from "../../server/queue-bindings";
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
