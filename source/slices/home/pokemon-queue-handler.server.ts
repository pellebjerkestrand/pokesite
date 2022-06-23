import fetch from "node-fetch";

import { getFromCache, GetOutcome, set, SetOutcome } from "../../server/data";
import { isUrl } from "../../server/is-url";
import type { QueueHandlerFunction } from "../../server/queue-function.types";
import { resourceListDecoder } from "./resource-list";

export const run: QueueHandlerFunction = async (_, message) => {
  if (typeof message !== "string") {
    throw new Error(`Message is not a string. ${message}`);
  }

  if (!isUrl(message)) {
    throw new Error(`Message is not an URL. ${message}`);
  }

  const cacheResponse = await getFromCache(message, resourceListDecoder);
  if (cacheResponse.outcome === GetOutcome.success) {
    return;
  }

  const response = await fetch(message);
  if (!response.ok) {
    throw new Error(
      `Response is not OK. ${response.status} ${response.statusText} ${message}`
    );
  }

  const setOutcome = await set(message, await response.text());
  if (setOutcome === SetOutcome.failure) {
    throw new Error(`Could not set. ${message}`);
  }
};
