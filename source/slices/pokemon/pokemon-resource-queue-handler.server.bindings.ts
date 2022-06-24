import type { Bindings } from "../../azure-functions/function-bindings.types";
import { queueInBinding } from "../../azure-functions/queue-bindings";
import { pokemonResourceQueueName } from "./pokemon-keys";

export const bindings: Bindings = [queueInBinding(pokemonResourceQueueName)];
