import { Namespace, write } from "../../server/cache";
import type { QueueHandlerFunction } from "../../server/queue-function.types";
import { pokemonPropsCacheKey } from "./pokemon-keys";
import { fromMessage, FromMessageOutcome } from "./pokemon-props-queue";

export const run: QueueHandlerFunction = async (_, message) => {
  const result = fromMessage(message);

  switch (result.outcome) {
    case FromMessageOutcome.failure: {
      throw new Error(`Failed to decode message. ${result.value}`);
    }
    case FromMessageOutcome.success: {
      await write(
        Namespace.pageProps,
        pokemonPropsCacheKey(result.value.props.name),
        result.value.props
      );
    }
  }
};
