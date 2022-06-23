import { Namespace, write } from "../../server/cache";
import type { QueueHandlerFunction } from "../../server/queue-function.types";
import { fromMessage, FromMessageOutcome } from "./home-queue";
import { homeCacheKey } from "./home-keys";

export const run: QueueHandlerFunction = async (_, message) => {
  const result = fromMessage(message);

  switch (result.outcome) {
    case FromMessageOutcome.failure: {
      throw new Error(`Failed to decode message. ${result.value}`);
    }
    case FromMessageOutcome.success: {
      await write(Namespace.pageProps, homeCacheKey, result.value.home);
    }
  }
};
