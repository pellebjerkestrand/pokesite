import type { Bindings } from "../../server/function-bindings.types";
import { queueInBinding } from "../../server/queue-bindings";
import { pokemonResourceQueueName } from "./pokemon-keys";

export const bindings: Bindings = [queueInBinding(pokemonResourceQueueName)];
