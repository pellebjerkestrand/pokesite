import type { Bindings } from "../../server/function-bindings.types";
import { queueInBinding } from "../../server/queue-bindings";
import { pokemonPropsQueueName } from "./pokemon-keys";

export const bindings: Bindings = [queueInBinding(pokemonPropsQueueName)];
